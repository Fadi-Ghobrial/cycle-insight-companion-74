
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CycleDay, FlowLevel, Mood, Symptom, HealthDataSource, IoTReminder as IoTReminderType, User, Cycle, CyclePrediction } from '@/types';
import { predictCycle } from './prediction';

// Define the interface for the IoT reminder
export interface IoTReminder extends Omit<IoTReminderType, 'triggerTime'> {
  triggerTime: Date;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
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
        cycleDays: [],
        cycles: [],
        currentCycleId: null,
        healthSources: [],
        reminders: [],
        
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
          if (state.cycleDays.length === 0) return {};
          
          // Sort days by date
          const sortedDays = [...state.cycleDays].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          // Get predictions
          const predictions = predictCycle(sortedDays);
          
          // Create or update cycle
          let updatedCycles = [...state.cycles];
          let currentCycleId = state.currentCycleId;
          
          // If we don't have a current cycle, create one
          if (!currentCycleId) {
            const newCycle: Cycle = {
              id: crypto.randomUUID(),
              startDate: new Date(),
              userId: state.user?.id || 'guest',
              cycleData: sortedDays,
              predictions
            };
            
            updatedCycles = [...updatedCycles, newCycle];
            currentCycleId = newCycle.id;
          } else {
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
          currentCycleId: null
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
