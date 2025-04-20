import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  CycleDay, FlowLevel, Mood, Symptom, HealthDataSource, IoTReminder as IoTReminderType, 
  User, Cycle, CyclePrediction, LifeStage, LifeStageChange, 
  LifeStageFeature, ConfidenceMeter, EducationalContent, FertilityData,
  PregnancyData, PerimenopausalData, HormoneTherapy, KickCount
} from '@/types';
import { predictCycle } from './prediction';
import { addDays } from 'date-fns';

// Define the interface for the IoT reminder
export interface IoTReminder extends Omit<IoTReminderType, 'triggerTime'> {
  triggerTime: Date;
  title: string;
  message: string;
  isRead: boolean;
  isActive: boolean;
  type: string;
}

// Life stage features data
const lifeStageFeatures: LifeStageFeature[] = [
  // First Period Features
  {
    id: 'first_period_carousel',
    title: 'Period 101 Carousel',
    description: 'Swipe cards explaining what\'s happening biologically and how to use period products',
    enabled: true,
    lifeStage: LifeStage.FIRST_PERIOD,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'confidence_meter',
    title: 'Confidence Meter',
    description: 'A simple bar that fills as the app gets three consecutive cycles logged correctly',
    enabled: true,
    lifeStage: LifeStage.FIRST_PERIOD,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'ask_nurse_chat',
    title: 'Ask-a-Nurse Chat',
    description: 'Opt-in, moderated chat window for puberty questions',
    enabled: true,
    lifeStage: LifeStage.FIRST_PERIOD,
    type: 'ui',
    implementationStatus: 'in_progress'
  },
  {
    id: 'loose_prediction',
    title: 'Loose Prediction Model',
    description: 'Wide windows and "learning" language as the app gets to know your cycle',
    enabled: true,
    lifeStage: LifeStage.FIRST_PERIOD,
    type: 'algorithm',
    implementationStatus: 'completed'
  },
  {
    id: 'parent_share',
    title: 'Parent/Guardian Share',
    description: 'Export a PDF of logs to a trusted adult without giving full account access',
    enabled: true,
    lifeStage: LifeStage.FIRST_PERIOD,
    type: 'ui',
    implementationStatus: 'planned'
  },
  
  // Standard Cycle Features
  {
    id: 'next_period_forecast',
    title: 'Next-Period & PMS Forecast',
    description: 'Calendar, widgets, and push reminders for upcoming periods',
    enabled: true,
    lifeStage: LifeStage.STANDARD,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'mood_symptom_logging',
    title: 'Daily Mood & Symptom Logging',
    description: 'Track your mood and symptoms with trend heat-maps',
    enabled: true,
    lifeStage: LifeStage.STANDARD,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'lifestyle_correlations',
    title: 'Lifestyle Correlations',
    description: '7/30-day insights about how your cycle affects sleep, energy, and more',
    enabled: true,
    lifeStage: LifeStage.STANDARD,
    type: 'algorithm',
    implementationStatus: 'in_progress'
  },
  {
    id: 'adaptive_prediction',
    title: 'Adaptive Prediction Engine',
    description: 'Algorithms that learn and improve with each cycle you track',
    enabled: true,
    lifeStage: LifeStage.STANDARD,
    type: 'algorithm',
    implementationStatus: 'completed'
  },
  {
    id: 'custom_reminders',
    title: 'Custom Reminders',
    description: 'Set notifications for medications, hydration, or workout recovery',
    enabled: true,
    lifeStage: LifeStage.STANDARD,
    type: 'ui',
    implementationStatus: 'completed'
  },
  
  // TTC Features
  {
    id: 'fertile_window',
    title: 'Fertile Window Countdown',
    description: 'Daily countdown to your most fertile days with partner-share option',
    enabled: true,
    lifeStage: LifeStage.TTC,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'ovulation_scanner',
    title: 'Ovulation Test Scanner',
    description: 'Camera feature that reads LH test lines and logs your surge',
    enabled: true,
    lifeStage: LifeStage.TTC,
    type: 'ui',
    implementationStatus: 'in_progress'
  },
  {
    id: 'temperature_insights',
    title: 'Basal Temperature Insights',
    description: 'Temperature and heart rate variability graphs to confirm ovulation',
    enabled: true,
    lifeStage: LifeStage.TTC,
    type: 'algorithm',
    implementationStatus: 'completed'
  },
  {
    id: 'sperm_quality',
    title: 'Sperm Quality Tips',
    description: 'Evidence-based advice on improving sperm quality and conception odds',
    enabled: true,
    lifeStage: LifeStage.TTC,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'preconception_checklist',
    title: 'Pre-conception Checklist',
    description: 'Track folic acid, vaccinations, and other pre-pregnancy preparations',
    enabled: true,
    lifeStage: LifeStage.TTC,
    type: 'ui',
    implementationStatus: 'completed'
  },
  
  // Pregnancy Features
  {
    id: 'gestational_tracker',
    title: 'Gestational Age Tracker',
    description: 'Week-by-week fetal development images and information',
    enabled: true,
    lifeStage: LifeStage.PREGNANCY,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'symptom_kick_counter',
    title: 'Symptom & Kick Counter',
    description: 'Track pregnancy symptoms and fetal movements with safety alerts',
    enabled: true,
    lifeStage: LifeStage.PREGNANCY,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'pregnancy_checklist',
    title: 'Pregnancy Checklist Hub',
    description: 'Prenatal visits, tests, and hospital bag preparation reminders',
    enabled: true,
    lifeStage: LifeStage.PREGNANCY,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'weight_vitals',
    title: 'Weight & Vitals Log',
    description: 'Track blood pressure, weight, and other important health metrics',
    enabled: true,
    lifeStage: LifeStage.PREGNANCY,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'due_date_widgets',
    title: 'Due Date Widgets',
    description: 'Countdown to your due date with sharing options for partners',
    enabled: true,
    lifeStage: LifeStage.PREGNANCY,
    type: 'ui',
    implementationStatus: 'in_progress'
  },
  
  // Perimenopause Features
  {
    id: 'expanded_symptom_tracking',
    title: 'Expanded Symptom Tracking',
    description: 'Track hot flashes, night sweats, brain fog, and other perimenopause symptoms',
    enabled: true,
    lifeStage: LifeStage.PERIMENOPAUSE,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'sleep_hrv',
    title: 'Sleep Quality & HRV',
    description: 'Monitor sleep patterns and heart rate variability changes',
    enabled: true,
    lifeStage: LifeStage.PERIMENOPAUSE,
    type: 'algorithm',
    implementationStatus: 'in_progress'
  },
  {
    id: 'hormone_therapy',
    title: 'Hormone Therapy Tracker',
    description: 'Log dosages, schedules, and side effects of hormone treatments',
    enabled: true,
    lifeStage: LifeStage.PERIMENOPAUSE,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'cycle_variability',
    title: 'Cycle Variability Graph',
    description: '12-month view highlighting changes in your cycle pattern',
    enabled: true,
    lifeStage: LifeStage.PERIMENOPAUSE,
    type: 'algorithm',
    implementationStatus: 'completed'
  },
  {
    id: 'clinician_referral',
    title: 'Clinician Referral',
    description: 'Get alerts when symptoms suggest you should consult a healthcare provider',
    enabled: true,
    lifeStage: LifeStage.PERIMENOPAUSE,
    type: 'ui',
    implementationStatus: 'planned'
  },
  
  // No Period Features
  {
    id: 'medication_adherence',
    title: 'Medication Adherence',
    description: 'Track HRT, prolactin-suppressants, and other medications with refill reminders',
    enabled: true,
    lifeStage: LifeStage.NO_PERIOD,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'recovery_milestones',
    title: 'Recovery Milestones',
    description: 'Track healing progress for surgical procedures or postpartum recovery',
    enabled: true,
    lifeStage: LifeStage.NO_PERIOD,
    type: 'ui',
    implementationStatus: 'completed'
  },
  {
    id: 'mood_sleep_dashboard',
    title: 'Mood & Sleep Dashboard',
    description: 'Monitor emotional wellbeing with depression screening tools',
    enabled: true,
    lifeStage: LifeStage.NO_PERIOD,
    type: 'ui',
    implementationStatus: 'in_progress'
  },
  {
    id: 'fertility_return',
    title: 'Fertility Return Estimator',
    description: 'For users coming off HRT or in post-partum amenorrhea',
    enabled: true,
    lifeStage: LifeStage.NO_PERIOD,
    type: 'algorithm',
    implementationStatus: 'planned'
  },
  {
    id: 'community_stories',
    title: 'Community Stories',
    description: 'Read experiences from others on a similar journey',
    enabled: true,
    lifeStage: LifeStage.NO_PERIOD,
    type: 'ui',
    implementationStatus: 'planned'
  }
];

