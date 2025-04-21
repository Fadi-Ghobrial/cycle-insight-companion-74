
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { Calendar } from '@/components/ui/calendar';
import { addDays, differenceInDays, format } from 'date-fns';
import { Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const FertileWindowCountdown: React.FC = () => {
  const { cycles, currentCycleId } = useAppStore();
  const { toast } = useToast();
  const [daysUntilFertile, setDaysUntilFertile] = useState<number | null>(null);
  const [fertileWindowLength, setFertileWindowLength] = useState<number>(5);
  const [showingCalendar, setShowingCalendar] = useState(false);
  
  // Get current cycle prediction
  const currentCycle = cycles.find(c => c.id === currentCycleId);
  const prediction = currentCycle?.predictions;
  
  useEffect(() => {
    if (prediction) {
      const today = new Date();
      const fertileStart = new Date(prediction.nextFertileWindowStart);
      const fertileEnd = new Date(prediction.nextFertileWindowEnd);
      
      if (today < fertileStart) {
        // Counting down to fertile window
        setDaysUntilFertile(differenceInDays(fertileStart, today));
      } else if (today <= fertileEnd) {
        // Currently in fertile window
        setDaysUntilFertile(0);
      } else {
        // Past fertile window, show days until next one
        const nextCycleStart = addDays(new Date(prediction.nextPeriodStart), prediction.phases[0].endDate.getDate() - prediction.phases[0].startDate.getDate());
        const nextFertileStart = addDays(nextCycleStart, 12); // Estimate next fertile window
        setDaysUntilFertile(differenceInDays(nextFertileStart, today));
      }
      
      // Calculate fertile window length
      if (prediction.nextFertileWindowStart && prediction.nextFertileWindowEnd) {
        const start = new Date(prediction.nextFertileWindowStart);
        const end = new Date(prediction.nextFertileWindowEnd);
        setFertileWindowLength(differenceInDays(end, start) + 1);
      }
    }
  }, [prediction]);
  
  const handleShareClick = () => {
    if (!prediction) return;
    
    // In a real app, this would open a share dialog
    // For now, we'll just show a toast
    navigator.clipboard.writeText(`My fertile window is from ${format(new Date(prediction.nextFertileWindowStart), 'MMM dd')} to ${format(new Date(prediction.nextFertileWindowEnd), 'MMM dd')}!`);
    
    toast({
      title: "Copied to clipboard",
      description: "Fertility window dates have been copied to your clipboard to share.",
    });
  };
  
  if (!prediction) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fertile Window</CardTitle>
          <CardDescription>Log more cycle data to see fertility predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            Continue tracking your cycle to receive fertility window predictions
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Fertile window dates
  const fertileStart = new Date(prediction.nextFertileWindowStart);
  const fertileEnd = new Date(prediction.nextFertileWindowEnd);
  const ovulationDate = new Date(prediction.nextOvulationDate);
  
  // Status message based on timing
  const today = new Date();
  let statusMessage: string;
  let progressValue: number;
  
  if (daysUntilFertile === 0) {
    statusMessage = "You're in your fertile window!";
    progressValue = 100;
  } else if (daysUntilFertile === 1) {
    statusMessage = "Your fertile window starts tomorrow!";
    progressValue = 90;
  } else if (daysUntilFertile && daysUntilFertile <= 3) {
    statusMessage = `Your fertile window starts in ${daysUntilFertile} days`;
    progressValue = 80;
  } else if (daysUntilFertile && daysUntilFertile <= 7) {
    statusMessage = `${daysUntilFertile} days until your fertile window`;
    progressValue = 50;
  } else {
    statusMessage = "Your fertile window is coming up";
    progressValue = 25;
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Fertile Window Countdown</CardTitle>
            <CardDescription>Track your most fertile days</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleShareClick}
            title="Share with partner"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{statusMessage}</span>
              <span className="text-muted-foreground">{daysUntilFertile === 0 ? "Now!" : `${daysUntilFertile} days`}</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
          
          {/* Date information */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Window Start</p>
              <p className="text-lg font-semibold">{format(fertileStart, 'MMM d')}</p>
            </div>
            
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Ovulation</p>
              <p className="text-lg font-semibold">{format(ovulationDate, 'MMM d')}</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Window End</p>
              <p className="text-lg font-semibold">{format(fertileEnd, 'MMM d')}</p>
            </div>
          </div>
          
          {/* Calendar button */}
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setShowingCalendar(!showingCalendar)}
            >
              {showingCalendar ? "Hide Calendar" : "View Calendar"}
            </Button>
          </div>
          
          {/* Calendar display */}
          {showingCalendar && (
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={ovulationDate}
                className="rounded-md border"
                disabled={[]}
                modifiers={{
                  fertile: { from: fertileStart, to: fertileEnd },
                  ovulation: ovulationDate
                }}
                modifiersClassNames={{
                  fertile: "bg-green-50",
                  ovulation: "bg-red-100 font-bold"
                }}
                defaultMonth={ovulationDate}
              />
            </div>
          )}
          
          {/* Fertility tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Fertility Tip</h4>
            <p className="text-sm">
              Sperm can survive up to 5 days in the female reproductive tract, 
              so having intercourse 2-3 days before ovulation increases your chances of conception.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
