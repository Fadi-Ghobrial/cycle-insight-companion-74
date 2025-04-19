
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from 'lucide-react';
import { LifeStage } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className={`flex ${isMobile ? 'flex-col' : 'items-start'} gap-3 w-full`}>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('800', '100')} ${isMobile ? 'mb-2' : ''}`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div className={`flex flex-col ${isMobile ? 'w-full' : ''}`}>
          <h3 className="text-lg font-medium line-clamp-1">{title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
          
          <div className="mt-3">
            <Badge className={color}>
              {isCurrentStage ? 'Your Current Life Stage' : 'Click to Switch'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-1">
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
