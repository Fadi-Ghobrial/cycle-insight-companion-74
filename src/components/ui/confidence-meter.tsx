
import React from 'react';
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleGauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";

export const ConfidenceMeter = () => {
  const { cycleDays, currentLifeStage } = useAppStore();

  // Count logged bleeds
  const loggedBleeds = cycleDays.filter(day => 
    typeof day.flow === 'number' && day.flow > 0
  ).length;

  // Calculate confidence based on number of logged bleeds (max at 5 bleeds)
  const confidence = Math.min((loggedBleeds / 5) * 100, 100);

  // Determine if we should show tight or wide predictions
  const showTightPredictions = loggedBleeds >= 5;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CircleGauge className="h-5 w-5 text-pink-500" />
          <span className="font-medium">Prediction Confidence</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={showTightPredictions ? "default" : "secondary"}>
                {showTightPredictions ? "High Accuracy" : "Learning"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                {showTightPredictions 
                  ? "We now have enough data to make accurate predictions!"
                  : `Log ${5 - loggedBleeds} more periods to improve prediction accuracy. We use wider windows while learning your cycle.`}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Progress value={confidence} className="h-2" />
      <p className="text-sm text-muted-foreground">
        {loggedBleeds} of 5 cycles logged
      </p>
    </div>
  );
};
