
import { CycleDay, CyclePrediction, CyclePhase, PhasePrediction, Symptom, LifeStage } from '@/types';
import { addDays, differenceInDays, subDays } from 'date-fns';
import * as tf from '@tensorflow/tfjs';

// Average cycle lengths (in days) for initial predictions
const AVERAGE_CYCLE_LENGTH = 28;
const AVERAGE_PERIOD_LENGTH = 5;
const AVERAGE_OVULATION_DAY = 14;
const FERTILE_WINDOW_LENGTH = 6; // 5 days before ovulation and the day of ovulation

// Define the type for the settings to avoid TypeScript errors
type LifeStageSettingType = {
  confidenceMultiplier?: number;
  cycleLengthVariance?: number;
  periodLengthVariance?: number;
  fertilityFocused?: boolean;
  disabled?: boolean;
};

// Life stage specific prediction settings
const LIFE_STAGE_SETTINGS: Record<LifeStage, LifeStageSettingType> = {
  [LifeStage.FIRST_PERIOD]: {
    confidenceMultiplier: 0.7, // Lower confidence for first period
    cycleLengthVariance: 5,   // Wider variance for predictions
    periodLengthVariance: 2
  },
  [LifeStage.STANDARD]: {
    confidenceMultiplier: 1.0,
    cycleLengthVariance: 2,
    periodLengthVariance: 1
  },
  [LifeStage.TTC]: {
    confidenceMultiplier: 1.2, // Higher confidence for TTC (more precise)
    cycleLengthVariance: 1,
    periodLengthVariance: 1,
    fertilityFocused: true
  },
  [LifeStage.PERIMENOPAUSE]: {
    confidenceMultiplier: 0.8, // Lower confidence for perimenopause
    cycleLengthVariance: 7,    // Much wider variance
    periodLengthVariance: 3
  },
  [LifeStage.NO_PERIOD]: {
    disabled: true  // No predictions for no-period mode
  },
  [LifeStage.PREGNANCY]: {
    disabled: true  // No cycle predictions during pregnancy
  }
};

/**
 * Simple prediction model for cycle phases that takes life stage into account
 */
export function predictCycle(cycleDays: CycleDay[], lifeStage: LifeStage = LifeStage.STANDARD): CyclePrediction | null {
  // Check if predictions should be disabled for this life stage
  const stageSettings = LIFE_STAGE_SETTINGS[lifeStage];
  if (stageSettings?.disabled) {
    return null;
  }

  if (cycleDays.length === 0) {
    return createDefaultPrediction(new Date(), lifeStage);
  }

  // Sort days by date
  const sortedDays = [...cycleDays].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // Find days with flow
  const flowDays = sortedDays.filter((day) => day.flow);
  
  if (flowDays.length === 0) {
    return createDefaultPrediction(new Date(), lifeStage);
  }

  // Find period start dates
  const periodStartDates: Date[] = [];
  let currentPeriodStart: Date | null = null;

  for (let i = 0; i < flowDays.length; i++) {
    const currentDay = flowDays[i];
    const prevDay = i > 0 ? flowDays[i - 1] : null;

    // If this is a new period (no previous day or gap of more than 2 days)
    if (!prevDay || differenceInDays(currentDay.date, prevDay.date) > 2) {
      currentPeriodStart = currentDay.date;
      periodStartDates.push(currentPeriodStart);
    }
  }

  // If we have at least 2 periods, calculate the average cycle length
  if (periodStartDates.length >= 2) {
    return predictUsingHistoricalData(periodStartDates, flowDays, lifeStage);
  }

  // Otherwise, use the most recent period and default values
  return createDefaultPrediction(periodStartDates[periodStartDates.length - 1], lifeStage);
}

/**
 * Predict cycle using historical period data
 */
