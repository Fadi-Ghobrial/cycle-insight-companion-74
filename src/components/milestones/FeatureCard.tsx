
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Settings, Lock, Activity, Calendar } from "lucide-react";
import { LifeStageFeature } from '@/types';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  feature: {
    title: string;
    description: string;
    icon: LucideIcon;
  };
  status: 'completed' | 'in_progress' | 'planned';
  enabled: boolean;
  usageCount: number;
  borderColor: string;
  onUse: () => void;
  onToggle: (enabled: boolean) => void;
}

export const FeatureCard = ({
  feature,
  status,
  enabled,
  usageCount,
  borderColor,
  onUse,
  onToggle
}: FeatureCardProps) => {
  const Icon = feature.icon;
  
  return (
    <Card className="border-l-4" style={{ borderLeftColor: borderColor }}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-2">
          <Icon className="w-5 h-5" />
          <h5 className="font-medium">{feature.title}</h5>
        </div>
        <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
        
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Status: 
              <Badge variant="outline" className="ml-2">
                {status === 'completed' ? (
                  <span className="flex items-center text-green-600">
                    <Check className="w-3 h-3 mr-1" /> Ready
                  </span>
                ) : status === 'in_progress' ? (
                  <span className="flex items-center text-yellow-600">
                    <Activity className="w-3 h-3 mr-1" /> In Progress
                  </span>
                ) : (
                  <span className="flex items-center text-blue-600">
                    <Calendar className="w-3 h-3 mr-1" /> Planned
                  </span>
                )}
              </Badge>
            </span>
            
            <span className="text-xs text-gray-500">
              Used: {usageCount} times
            </span>
          </div>
          
          {status === 'completed' ? (
            <div className="flex justify-between gap-2 mt-1">
              <Button 
                size="sm" 
                variant={enabled ? "default" : "outline"}
                className="text-xs w-full"
                onClick={() => onUse()}
                disabled={!enabled}
              >
                Use Feature
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => onToggle(!enabled)}
              >
                <Settings className="w-3 h-3 mr-1" />
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs w-full mt-1"
              disabled
            >
              <Lock className="w-3 h-3 mr-1" />
              {status === 'in_progress' ? 'Coming Soon' : 'Planned'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
