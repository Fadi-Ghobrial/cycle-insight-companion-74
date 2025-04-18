// User related types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  createdAt: Date;
}

// Life Stage types
export enum LifeStage {
  FIRST_PERIOD = 'first_period',
  STANDARD = 'standard',
  TTC = 'trying_to_conceive',
  PREGNANCY = 'pregnancy',
  PERIMENOPAUSE = 'perimenopause',
  NO_PERIOD = 'no_period'
}

export interface LifeStageChange {
  id: string;
  userId: string;
  previousStage?: LifeStage;
  newStage: LifeStage;
  changedAt: Date;
  reason?: string;
}

// Life Stage Feature types
export interface LifeStageFeature {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  lifeStage: LifeStage;
  type: 'ui' | 'algorithm';
  implementationStatus: 'planned' | 'in_progress' | 'completed';
  usageCount?: number;
  lastUsed?: Date;
}

// Period tracking types
export interface CycleDay {
  id: string;
  date: Date;
  flow?: FlowLevel;
  symptoms: Symptom[];
  moods: Mood[]; // Changed from mood?: Mood to moods: Mood[]
  notes?: string;
  baselTemperature?: number;
  lhTestResult?: LHTestResult;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Cycle {
  id: string;
  startDate: Date;
  endDate?: Date;
  daysInCycle?: number;
  userId: string;
  cycleData: CycleDay[];
  predictions?: CyclePrediction;
}

export interface CyclePrediction {
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  nextFertileWindowStart: Date;
  nextFertileWindowEnd: Date;
  nextOvulationDate: Date;
  confidence: number; // 0-1
  phases: PhasePrediction[];
}

export interface PhasePrediction {
  phase: CyclePhase;
  startDate: Date;
  endDate: Date;
  symptoms?: Symptom[];
}

export enum CyclePhase {
  MENSTRUAL = 'menstrual',
  FOLLICULAR = 'follicular',
  OVULATION = 'ovulation',
  LUTEAL = 'luteal',
}

export enum FlowLevel {
  SPOTTING = 'spotting',
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
  VERY_HEAVY = 'very_heavy',
}

export enum Symptom {
  CRAMPS = 'cramps',
  HEADACHE = 'headache',
  BLOATING = 'bloating',
  FATIGUE = 'fatigue',
  ENERGY = 'energy',
  BREAST_TENDERNESS = 'breast_tenderness',
  ACNE = 'acne',
  BACKACHE = 'backache',
  NAUSEA = 'nausea',
  INSOMNIA = 'insomnia',
  CONSTIPATION = 'constipation',
  DIARRHEA = 'diarrhea',
  CRAVINGS = 'cravings',
  MOOD_SWINGS = 'mood_swings',
  OTHER = 'other',
}

export enum Mood {
  HAPPY = 'happy',
  SENSITIVE = 'sensitive',
  SAD = 'sad',
  ENERGETIC = 'energetic',
  TIRED = 'tired',
  ANXIOUS = 'anxious',
  IRRITABLE = 'irritable',
  CALM = 'calm',
}

export enum LHTestResult {
  NEGATIVE = 'negative',
  POSITIVE = 'positive',
  HIGH = 'high',
  PEAK = 'peak',
}

export interface HealthDataSource {
  id: string;
  type: 'apple_health' | 'samsung_health' | 'manual';
  connected: boolean;
  lastSynced?: Date;
}

export interface HealthData {
  id: string;
  source: HealthDataSource;
  type: string;
  value: number;
  unit: string;
  timestamp: Date;
  userId: string;
}

// IoT and smart home types
export interface IoTReminder {
  id: string;
  type: string; // e.g., 'smart_mirror', 'smart_light', etc.
  message: string;
  triggerTime: Date;
  repeat: boolean;
  repeatInterval?: 'daily' | 'weekly' | 'monthly' | 'cycle_start' | 'fertile_window';
  userId: string;
  enabled: boolean;
}

export interface LocalHealthEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  category: string;
  url?: string;
}