// Sample carousel content for First Period
const periodCarouselContent: EducationalContent[] = [
  {
    id: 'period_101_1',
    title: 'What is Menstruation?',
    content: 'Menstruation is the monthly shedding of the lining of your uterus. It\'s a normal and healthy part of growing up.',
    mediaUrl: '/images/menstruation.svg',
    type: 'carousel',
    lifeStage: LifeStage.FIRST_PERIOD,
    completed: false
  },
  {
    id: 'period_101_2',
    title: 'Using Pads',
    content: 'Pads attach to your underwear and absorb your flow. They come in different sizes for different flow levels.',
    mediaUrl: '/images/pads.svg',
    type: 'carousel',
    lifeStage: LifeStage.FIRST_PERIOD,
    completed: false
  },
  {
    id: 'period_101_3',
    title: 'Using Tampons',
    content: 'Tampons are inserted into the vagina to absorb flow. They\'re great for activities like swimming.',
    mediaUrl: '/images/tampons.svg',
    type: 'carousel',
    lifeStage: LifeStage.FIRST_PERIOD,
    completed: false
  },
  {
    id: 'period_101_4',
    title: 'Using Menstrual Cups',
    content: 'Cups collect rather than absorb flow. They\'re reusable and eco-friendly.',
    mediaUrl: '/images/cups.svg',
    type: 'carousel',
    lifeStage: LifeStage.FIRST_PERIOD,
    completed: false
  }
];

