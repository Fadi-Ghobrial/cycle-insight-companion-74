
import React from 'react';
import { Circle, CircleDot, CircleDashed } from 'lucide-react';
import { CyclePhase } from '@/types';

const CalendarLegend = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Circle size={16} className="text-phase-menstrual" fill="currentColor" />
        <span className="text-sm">Menstrual</span>
      </div>
      <div className="flex items-center gap-2">
        <CircleDashed size={16} className="text-phase-follicular" />
        <span className="text-sm">Follicular</span>
      </div>
      <div className="flex items-center gap-2">
        <CircleDot size={16} className="text-phase-ovulation" />
        <span className="text-sm">Ovulation</span>
      </div>
      <div className="flex items-center gap-2">
        <Circle size={16} className="text-phase-luteal" />
        <span className="text-sm">Luteal</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