// Action tracking for undo/redo functionality
export interface UserAction {
  id: string;
  type: ActionType;
  payload: any;
  timestamp: Date;
  userId: string;
  relatedActions?: string[]; // IDs of related actions
}

export enum ActionType {
  ADD_CYCLE_DAY = 'add_cycle_day',
  UPDATE_CYCLE_DAY = 'update_cycle_day',
  DELETE_CYCLE_DAY = 'delete_cycle_day',
  RECALCULATE_PREDICTIONS = 'recalculate_predictions',
  RESET = 'reset',
}

// Machine learning model types
export interface PredictionModel {
  id: string;
  userId: string;
  modelType: 'personal' | 'general';
  version: string;
  accuracy: number;
  lastTrainedOn: Date;
  features: string[];
}

// Educational content types
export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  summary: string;
  content: string;
  lastUpdated: Date;
  readTime: number; // in minutes
  vetted: boolean;
  author: string;
  sources?: string[];
  lifeStages?: LifeStage[]; // Articles can be targeted to specific life stages
}

export enum ArticleCategory {
  BASICS = 'menstrual_basics',
  HEALTH = 'menstrual_health',
  SYMPTOMS = 'symptoms_and_conditions',
  WELLNESS = 'wellness_and_lifestyle',
  MYTHS = 'myths_and_facts',
  SCIENCE = 'science_and_research'
}

// First Period specific types
export interface ConfidenceMeter {
  id: string;
  userId: string;
  consecutiveCyclesLogged: number;
  confidenceLevel: number; // 0-100
  lastUpdated: Date;
}

export interface EducationalContent {
  id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  type: 'carousel' | 'article' | 'video';
  lifeStage: LifeStage;
  completed: boolean;
}

// TTC specific types
export interface FertilityData {
  id: string;
  userId: string;
  cycleId: string;
  ovulationTestResult?: LHTestResult;
  basalTemperature?: number;
  cervicalMucus?: CervicalMucus;
  intercourseLogged?: boolean;
  date: Date;
  notes?: string;
}

export enum CervicalMucus {
  DRY = 'dry',
  STICKY = 'sticky',
  CREAMY = 'creamy',
  WATERY = 'watery',
  EGG_WHITE = 'egg_white'
}

// Pregnancy specific types
export interface PregnancyData {
  id: string;
  userId: string;
  gestationalAge: number; // in days
  dueDate: Date;
  lastUpdated: Date;
  symptoms: PregnancySymptom[];
  kickCounts?: KickCount[];
  checklistItems: ChecklistItem[];
}

export interface KickCount {
  id: string;
  userId: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  count: number;
  duration?: number; // in minutes
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  category: 'prenatal_visit' | 'test' | 'preparation' | 'other';
}

export enum PregnancySymptom {
  NAUSEA = 'nausea',
  FATIGUE = 'fatigue',
  BREAST_TENDERNESS = 'breast_tenderness',
  HEADACHE = 'headache',
  BACK_PAIN = 'back_pain',
  SWELLING = 'swelling',
  CONTRACTIONS = 'contractions',
  REDUCED_MOVEMENT = 'reduced_movement'
}

// Perimenopause specific types
export interface PerimenopausalData {
  id: string;
  userId: string;
  date: Date;
  symptoms: PerimenopausalSymptom[];
  hormoneTherapy?: HormoneTherapy;
  sleepQuality?: number; // 1-10
  hrvData?: number;
}

export interface HormoneTherapy {
  id: string;
  userId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  sideEffects?: string[];
}

export enum PerimenopausalSymptom {
  HOT_FLASH = 'hot_flash',
  NIGHT_SWEAT = 'night_sweat',
  INSOMNIA = 'insomnia',
  MOOD_CHANGES = 'mood_changes',
  VAGINAL_DRYNESS = 'vaginal_dryness',
  BRAIN_FOG = 'brain_fog',
  REDUCED_LIBIDO = 'reduced_libido',
  JOINT_PAIN = 'joint_pain',
  PALPITATIONS = 'palpitations'
}