interface LifeStageData {
  firstPeriod: {
    confidenceMeter: ConfidenceMeter | null;
    educationalContent: EducationalContent[];
  };
  ttc: {
    fertilityData: FertilityData[];
  };
  pregnancy: {
    pregnancyData: PregnancyData | null;
  };
  perimenopause: {
    perimenopausalData: PerimenopausalData[];
    hormoneTherapies: HormoneTherapy[];
  };
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Life Stage
  currentLifeStage: LifeStage;
  lifeStageHistory: LifeStageChange[];
  lifeStageFeatures: LifeStageFeature[];
  lifeStageData: LifeStageData;
  
  // Cycle data
  cycleDays: CycleDay[];
  cycles: Cycle[];
  currentCycleId: string | null;
  
  // Integrations
  healthSources: HealthDataSource[];
  reminders: IoTReminder[];
  
  // User actions for cycle data
  addCycleDay: (day: Omit<CycleDay, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCycleDay: (id: string, updates: Partial<CycleDay>) => void;
  deleteCycleDay: (id: string) => void;
  
  // Cycle management
  recalculatePredictions: () => void;
  
  // Life Stage management
  changeLifeStage: (newStage: LifeStage, reason?: string) => void;
  
  // Feature management
  getAvailableFeatures: () => LifeStageFeature[];
  toggleFeature: (featureId: string, enabled: boolean) => void;
  incrementFeatureUsage: (featureId: string) => void;
  
  // Life Stage specific actions
  // First Period
  updateConfidenceMeter: () => void;
  markContentCompleted: (contentId: string) => void;
  
  // TTC
  addFertilityData: (data: Omit<FertilityData, 'id'>) => void;
  
  // Pregnancy
  setPregnancyData: (data: Omit<PregnancyData, 'id'>) => void;
  updatePregnancyData: (updates: Partial<PregnancyData>) => void;
  addKickCount: (pregnancyId: string, kickCount: Omit<KickCount, 'id' | 'userId'>) => void;
  
  // Perimenopause
  addPerimenopausalData: (data: Omit<PerimenopausalData, 'id'>) => void;
  addHormoneTherapy: (therapy: Omit<HormoneTherapy, 'id'>) => void;
  updateHormoneTherapy: (id: string, updates: Partial<HormoneTherapy>) => void;
  
  // Health sources management
  connectHealthSource: (source: HealthDataSource) => void;
  disconnectHealthSource: (sourceId: string) => void;
  
  // Reminder management
  addReminder: (reminder: Omit<IoTReminder, 'id'>) => void;
  updateReminder: (id: string, updates: Partial<IoTReminder>) => void;
  deleteReminder: (id: string) => void;
  
  // Auth actions
  login: (user: User) => void;
  logout: () => void;
  
  // Reset and undo
  reset: () => void;
  undo: () => void;
}

const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        currentLifeStage: LifeStage.STANDARD,
        lifeStageHistory: [],
        lifeStageFeatures,
        lifeStageData: {
          firstPeriod: {
            confidenceMeter: null,
            educationalContent: periodCarouselContent,
          },
          ttc: {
            fertilityData: [],
          },
          pregnancy: {
            pregnancyData: null,
          },
          perimenopause: {
            perimenopausalData: [],
            hormoneTherapies: [],
          },
        },
        cycleDays: [],
        cycles: [],
        currentCycleId: null,
        healthSources: [],
        reminders: [],
        
