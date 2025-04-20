
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Calendar, Bell, Clock, CalendarArrowUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Symptom, CyclePhase } from '@/types';
import { scheduleReminder } from '@/services/notificationService';

interface PeriodForecastWidgetProps {
  compact?: boolean;
  showReminders?: boolean;
}

const PeriodForecastWidget: React.FC<PeriodForecastWidgetProps> = ({
  compact = false,
  showReminders = true
}) => {
  const { cycles, currentCycleId } = useAppStore();
  
  const currentCycle = cycles.find(cycle => cycle.id === currentCycleId);
  const predictions = currentCycle?.predictions;
  
  if (!predictions) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Period Forecast</CardTitle>
          <CardDescription>Not enough data to make predictions yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Start tracking your periods to see predictions here
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const nextPeriodStart = new Date(predictions.nextPeriodStart);
  const nextPeriodEnd = new Date(predictions.nextPeriodEnd);
  const daysUntilPeriod = differenceInDays(nextPeriodStart, new Date());
  
  // Determine if we're in PMS phase (7 days before period)
  const pmsStartDate = new Date(nextPeriodStart);
  pmsStartDate.setDate(pmsStartDate.getDate() - 7);
  const isInPMS = new Date() >= pmsStartDate && new Date() < nextPeriodStart;
  
  // Get symptoms for the current phase
  const currentPhase = predictions.phases?.find(phase => {
    const phaseStart = new Date(phase.startDate);
    const phaseEnd = new Date(phase.endDate);
    const today = new Date();
    return today >= phaseStart && today <= phaseEnd;
  });
  
  const phaseSymptoms = currentPhase?.symptoms || [];
  
  // Helper function to create a reminder
  const handleCreateReminder = () => {
    // Set reminder for 2 days before period
    const reminderDate = new Date(nextPeriodStart);
    reminderDate.setDate(reminderDate.getDate() - 2);
    
    scheduleReminder({
      title: "Period Starting Soon",
      message: `Your period is expected to start in 2 days (${format(nextPeriodStart, 'MMM dd')})`,
      triggerTime: reminderDate,
      type: "period",
      isRead: false,
      isActive: true
    });
  };
  
  if (compact) {
    return (
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-cycle-primary" />
              Period Forecast
            </CardTitle>
            {isInPMS && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                PMS Phase
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium">Next period:</span> {format(nextPeriodStart, 'MMM d')}
              {daysUntilPeriod >= 0 ? 
                <span className="text-xs text-gray-500 ml-1">(in {daysUntilPeriod} days)</span> : 
                <span className="text-xs text-cycle-primary ml-1">(now)</span>
              }
            </div>
            {showReminders && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCreateReminder}>
                      <Bell className="h-4 w-4 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set period reminder</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full shadow-sm border-t-4 border-t-cycle-primary">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-cycle-primary" />
            Period Forecast
          </CardTitle>
          {isInPMS && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              PMS Phase
            </Badge>
          )}
        </div>
        <CardDescription>
          {isInPMS ? "You're in your PMS phase" : "Your next cycle information"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Next period starts:</span>
            <span className="font-medium">
              {format(nextPeriodStart, 'MMMM d')}
              <span className="ml-1 text-sm text-gray-500">
                {daysUntilPeriod >= 0 ? `(in ${daysUntilPeriod} days)` : '(now)'}
              </span>
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Period duration:</span>
            <span className="font-medium">
              {differenceInDays(nextPeriodEnd, nextPeriodStart) + 1} days
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Expected flow:</span>
            <span className="font-medium">
              Moderate to heavy
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Prediction confidence:</span>
            <span className="font-medium">
              {Math.round(predictions.confidence * 100)}%
            </span>
          </div>
        </div>
        
        {(isInPMS || phaseSymptoms.length > 0) && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              {isInPMS ? "Common PMS symptoms:" : "Common symptoms for this phase:"}
            </h4>
            <div className="flex flex-wrap gap-1">
              {(isInPMS ? 
                [Symptom.MOOD_SWINGS, Symptom.CRAMPS, Symptom.BLOATING, Symptom.BREAST_TENDERNESS] : 
                phaseSymptoms
              ).map((symptom) => (
                <Badge key={symptom} variant="secondary" className="text-xs">
                  {symptom.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {showReminders && (
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            Updated {format(new Date(), 'MMM d')}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center"
            onClick={handleCreateReminder}
          >
            <Bell className="h-3 w-3 mr-1" />
            Set Reminder
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PeriodForecastWidget;
