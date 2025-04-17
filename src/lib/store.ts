import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CycleDay, FlowLevel, Mood, Symptom, HealthDataSource, IoTReminder as IoTReminderType } from '@/types';

// Define the interface for the IoT reminder
export interface IoTReminder extends Omit<IoTReminderType, 'triggerTime'> {
  triggerTime: Date;
}

interface AppState {
  cycleDays: CycleDay[];
  healthSources: HealthDataSource[];
  reminders: IoTReminder[];
  
  addCycleDay: (day: CycleDay) => void;
  updateCycleDay: (date: Date, updates: Partial<CycleDay>) => void;
  deleteCycleDay: (date: Date) => void;
  
  connectHealthSource: (source: HealthDataSource) => void;
  disconnectHealthSource: (sourceId: string) => void;
  
  addReminder: (reminder: Omit<IoTReminder, 'id'>) => void;
  updateReminder: (id: string, updates: Partial<IoTReminder>) => void;
  deleteReminder: (id: string) => void;
  
  reset: () => void;
  undo: () => void;
}

const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        cycleDays: [],
        healthSources: [],
        reminders: [],
        
        addCycleDay: (day) => set(state => ({ cycleDays: [...state.cycleDays, day] })),
        updateCycleDay: (date, updates) => set(state => ({
          cycleDays: state.cycleDays.map(day =>
            day.date === date ? { ...day, ...updates } : day
          )
        })),
        deleteCycleDay: (date) => set(state => ({
          cycleDays: state.cycleDays.filter(day => day.date !== date)
        })),
        
        connectHealthSource: (source) => set(state => ({ healthSources: [...state.healthSources, source] })),
        disconnectHealthSource: (sourceId) => set(state => ({
          healthSources: state.healthSources.filter(source => source.id !== sourceId)
        })),
        
        addReminder: (reminder) => set(state => ({
          reminders: [...state.reminders, { id: crypto.randomUUID(), ...reminder }]
        })),
        updateReminder: (id, updates) => set(state => ({
          reminders: state.reminders.map(reminder =>
            reminder.id === id ? { ...reminder, ...updates } : reminder
          )
        })),
        deleteReminder: (id) => set(state => ({
          reminders: state.reminders.filter(reminder => reminder.id !== id)
        })),
        
        reset: () => set({ cycleDays: [], healthSources: [], reminders: [] }),
        undo: () => {
          // Basic undo - revert to previous state by recreating the store from persisted data
          const storedState = localStorage.getItem('zustand-app');
          if (storedState) {
            const previousState = JSON.parse(storedState);
            set(previousState);
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
