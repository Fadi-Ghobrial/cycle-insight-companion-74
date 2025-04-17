import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, RotateCcw, Undo2, RefreshCw } from 'lucide-react';
import { CycleDay, FlowLevel, Cycle, CyclePhase } from '@/types';
import { useAppStore } from '@/lib/store';
import CalendarDayCell from './CalendarDayCell';
import DayDetailModal from './DayDetailModal';

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
  
  const handleAddOrUpdateDay = (date: Date, data: { flow?: FlowLevel, symptoms?: any[], notes?: string }) => {
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
          
          <button 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 flex items-center"
            onClick={undo}
            title="Undo last action"
          >
            <Undo2 size={18} />
          </button>
          
          <button 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 flex items-center"
            onClick={recalculatePredictions}
            title="Re-evaluate predictions"
          >
            <RefreshCw size={18} />
          </button>
          
          <button 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 flex items-center"
            onClick={reset}
            title="Reset all data"
          >
            <RotateCcw size={18} />
          </button>
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
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
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
