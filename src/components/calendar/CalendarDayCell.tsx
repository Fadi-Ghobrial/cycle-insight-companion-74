
import React from 'react';
import { format } from 'date-fns';
import { CycleDay, CyclePhase, FlowLevel } from '@/types';
import { cn } from '@/lib/utils';

interface CalendarDayCellProps {
  day: Date;
  cycleDay?: CycleDay;
  phase?: CyclePhase;
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: () => void;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  cycleDay,
  phase,
  isCurrentMonth,
  isToday,
  onClick
}) => {
  // Get flow level color
  const getFlowColor = (flow?: FlowLevel) => {
    if (!flow) return '';
    
    switch (flow) {
      case FlowLevel.SPOTTING:
        return 'bg-phase-menstrual/20';
      case FlowLevel.LIGHT:
        return 'bg-phase-menstrual/40';
      case FlowLevel.MEDIUM:
        return 'bg-phase-menstrual/60';
      case FlowLevel.HEAVY:
        return 'bg-phase-menstrual/80';
      case FlowLevel.VERY_HEAVY:
        return 'bg-phase-menstrual';
      default:
        return '';
    }
  };
  
  // Get phase background color
  const getPhaseColor = (phase?: CyclePhase) => {
    if (!phase) return '';
    
    switch (phase) {
      case CyclePhase.MENSTRUAL:
        return cycleDay?.flow ? '' : 'bg-phase-menstrual/10';
      case CyclePhase.FOLLICULAR:
        return 'bg-phase-follicular/30';
      case CyclePhase.OVULATION:
        return 'bg-phase-ovulation/30';
      case CyclePhase.LUTEAL:
        return 'bg-phase-luteal/30';
      default:
        return '';
    }
  };
  
  // Get indicator dots for symptoms
  const getSymptomIndicators = () => {
    if (!cycleDay?.symptoms || cycleDay.symptoms.length === 0) return null;
    
    // Limit to 3 symptoms max
    const symptoms = cycleDay.symptoms.slice(0, 3);
    
    return (
      <div className="flex justify-center mt-1 space-x-0.5">
        {symptoms.map((symptom, index) => (
          <div 
            key={index} 
            className="w-1.5 h-1.5 rounded-full bg-symptom-mood"
            title={symptom}
          />
        ))}
        {cycleDay.symptoms.length > 3 && (
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" title="More symptoms" />
        )}
      </div>
    );
  };
  
  return (
    <div
      className={cn(
        "aspect-square p-1 border border-gray-100",
        !isCurrentMonth && "text-gray-300",
        isToday && "border-cycle-primary",
        getPhaseColor(phase),
        "hover:bg-gray-50 transition-colors cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="h-full w-full relative">
        <div className="text-right text-xs p-1">
          {format(day, 'd')}
        </div>
        
        {cycleDay?.flow && (
          <div className={cn(
            "absolute bottom-0 left-0 right-0 top-6 rounded-b",
            getFlowColor(cycleDay.flow)
          )} />
        )}
        
        {getSymptomIndicators()}
      </div>
    </div>
  );
};

export default CalendarDayCell;
