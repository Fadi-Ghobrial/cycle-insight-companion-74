
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Settings, Lock, Activity, Calendar } from "lucide-react";
import { LifeStageFeature } from '@/types';
import { LucideIcon } from 'lucide-react';
import { ParentGuardianShare } from '@/components/milestones/ParentGuardianShare';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface FeatureCardProps {
  feature: {
    title: string;
    description: string;
    icon: LucideIcon;
    safetyFeature?: boolean;
    securityInfo?: string;
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
    <Card className="border-l-4 w-full" style={{ borderLeftColor: borderColor }}>
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-col gap-2">
          {/* Header with icon and title */}
          <div className="flex items-start gap-2">
            <Icon className="w-5 h-5 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-sm md:text-base line-clamp-1">{feature.title}</h5>
              {feature.safetyFeature && (
                <span className="text-xs text-yellow-500 flex items-center gap-1 mt-0.5">
                  <Lock className="w-3 h-3" />
                  {feature.securityInfo}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs md:text-sm text-gray-600">{feature.description}</p>
          
          {/* Status and usage count */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Badge variant="outline" className="h-5">
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
            <span className="text-xs text-gray-500">Used: {usageCount} times</span>
          </div>
          
          {/* Actions */}
          {status === 'completed' ? (
            <div className="flex gap-2 mt-1">
              {feature.safetyFeature ? (
                <ParentGuardianShare />
              ) : (
                <>
                  <Button 
                    size="sm" 
                    variant={enabled ? "default" : "outline"}
                    className="text-xs flex-1"
                    onClick={() => onUse()}
                    disabled={!enabled}
                  >
                    Use Feature
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onToggle(!enabled)}>
                        {enabled ? 'Disable Feature' : 'Enable Feature'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
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