function predictUsingHistoricalData(periodStartDates: Date[], flowDays: CycleDay[], lifeStage: LifeStage): CyclePrediction {
  const stageSettings = LIFE_STAGE_SETTINGS[lifeStage];
  
  // Calculate average cycle length from historical data
  let totalCycleLength = 0;
  for (let i = 1; i < periodStartDates.length; i++) {
    totalCycleLength += differenceInDays(periodStartDates[i], periodStartDates[i - 1]);
  }
  
  const avgCycleLength = totalCycleLength / (periodStartDates.length - 1);
  
  // Calculate average period length
  const periodLengths: { [key: string]: number } = {};
  for (const day of flowDays) {
    const dateStr = day.date.toISOString().split('T')[0];
    periodLengths[dateStr] = (periodLengths[dateStr] || 0) + 1;
  }
  
  let avgPeriodLength = Object.keys(periodLengths).length / periodStartDates.length;
  if (isNaN(avgPeriodLength) || avgPeriodLength <= 0) {
    avgPeriodLength = AVERAGE_PERIOD_LENGTH;
  }
  
  // Get the most recent period start date
  const lastPeriodStart = periodStartDates[periodStartDates.length - 1];
  
  // Predict next period start
  const nextPeriodStart = addDays(lastPeriodStart, Math.round(avgCycleLength));
  
  // Calculate other dates based on the next period start
  const nextPeriodEnd = addDays(nextPeriodStart, Math.round(avgPeriodLength) - 1);
  const nextOvulationDate = subDays(nextPeriodStart, Math.round(avgCycleLength / 2));
  const nextFertileWindowStart = subDays(nextOvulationDate, 5);
  const nextFertileWindowEnd = nextOvulationDate;
  
  // Create phase predictions
  const phases: PhasePrediction[] = [
    {
      phase: CyclePhase.MENSTRUAL,
      startDate: nextPeriodStart,
      endDate: nextPeriodEnd,
      symptoms: [Symptom.CRAMPS, Symptom.FATIGUE, Symptom.BREAST_TENDERNESS]
    },
    {
      phase: CyclePhase.FOLLICULAR,
      startDate: addDays(nextPeriodEnd, 1),
      endDate: subDays(nextFertileWindowStart, 1),
      symptoms: [Symptom.ENERGY]
    },
    {
      phase: CyclePhase.OVULATION,
      startDate: nextFertileWindowStart,
      endDate: nextFertileWindowEnd,
      symptoms: [Symptom.BREAST_TENDERNESS, Symptom.MOOD_SWINGS]
    },
    {
      phase: CyclePhase.LUTEAL,
      startDate: addDays(nextFertileWindowEnd, 1),
      endDate: subDays(nextPeriodStart, 1),
      symptoms: [Symptom.BLOATING, Symptom.BREAST_TENDERNESS, Symptom.MOOD_SWINGS]
    }
  ];
  
  // Calculate confidence based on number of historical cycles and life stage
  const baseConfidence = Math.min(0.5 + (periodStartDates.length * 0.05), 0.95);
  const confidence = Math.min(baseConfidence * (stageSettings?.confidenceMultiplier || 1.0), 0.95);
  
  return {
    nextPeriodStart,
    nextPeriodEnd,
    nextFertileWindowStart,
    nextFertileWindowEnd,
    nextOvulationDate,
    confidence,
    phases
  };
}

/**
 * Create default prediction using average cycle values
 */
function createDefaultPrediction(startDate: Date, lifeStage: LifeStage): CyclePrediction {
  const stageSettings = LIFE_STAGE_SETTINGS[lifeStage];
  
  // Add variance based on life stage
  const cycleVariance = stageSettings?.cycleLengthVariance || 0;
  const periodVariance = stageSettings?.periodLengthVariance || 0;
  
  // For first period, use wider prediction windows
  const cycleLength = AVERAGE_CYCLE_LENGTH + (Math.random() * cycleVariance * 2 - cycleVariance);
  const periodLength = AVERAGE_PERIOD_LENGTH + (Math.random() * periodVariance * 2 - periodVariance);
  
  const nextPeriodStart = addDays(startDate, Math.round(cycleLength));
  const nextPeriodEnd = addDays(nextPeriodStart, Math.round(periodLength) - 1);
  const nextOvulationDate = addDays(nextPeriodStart, -Math.round(cycleLength / 2));
  const nextFertileWindowStart = addDays(nextOvulationDate, -5);
  const nextFertileWindowEnd = nextOvulationDate;
  
  // Create phase predictions
  const phases: PhasePrediction[] = [
    {
      phase: CyclePhase.MENSTRUAL,
      startDate: nextPeriodStart,
      endDate: nextPeriodEnd,
      symptoms: [Symptom.CRAMPS, Symptom.FATIGUE, Symptom.BREAST_TENDERNESS]
    },
    {
      phase: CyclePhase.FOLLICULAR,
      startDate: addDays(nextPeriodEnd, 1),
      endDate: subDays(nextFertileWindowStart, 1),
      symptoms: [Symptom.ENERGY]
    },
    {
      phase: CyclePhase.OVULATION,
      startDate: nextFertileWindowStart,
      endDate: nextFertileWindowEnd,
      symptoms: [Symptom.BREAST_TENDERNESS, Symptom.MOOD_SWINGS]
    },
    {
      phase: CyclePhase.LUTEAL,
      startDate: addDays(nextFertileWindowEnd, 1),
      endDate: subDays(nextPeriodStart, 1),
      symptoms: [Symptom.BLOATING, Symptom.BREAST_TENDERNESS, Symptom.MOOD_SWINGS]
    }
  ];
  
  // Lower confidence for first-time predictions and adjust based on life stage
  const baseConfidence = 0.5;
  const confidence = baseConfidence * (stageSettings?.confidenceMultiplier || 1.0);
  
  return {
    nextPeriodStart,
    nextPeriodEnd,
    nextFertileWindowStart,
    nextFertileWindowEnd,
    nextOvulationDate,
    confidence,
    phases
  };
}

