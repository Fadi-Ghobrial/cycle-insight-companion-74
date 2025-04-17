import React from 'react';
import { format } from 'date-fns';
import { CycleDay, CyclePhase, FlowLevel } from '@/types';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

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
      <div className="flex justify-center mt-1 space-x-0.5 absolute bottom-1 left-0 right-0">
        {symptoms.map((symptom, index) => (
          <div 
            key={index} 
            className="w-1.5 h-1.5 rounded-full bg-white/70"
            title={symptom}
          />
        ))}
        {cycleDay.symptoms.length > 3 && (
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300/70" title="More symptoms" />
        )}
      </div>
    );
  };
  
  // Get phase icon or label
  const getPhaseIndicator = () => {
    if (!phase) return null;
    
    let phaseLabel = '';
    let phaseColor = '';
    
    switch (phase) {
      case CyclePhase.MENSTRUAL:
        phaseLabel = 'Period';
        phaseColor = 'text-white';
        break;
      case CyclePhase.FOLLICULAR:
        phaseLabel = 'Follicular';
        phaseColor = 'text-white';
        break;
      case CyclePhase.OVULATION:
        phaseLabel = 'Ovulation';
        phaseColor = 'text-white';
        break;
      case CyclePhase.LUTEAL:
        phaseLabel = 'Luteal';
        phaseColor = 'text-white';
        break;
    }
    
    return !cycleDay?.flow ? (
      <div className={`absolute bottom-0 left-0 right-0 text-[0.6rem] text-center ${phaseColor} font-medium truncate px-0.5 bg-black/40`}>
        {phaseLabel}
      </div>
    ) : null;
  };
  
  const hasData = cycleDay || phase;
  
  return (
    <div
      className={cn(
        "aspect-square p-1 border border-gray-100 relative overflow-hidden",
        !isCurrentMonth && "text-gray-300",
        isToday && "border-cycle-primary",
        getPhaseColor(phase),
        "hover:bg-gray-50 transition-colors cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="h-full w-full relative">
        <div className="flex justify-between items-start text-xs p-1">
          <span className={isToday ? "font-bold text-cycle-primary" : ""}>
            {format(day, 'd')}
          </span>
          
          {hasData && (
            <div 
              className="w-3 h-3 flex items-center justify-center"
              title={phase ? `Phase: ${phase}` : 'View details'}
            >
              {hasData && <Info size={10} className="text-gray-500" />}
            </div>
          )}
        </div>
        
        {cycleDay?.flow && (
          <div className={cn(
            "absolute bottom-0 left-0 right-0 top-6 rounded-b bg-black/20",
            getFlowColor(cycleDay.flow)
          )} />
        )}
        
        {getSymptomIndicators()}
        {getPhaseIndicator()}
      </div>
    </div>
  );
};

export default CalendarDayCell;