        // Life Stage management
        changeLifeStage: (newStage, reason) => set(state => {
          // Don't change if it's the same
          if (state.currentLifeStage === newStage) {
            return state;
          }
          
          const change: LifeStageChange = {
            id: crypto.randomUUID(),
            userId: state.user?.id || 'guest',
            previousStage: state.currentLifeStage,
            newStage,
            changedAt: new Date(),
            reason
          };
          
          // Initialize stage-specific data if needed
          let updatedLifeStageData = { ...state.lifeStageData };
          
          if (newStage === LifeStage.FIRST_PERIOD && !state.lifeStageData.firstPeriod.confidenceMeter) {
            updatedLifeStageData.firstPeriod.confidenceMeter = {
              id: crypto.randomUUID(),
              userId: state.user?.id || 'guest',
              consecutiveCyclesLogged: 0,
              confidenceLevel: 0,
              lastUpdated: new Date()
            };
          } else if (newStage === LifeStage.PREGNANCY && !state.lifeStageData.pregnancy.pregnancyData) {
            const dueDate = addDays(new Date(), 280); // Assuming 40 weeks from now
            updatedLifeStageData.pregnancy.pregnancyData = {
              id: crypto.randomUUID(),
              userId: state.user?.id || 'guest',
              gestationalAge: 0,
              dueDate,
              lastUpdated: new Date(),
              symptoms: [],
              checklistItems: [
                {
                  id: crypto.randomUUID(),
                  title: 'First prenatal visit',
                  description: 'Schedule your first prenatal checkup',
                  completed: false,
                  dueDate: addDays(new Date(), 14),
                  category: 'prenatal_visit'
                },
                {
                  id: crypto.randomUUID(),
                  title: 'Start prenatal vitamins',
                  description: 'Begin taking recommended prenatal supplements',
                  completed: false,
                  category: 'other'
                }
              ]
            };
          }
          
          return {
            currentLifeStage: newStage,
            lifeStageHistory: [...state.lifeStageHistory, change],
            lifeStageData: updatedLifeStageData
          };
        }),
        
        // Feature management
        getAvailableFeatures: () => {
          const state = get();
          return state.lifeStageFeatures.filter(
            feature => feature.lifeStage === state.currentLifeStage && feature.enabled
          );
        },
        
        toggleFeature: (featureId, enabled) => set(state => ({
          lifeStageFeatures: state.lifeStageFeatures.map(feature => 
            feature.id === featureId ? { ...feature, enabled } : feature
          )
        })),
        
        incrementFeatureUsage: (featureId) => set(state => ({
          lifeStageFeatures: state.lifeStageFeatures.map(feature => 
            feature.id === featureId ? { 
              ...feature, 
              usageCount: (feature.usageCount || 0) + 1,
              lastUsed: new Date()
            } : feature
          )
        })),
        