/**
 * Create an advanced ML model for more accurate predictions
 * This would be initialized and trained with historical data
 */
export async function createAdvancedPredictionModel(historicalData: CycleDay[]) {
  // We'll implement a simple model for demonstration
  // In a production app, this would be more sophisticated
  
  // Create a sequential model
  const model = tf.sequential();
  
  // Add layers
  model.add(tf.layers.dense({
    inputShape: [4], // Features: recent cycle lengths, period lengths, etc.
    units: 10,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 3, // Outputs: next cycle length, period length, ovulation day
    activation: 'linear'
  }));
  
  // Compile the model
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'meanSquaredError'
  });
  
  // In a real implementation, we would process historical data here
  // and train the model with user's specific patterns
  
  return model;
}

/**
 * Uses the advanced ML model for predictions
 * This would be called once the model is trained
 */
export async function predictUsingMlModel(
  model: tf.LayersModel, 
  recentCycles: number[], 
  lastPeriodStart: Date
): Promise<CyclePrediction> {
  // Process input data
  const input = tf.tensor2d([recentCycles], [1, recentCycles.length]);
  
  // Make prediction
  const prediction = model.predict(input) as tf.Tensor;
  const results = await prediction.array() as number[][];
  
  // Extract predicted values
  const [predictedCycleLength, predictedPeriodLength, predictedOvulationDay] = results[0];
  
  // Calculate dates based on predictions
  const nextPeriodStart = addDays(lastPeriodStart, Math.round(predictedCycleLength));
  const nextPeriodEnd = addDays(nextPeriodStart, Math.round(predictedPeriodLength) - 1);
  const nextOvulationDate = addDays(lastPeriodStart, Math.round(predictedOvulationDay));
  const nextFertileWindowStart = subDays(nextOvulationDate, 5);
  const nextFertileWindowEnd = nextOvulationDate;
  
  // Create phase predictions (similar to the simpler approach)
  const phases: PhasePrediction[] = [
    {
      phase: CyclePhase.MENSTRUAL,
      startDate: nextPeriodStart,
      endDate: nextPeriodEnd,
      symptoms: [Symptom.CRAMPS, Symptom.FATIGUE, Symptom.BREAST_TENDERNESS]
    },
    {
      phase: CyclePhase.FOLLICULAR,
      startDate: addDays(nextPeriodEnd, 1),
      endDate: subDays(nextFertileWindowStart, 1),
      symptoms: [Symptom.ENERGY]
    },
    {
      phase: CyclePhase.OVULATION,
      startDate: nextFertileWindowStart,
      endDate: nextFertileWindowEnd,
      symptoms: [Symptom.BREAST_TENDERNESS, Symptom.MOOD_SWINGS]
    },
    {
      phase: CyclePhase.LUTEAL,
      startDate: addDays(nextFertileWindowEnd, 1),
      endDate: subDays(nextPeriodStart, 1),
      symptoms: [Symptom.BLOATING, Symptom.BREAST_TENDERNESS, Symptom.MOOD_SWINGS]
    }
  ];
  
  // Higher confidence with ML model
  const confidence = 0.85;
  
  return {
    nextPeriodStart,
    nextPeriodEnd,
    nextFertileWindowStart,
    nextFertileWindowEnd,
    nextOvulationDate,
    confidence,
    phases
  };
}
