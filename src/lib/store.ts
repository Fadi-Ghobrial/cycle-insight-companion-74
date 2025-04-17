
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Cycle, CycleDay, UserAction, HealthDataSource, IoTReminder, CyclePrediction, ActionType } from '@/types';
import { addDays, differenceInDays, isWithinInterval, startOfDay } from 'date-fns';
import { predictCycle } from './prediction';

interface AppState {
  // Authentication state
  user: User | null;
  isAuthenticated: boolean;

  // Cycle tracking state
  cycles: Cycle[];
  currentCycleId: string | null;
  cycleDays: CycleDay[];
  
  // Health integration state
  healthSources: HealthDataSource[];
  
  // IoT reminders
  reminders: IoTReminder[];
  
  // Actions history for undo/redo
  actions: UserAction[];
  redoStack: UserAction[];
  
  // Functions for managing state
  login: (user: User) => void;
  logout: () => void;
  addCycleDay: (cycleDay: Omit<CycleDay, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateCycleDay: (id: string, data: Partial<CycleDay>) => void;
  deleteCycleDay: (id: string) => void;
  recalculatePredictions: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  connectHealthSource: (source: HealthDataSource) => void;
  disconnectHealthSource: (id: string) => void;
  addReminder: (reminder: Omit<IoTReminder, 'id'>) => void;
  updateReminder: (id: string, data: Partial<IoTReminder>) => void;
  deleteReminder: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      cycles: [],
      currentCycleId: null,
      cycleDays: [],
      healthSources: [],
      reminders: [],
      actions: [],
      redoStack: [],
      
      // Authentication functions
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      
      // Cycle tracking functions
      addCycleDay: (cycleDayData) => {
        const { user, cycles, cycleDays } = get();
        if (!user) return;
        
        // Generate ID and timestamps
        const id = crypto.randomUUID();
        const now = new Date();
        const date = startOfDay(cycleDayData.date);
        
        // Create the new cycle day
        const cycleDay: CycleDay = {
          id,
          date,
          ...cycleDayData,
          createdAt: now,
          updatedAt: now,
          userId: user.id,
        };
        
        // Create an action for undo/redo
        const action: UserAction = {
          id: crypto.randomUUID(),
          type: ActionType.ADD_CYCLE_DAY,
          payload: { cycleDay },
          timestamp: now,
          userId: user.id,
        };
        
        // Check if the day already exists
        const existingDayIndex = cycleDays.findIndex(
          (day) => day.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
        );
        
        let newCycleDays: CycleDay[];
        
        if (existingDayIndex >= 0) {
          // Update existing day
          newCycleDays = [...cycleDays];
          newCycleDays[existingDayIndex] = cycleDay;
        } else {
          // Add new day
          newCycleDays = [...cycleDays, cycleDay];
        }
        
        // Update state with new cycle day and action
        set((state) => ({
          cycleDays: newCycleDays,
          actions: [action, ...state.actions],
          redoStack: [], // Clear redo stack on new action
        }));
        
        // Recalculate predictions
        get().recalculatePredictions();
      },
      
      updateCycleDay: (id, data) => {
        const { user, cycleDays } = get();
        if (!user) return;
        
        // Find the cycle day to update
        const dayIndex = cycleDays.findIndex((day) => day.id === id);
        if (dayIndex < 0) return;
        
        // Create updated cycle day
        const updatedDay = {
          ...cycleDays[dayIndex],
          ...data,
          updatedAt: new Date(),
        };
        
        // Create action for undo/redo
        const action: UserAction = {
          id: crypto.randomUUID(),
          type: ActionType.UPDATE_CYCLE_DAY,
          payload: { 
            id, 
            oldData: cycleDays[dayIndex],
            newData: updatedDay 
          },
          timestamp: new Date(),
          userId: user.id,
        };
        
        // Update state
        const newCycleDays = [...cycleDays];
        newCycleDays[dayIndex] = updatedDay;
        
        set((state) => ({
          cycleDays: newCycleDays,
          actions: [action, ...state.actions],
          redoStack: [], // Clear redo stack
        }));
        
        // Recalculate predictions
        get().recalculatePredictions();
      },
      
      deleteCycleDay: (id) => {
        const { user, cycleDays } = get();
        if (!user) return;
        
        // Find day to delete
        const dayIndex = cycleDays.findIndex((day) => day.id === id);
        if (dayIndex < 0) return;
        
        // Create action for undo/redo
        const action: UserAction = {
          id: crypto.randomUUID(),
          type: ActionType.DELETE_CYCLE_DAY,
          payload: { cycleDay: cycleDays[dayIndex] },
          timestamp: new Date(),
          userId: user.id,
        };
        
        // Update state
        const newCycleDays = cycleDays.filter((day) => day.id !== id);
        
        set((state) => ({
          cycleDays: newCycleDays,
          actions: [action, ...state.actions],
          redoStack: [], // Clear redo stack
        }));
        
        // Recalculate predictions
        get().recalculatePredictions();
      },
      
      recalculatePredictions: () => {
        const { user, cycleDays, cycles } = get();
        if (!user || cycleDays.length === 0) return;
        
        // Sort cycle days by date
        const sortedDays = [...cycleDays].sort(
          (a, b) => a.date.getTime() - b.date.getTime()
        );
        
        // Group days into cycles based on flow
        const flowDays = sortedDays.filter((day) => day.flow);
        
        if (flowDays.length === 0) return;
        
        // Find current cycle or create new one
        let currentCycle = cycles.find((c) => c.id === get().currentCycleId);
        
        if (!currentCycle) {
          // Create a new cycle
          const mostRecentFlowDay = flowDays[flowDays.length - 1];
          
          currentCycle = {
            id: crypto.randomUUID(),
            startDate: mostRecentFlowDay.date,
            userId: user.id,
            cycleData: [],
          };
        }
        
        // Generate predictions using ML algorithm
        const predictions = predictCycle(sortedDays);
        
        // Update the current cycle with predictions
        const updatedCycle = {
          ...currentCycle,
          predictions,
          cycleData: sortedDays.filter((day) => 
            isWithinInterval(day.date, {
              start: currentCycle!.startDate,
              end: predictions.nextPeriodStart
            })
          ),
        };
        
        // Create action for undo/redo
        const action: UserAction = {
          id: crypto.randomUUID(),
          type: ActionType.RECALCULATE_PREDICTIONS,
          payload: { 
            oldPredictions: currentCycle.predictions,
            newPredictions: predictions 
          },
          timestamp: new Date(),
          userId: user.id,
        };
        
        // Update cycles state
        const newCycles = cycles.filter((c) => c.id !== currentCycle!.id);
        
        set((state) => ({
          cycles: [...newCycles, updatedCycle],
          currentCycleId: updatedCycle.id,
          actions: [action, ...state.actions],
          redoStack: [], // Clear redo stack
        }));
      },
      
      undo: () => {
        const { actions } = get();
        if (actions.length === 0) return;
        
        // Get most recent action
        const latestAction = actions[0];
        
        // Handle undo based on action type
        switch (latestAction.type) {
          case ActionType.ADD_CYCLE_DAY: {
            // Remove the added cycle day
            const { cycleDay } = latestAction.payload;
            const newCycleDays = get().cycleDays.filter((day) => day.id !== cycleDay.id);
            
            set((state) => ({
              cycleDays: newCycleDays,
              actions: state.actions.slice(1),
              redoStack: [latestAction, ...state.redoStack],
            }));
            break;
          }
          
          case ActionType.UPDATE_CYCLE_DAY: {
            // Revert to previous state
            const { id, oldData } = latestAction.payload;
            const dayIndex = get().cycleDays.findIndex((day) => day.id === id);
            
            if (dayIndex >= 0) {
              const newCycleDays = [...get().cycleDays];
              newCycleDays[dayIndex] = oldData;
              
              set((state) => ({
                cycleDays: newCycleDays,
                actions: state.actions.slice(1),
                redoStack: [latestAction, ...state.redoStack],
              }));
            }
            break;
          }
          
          case ActionType.DELETE_CYCLE_DAY: {
            // Restore deleted day
            const { cycleDay } = latestAction.payload;
            
            set((state) => ({
              cycleDays: [cycleDay, ...state.cycleDays],
              actions: state.actions.slice(1),
              redoStack: [latestAction, ...state.redoStack],
            }));
            break;
          }
          
          case ActionType.RECALCULATE_PREDICTIONS: {
            // Revert predictions
            const { oldPredictions } = latestAction.payload;
            const cycleIndex = get().cycles.findIndex((c) => c.id === get().currentCycleId);
            
            if (cycleIndex >= 0) {
              const newCycles = [...get().cycles];
              newCycles[cycleIndex] = {
                ...newCycles[cycleIndex],
                predictions: oldPredictions,
              };
              
              set((state) => ({
                cycles: newCycles,
                actions: state.actions.slice(1),
                redoStack: [latestAction, ...state.redoStack],
              }));
            }
            break;
          }
          
          case ActionType.RESET: {
            // Restore previous state
            const { previousState } = latestAction.payload;
            
            set((state) => ({
              ...previousState,
              actions: state.actions.slice(1),
              redoStack: [latestAction, ...state.redoStack],
            }));
            break;
          }
        }
        
        // If related actions exist, undo them too
        if (latestAction.relatedActions?.length) {
          // Find all related actions and undo them
          const relatedActionIds = new Set(latestAction.relatedActions);
          const remainingActions = get().actions.filter(
            (action) => !relatedActionIds.has(action.id)
          );
          
          set({ actions: remainingActions });
        }
      },
      
      redo: () => {
        const { redoStack } = get();
        if (redoStack.length === 0) return;
        
        // Get action to redo
        const actionToRedo = redoStack[0];
        
        // Handle redo based on action type
        switch (actionToRedo.type) {
          case ActionType.ADD_CYCLE_DAY: {
            // Re-add the cycle day
            const { cycleDay } = actionToRedo.payload;
            
            set((state) => ({
              cycleDays: [...state.cycleDays, cycleDay],
              actions: [actionToRedo, ...state.actions],
              redoStack: state.redoStack.slice(1),
            }));
            break;
          }
          
          case ActionType.UPDATE_CYCLE_DAY: {
            // Re-apply the update
            const { id, newData } = actionToRedo.payload;
            const dayIndex = get().cycleDays.findIndex((day) => day.id === id);
            
            if (dayIndex >= 0) {
              const newCycleDays = [...get().cycleDays];
              newCycleDays[dayIndex] = newData;
              
              set((state) => ({
                cycleDays: newCycleDays,
                actions: [actionToRedo, ...state.actions],
                redoStack: state.redoStack.slice(1),
              }));
            }
            break;
          }
          
          case ActionType.DELETE_CYCLE_DAY: {
            // Re-delete the day
            const { cycleDay } = actionToRedo.payload;
            
            set((state) => ({
              cycleDays: state.cycleDays.filter((day) => day.id !== cycleDay.id),
              actions: [actionToRedo, ...state.actions],
              redoStack: state.redoStack.slice(1),
            }));
            break;
          }
          
          case ActionType.RECALCULATE_PREDICTIONS: {
            // Re-apply predictions
            const { newPredictions } = actionToRedo.payload;
            const cycleIndex = get().cycles.findIndex((c) => c.id === get().currentCycleId);
            
            if (cycleIndex >= 0) {
              const newCycles = [...get().cycles];
              newCycles[cycleIndex] = {
                ...newCycles[cycleIndex],
                predictions: newPredictions,
              };
              
              set((state) => ({
                cycles: newCycles,
                actions: [actionToRedo, ...state.actions],
                redoStack: state.redoStack.slice(1),
              }));
            }
            break;
          }
        }
      },
      
      reset: () => {
        const currentState = {
          cycles: get().cycles,
          cycleDays: get().cycleDays,
          currentCycleId: get().currentCycleId,
        };
        
        // Create action for undo
        const action: UserAction = {
          id: crypto.randomUUID(),
          type: ActionType.RESET,
          payload: { previousState: currentState },
          timestamp: new Date(),
          userId: get().user?.id || 'unknown',
        };
        
        // Reset to empty state
        set((state) => ({
          cycles: [],
          cycleDays: [],
          currentCycleId: null,
          actions: [action, ...state.actions],
          redoStack: [], // Clear redo stack
        }));
      },
      
      // Health integration functions
      connectHealthSource: (source) => {
        set((state) => ({
          healthSources: [...state.healthSources, source],
        }));
      },
      
      disconnectHealthSource: (id) => {
        set((state) => ({
          healthSources: state.healthSources.filter((source) => source.id !== id),
        }));
      },
      
      // IoT reminder functions
      addReminder: (reminderData) => {
        const { user } = get();
        if (!user) return;
        
        const reminder: IoTReminder = {
          id: crypto.randomUUID(),
          ...reminderData,
          userId: user.id,
        };
        
        set((state) => ({
          reminders: [...state.reminders, reminder],
        }));
      },
      
      updateReminder: (id, data) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, ...data } : reminder
          ),
        }));
      },
      
      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        }));
      },
    }),
    {
      name: 'cycle-insight-storage',
      partialize: (state) => ({
        cycles: state.cycles,
        cycleDays: state.cycleDays,
        currentCycleId: state.currentCycleId,
        healthSources: state.healthSources,
        reminders: state.reminders,
      }),
    }
  )
);