        // Life Stage specific actions
        // First Period
        updateConfidenceMeter: () => set(state => {
          const { confidenceMeter } = state.lifeStageData.firstPeriod;
          
          if (!confidenceMeter) return state;
          
          // Check if user has logged cycles consecutively
          const sortedCycleDays = [...state.cycleDays].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          // Simple algorithm to detect consecutive cycles
          // In a real app, this would be more sophisticated
          const hasConsecutiveCycles = sortedCycleDays.length >= 6;
          
          const consecutiveCyclesLogged = hasConsecutiveCycles ? 
            Math.min(confidenceMeter.consecutiveCyclesLogged + 1, 3) : 
            confidenceMeter.consecutiveCyclesLogged;
          
          const confidenceLevel = Math.min((consecutiveCyclesLogged / 3) * 100, 100);
          
          return {
            lifeStageData: {
              ...state.lifeStageData,
              firstPeriod: {
                ...state.lifeStageData.firstPeriod,
                confidenceMeter: {
                  ...confidenceMeter,
                  consecutiveCyclesLogged,
                  confidenceLevel,
                  lastUpdated: new Date()
                }
              }
            }
          };
        }),
        
        markContentCompleted: (contentId) => set(state => ({
          lifeStageData: {
            ...state.lifeStageData,
            firstPeriod: {
              ...state.lifeStageData.firstPeriod,
              educationalContent: state.lifeStageData.firstPeriod.educationalContent.map(
                content => content.id === contentId ? { ...content, completed: true } : content
              )
            }
          }
        })),
        
        // TTC
        addFertilityData: (data) => set(state => ({
          lifeStageData: {
            ...state.lifeStageData,
            ttc: {
              ...state.lifeStageData.ttc,
              fertilityData: [
                ...state.lifeStageData.ttc.fertilityData,
                {
                  id: crypto.randomUUID(),
                  ...data
                }
              ]
            }
          }
        })),
        
        // Pregnancy
        setPregnancyData: (data) => set(state => ({
          lifeStageData: {
            ...state.lifeStageData,
            pregnancy: {
              ...state.lifeStageData.pregnancy,
              pregnancyData: {
                id: crypto.randomUUID(),
                ...data
              }
            }
          }
        })),
        
        updatePregnancyData: (updates) => set(state => {
          if (!state.lifeStageData.pregnancy.pregnancyData) return state;
          
          return {
            lifeStageData: {
              ...state.lifeStageData,
              pregnancy: {
                ...state.lifeStageData.pregnancy,
                pregnancyData: {
                  ...state.lifeStageData.pregnancy.pregnancyData!,
                  ...updates,
                  lastUpdated: new Date()
                }
              }
            }
          };
        }),
        
        addKickCount: (pregnancyId, kickCount) => set(state => {
          const pregnancyData = state.lifeStageData.pregnancy.pregnancyData;
          if (!pregnancyData || pregnancyData.id !== pregnancyId) return state;
          
          const newKickCount: KickCount = {
            id: crypto.randomUUID(),
            userId: state.user?.id || 'guest',
            ...kickCount
          };
          
          return {
            lifeStageData: {
              ...state.lifeStageData,
              pregnancy: {
                ...state.lifeStageData.pregnancy,
                pregnancyData: {
                  ...pregnancyData,
                  kickCounts: [
                    ...(pregnancyData.kickCounts || []),
                    newKickCount
                  ],
                  lastUpdated: new Date()
                }
              }
            }
          };
        }),
        
        // Perimenopause
        addPerimenopausalData: (data) => set(state => ({
          lifeStageData: {
            ...state.lifeStageData,
            perimenopause: {
              ...state.lifeStageData.perimenopause,
              perimenopausalData: [
                ...state.lifeStageData.perimenopause.perimenopausalData,
                {
                  id: crypto.randomUUID(),
                  ...data
                }
              ]
            }
          }
        })),
        
        addHormoneTherapy: (therapy) => set(state => ({
          lifeStageData: {
            ...state.lifeStageData,
            perimenopause: {
              ...state.lifeStageData.perimenopause,
              hormoneTherapies: [
                ...state.lifeStageData.perimenopause.hormoneTherapies,
                {
                  id: crypto.randomUUID(),
                  ...therapy
                }
              ]
            }
          }
        })),
        
        updateHormoneTherapy: (id, updates) => set(state => ({
          lifeStageData: {
            ...state.lifeStageData,
            perimenopause: {
              ...state.lifeStageData.perimenopause,
              hormoneTherapies: state.lifeStageData.perimenopause.hormoneTherapies.map(
                therapy => therapy.id === id ? { ...therapy, ...updates } : therapy
              )
            }
          }
        })),
        
