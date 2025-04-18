
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from 'lucide-react';
import { LifeStage } from '@/types';

interface LifeStageCardProps {
  stage: LifeStage;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  isCurrentStage: boolean;
  onSwitch: () => void;
}

export const LifeStageCard = ({
  stage,
  icon: Icon,
  title,
  description,
  color,
  isCurrentStage,
  onSwitch
}: LifeStageCardProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('800', '100')}`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-gray-600">{description}</p>
          
          <div className="mt-4">
            <Badge className={color}>
              {isCurrentStage ? 'Your Current Life Stage' : 'Click to Switch'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-2">
        {!isCurrentStage && (
          <button 
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${color.replace('bg-', 'bg-').replace('text-', 'bg-').replace('100', '600').replace('800', '700')}`}
            onClick={onSwitch}
          >
            Switch to {title} Mode
          </button>
        )}
      </div>
    </div>
  );
};
