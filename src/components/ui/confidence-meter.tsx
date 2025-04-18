
import React from "react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { Gauge } from "lucide-react";

export function ConfidenceMeter() {
  const { cycleDays, currentLifeStage } = useAppStore();
  
  // Count number of unique cycles with bleeding
  const bleedingCycles = new Set(
    cycleDays
      .filter(day => day.flow !== undefined && day.flow > 0)
      .map(day => {
        const date = new Date(day.date);
        return `${date.getFullYear()}-${date.getMonth()}`; // Group by month to estimate cycles
      })
  ).size;

  // Calculate confidence (20% per cycle, max 100% at 5 cycles)
  const confidence = Math.min(bleedingCycles * 20, 100);
  
  // Show looser predictions with fewer cycles
  const predictionWidth = bleedingCycles >= 3 ? "narrow" : "wide";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border">
            <Gauge className="w-5 h-5 text-purple-500" />
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Prediction Confidence</span>
                <Badge variant="outline" className="bg-purple-50">
                  {confidence}%
                </Badge>
              </div>
              <Progress value={confidence} className="h-2" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>
            {bleedingCycles < 5
              ? `Tracking ${bleedingCycles} out of 5 cycles needed for accurate predictions. Keep logging your period to improve accuracy!`
              : "Great job! We now have enough data to provide accurate predictions."}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {predictionWidth === "wide" 
              ? "Currently showing wider prediction windows due to limited data"
              : "Showing precise predictions based on your cycle history"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