        // Add a cycle day
        addCycleDay: (day) => set(state => {
          const newCycleDay = { 
            id: crypto.randomUUID(), 
            ...day, 
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: state.user?.id || 'guest'
          };
          
          const updatedCycleDays = [...state.cycleDays, newCycleDay];
          
          // After adding a day, recalculate predictions
          setTimeout(() => get().recalculatePredictions(), 0);
          
          return { 
            cycleDays: updatedCycleDays
          };
        }),
        
        // Update a cycle day
        updateCycleDay: (id, updates) => set(state => {
          const updatedCycleDays = state.cycleDays.map(day =>
            day.id === id ? { ...day, ...updates, updatedAt: new Date() } : day
          );
          
          // After updating a day, recalculate predictions
          setTimeout(() => get().recalculatePredictions(), 0);
          
          return { 
            cycleDays: updatedCycleDays
          };
        }),
        
        // Delete a cycle day
        deleteCycleDay: (id) => set(state => {
          const updatedCycleDays = state.cycleDays.filter(day => day.id !== id);
          
          // After deleting a day, recalculate predictions
          setTimeout(() => get().recalculatePredictions(), 0);
          
          return { 
            cycleDays: updatedCycleDays
          };
        }),
        
        // Recalculate predictions based on existing cycle days
        recalculatePredictions: () => set(state => {
          // If there are no cycle days with flow data, clear all predictions
          const flowDays = state.cycleDays.filter(day => day.flow);
          if (flowDays.length === 0) {
            return {
              cycles: state.cycles.map(cycle => ({
                ...cycle,
                predictions: undefined
              })),
              currentCycleId: null
            };
          }
          
          // Sort days by date
          const sortedDays = [...state.cycleDays].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          // Get predictions
          const predictions = predictCycle(sortedDays, state.currentLifeStage);
          
          // Create or update cycle
          let updatedCycles = [...state.cycles];
          let currentCycleId = state.currentCycleId;
          
          // If we don't have a current cycle and we have predictions, create one
          if (!currentCycleId && predictions) {
            const newCycle: Cycle = {
              id: crypto.randomUUID(),
              startDate: new Date(),
              userId: state.user?.id || 'guest',
              cycleData: sortedDays,
              predictions
            };
            
            updatedCycles = [...updatedCycles, newCycle];
            currentCycleId = newCycle.id;
          } else if (currentCycleId) {
            // Update existing cycle
            updatedCycles = updatedCycles.map(cycle => 
              cycle.id === currentCycleId 
                ? { 
                    ...cycle, 
                    cycleData: sortedDays,
                    predictions
                  }
                : cycle
            );
          }
          
          return {
            cycles: updatedCycles,
            currentCycleId
          };
        }),
        
        // Health source management
        connectHealthSource: (source) => set(state => ({ 
          healthSources: [...state.healthSources, source] 
        })),
        
        disconnectHealthSource: (sourceId) => set(state => ({
          healthSources: state.healthSources.filter(source => source.id !== sourceId)
        })),
        
        // Reminder management
        addReminder: (reminder) => set(state => ({
          reminders: [...state.reminders, { 
            id: crypto.randomUUID(), 
            ...reminder,
            userId: state.user?.id || 'guest'
          }]
        })),
        
        updateReminder: (id, updates) => set(state => ({
          reminders: state.reminders.map(reminder =>
            reminder.id === id ? { ...reminder, ...updates } : reminder
          )
        })),
        
        deleteReminder: (id) => set(state => ({
          reminders: state.reminders.filter(reminder => reminder.id !== id)
        })),
        
        // Auth actions
        login: (user) => set({ user, isAuthenticated: true }),
        logout: () => set({ user: null, isAuthenticated: false }),
        
        // Reset and undo actions
        reset: () => set({ 
          cycleDays: [], 
          healthSources: [], 
          reminders: [],
          cycles: [],
          currentCycleId: null,
          currentLifeStage: LifeStage.STANDARD,
          lifeStageHistory: []
        }),
        
        undo: () => {
          // Basic undo - revert to previous state by recreating the store from persisted data
          const storedState = localStorage.getItem('app');
          if (storedState) {
            const previousState = JSON.parse(storedState);
            set(previousState.state);
          }
        },
      }),
      {
        name: 'app',
      }
    )
  )
);

export { useAppStore };
