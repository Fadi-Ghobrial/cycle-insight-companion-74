import React from 'react';
import { format } from 'date-fns';
import { CycleDay, CyclePhase, FlowLevel } from '@/types';
import { cn } from '@/lib/utils';
import { Circle, CircleDot, CircleDashed } from 'lucide-react';

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
  const getPhaseIcon = () => {
    if (!phase) return null;
    
    const iconProps = {
      size: 32,
      className: cn(
        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-40",
        phase === CyclePhase.MENSTRUAL && "text-phase-menstrual",
        phase === CyclePhase.FOLLICULAR && "text-phase-follicular",
        phase === CyclePhase.OVULATION && "text-phase-ovulation",
        phase === CyclePhase.LUTEAL && "text-phase-luteal",
      )
    };
    
    switch (phase) {
      case CyclePhase.MENSTRUAL:
        return <Circle {...iconProps} fill="currentColor" />;
      case CyclePhase.FOLLICULAR:
        return <CircleDashed {...iconProps} />;
      case CyclePhase.OVULATION:
        return <CircleDot {...iconProps} />;
      case CyclePhase.LUTEAL:
        return <Circle {...iconProps} />;
      default:
        return null;
    }
  };
  
  return (
    <div
      className={cn(
        "aspect-square p-1 border border-gray-100 relative overflow-hidden",
        !isCurrentMonth && "text-gray-300",
        isToday && "border-cycle-primary",
        cycleDay && "bg-[#b2ff36]/40",
        "hover:bg-gray-50 transition-colors cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="h-full w-full relative flex items-center justify-center">
        {getPhaseIcon()}
        <span className={cn(
          "text-xs relative z-10",
          isToday && "font-bold text-cycle-primary"
        )}>
          {format(day, 'd')}
        </span>
      </div>
    </div>
  );
};

export default CalendarDayCell;
