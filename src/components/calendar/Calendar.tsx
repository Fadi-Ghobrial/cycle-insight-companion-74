import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, differenceInDays } from 'date-fns';
import { ChevronLeft, ChevronRight, RotateCcw, Undo2, RefreshCw, Info } from 'lucide-react';
import { CycleDay, FlowLevel, Cycle, CyclePhase } from '@/types';
import { useAppStore } from '@/lib/store';
import CalendarDayCell from './CalendarDayCell';
import DayDetailModal from './DayDetailModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CalendarProps {
  onDayClick?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDayClick }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayDetail, setShowDayDetail] = useState<boolean>(false);
  
  const { 
    cycleDays, 
    cycles = [], 
    currentCycleId, 
    addCycleDay, 
    updateCycleDay, 
    deleteCycleDay,
    recalculatePredictions,
    undo,
    reset,
    user
  } = useAppStore();
  
  useEffect(() => {
    const handleOpenDayDetail = (event: CustomEvent) => {
      const { date } = event.detail;
      setSelectedDate(new Date(date));
      setShowDayDetail(true);
    };
    
    document.addEventListener('open-day-detail', handleOpenDayDetail as EventListener);
    
    return () => {
      document.removeEventListener('open-day-detail', handleOpenDayDetail as EventListener);
    };
  }, []);
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleDayClick = (day: Date) => {
    const clickedDate = new Date(day.getTime());
    setSelectedDate(clickedDate);
    setShowDayDetail(true);
    
    if (onDayClick) {
      onDayClick(clickedDate);
    }
  };
  
  const handleCloseDetail = () => {
    setShowDayDetail(false);
  };
  
  const handleAddOrUpdateDay = (date: Date, data: { flow?: FlowLevel, symptoms?: any[], moods?: any[], notes?: string }) => {
    const existingDay = cycleDays.find(
      day => isSameDay(new Date(day.date), date)
    );
    
    if (existingDay) {
      updateCycleDay(existingDay.id, data);
    } else {
      addCycleDay({
        date: date,
        flow: data.flow,
        symptoms: data.symptoms || [],
        moods: data.moods || [],
        notes: data.notes || '',
        userId: user?.id || 'guest'
      });
    }
    
    setShowDayDetail(false);
  };
  
  const handleDeleteDay = (date: Date) => {
    const existingDay = cycleDays.find(
      day => isSameDay(new Date(day.date), date)
    );
    
    if (existingDay) {
      deleteCycleDay(existingDay.id);
    }
    
    setShowDayDetail(false);
  };
  
  const currentCycle = cycles.find(cycle => cycle.id === currentCycleId);
  const predictions = currentCycle?.predictions;
  
  const nextPeriodStart = predictions?.nextPeriodStart ? new Date(predictions.nextPeriodStart) : undefined;
  const daysUntilNextPeriod = nextPeriodStart ? differenceInDays(nextPeriodStart, new Date()) : undefined;
  
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="text-lg md:text-xl font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={prevMonth}
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={nextMonth}
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
          
          <div className="h-6 border-r border-gray-300 mx-1"></div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 flex items-center"
                  onClick={undo}
                >
                  <Undo2 size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo last action</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 flex items-center"
                  onClick={recalculatePredictions}
                >
                  <RefreshCw size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Re-evaluate predictions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 flex items-center"
                  onClick={reset}
                >
                  <RotateCcw size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset all data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  };
  
  const renderDays = () => {
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`header-${i}`} className="text-center text-gray-500 text-sm font-medium py-2">
          {weekDays[i]}
        </div>
      );
    }
    
    return <div className="grid grid-cols-7">{days}</div>;
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    const currentCycle = cycles && currentCycleId ? cycles.find(cycle => cycle.id === currentCycleId) : undefined;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cycleDay = cycleDays.find(cDay => 
          isSameDay(new Date(cDay.date), day)
        );
        
        let phase: CyclePhase | undefined;
        if (currentCycle?.predictions?.phases) {
          for (const phasePrediction of currentCycle.predictions.phases) {
            const phaseStart = new Date(phasePrediction.startDate);
            const phaseEnd = new Date(phasePrediction.endDate);
            
            if (day >= phaseStart && day <= phaseEnd) {
              phase = phasePrediction.phase;
              break;
            }
          }
        }
        
        const currentDay = new Date(day.getTime());
        
        days.push(
          <CalendarDayCell
            key={currentDay.toString()}
            day={currentDay}
            cycleDay={cycleDay}
            phase={phase}
            isCurrentMonth={isSameMonth(currentDay, monthStart)}
            isToday={isSameDay(currentDay, new Date())}
            onClick={() => handleDayClick(currentDay)}
          />
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      
      days = [];
    }
    
    return <div className="bg-white rounded-lg overflow-hidden">{rows}</div>;
  };
  
  const renderPredictionSummary = () => {
    if (!predictions) return null;
    
    return (
      <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Info size={14} className="mr-1 text-cycle-primary" />
          Cycle Predictions
        </h3>
        
        <div className="space-y-2 text-sm">
          {nextPeriodStart && (
            <div className="flex justify-between">
              <span className="text-gray-600">Next period:</span>
              <span className="font-medium">
                {format(nextPeriodStart, 'MMM d')}
                {daysUntilNextPeriod !== undefined && (
                  <span className="text-xs text-gray-500 ml-1">
                    (in {daysUntilNextPeriod} days)
                  </span>
                )}
              </span>
            </div>
          )}
          
          {predictions.nextFertileWindowStart && (
            <div className="flex justify-between">
              <span className="text-gray-600">Fertile window:</span>
              <span className="font-medium">
                {format(new Date(predictions.nextFertileWindowStart), 'MMM d')} - {format(new Date(predictions.nextFertileWindowEnd), 'MMM d')}
              </span>
            </div>
          )}
          
          {predictions.nextOvulationDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Ovulation:</span>
              <span className="font-medium">
                {format(new Date(predictions.nextOvulationDate), 'MMM d')}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderPredictionSummary()}
      
      {showDayDetail && selectedDate && (
        <DayDetailModal
          date={selectedDate}
          cycleDay={cycleDays.find(day => isSameDay(new Date(day.date), selectedDate))}
          onClose={handleCloseDetail}
          onSave={handleAddOrUpdateDay}
          onDelete={handleDeleteDay}
        />
      )}
    </div>
  );
};

export default Calendar;
