
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Frown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const MoodSleepDashboard = () => {
  const { toast } = useToast();
  const [currentMood, setCurrentMood] = React.useState<'good' | 'bad' | null>(null);

  const handleMoodLog = (mood: 'good' | 'bad') => {
    setCurrentMood(mood);
    toast({
      title: "Mood Logged",
      description: "Your emotional wellbeing has been recorded.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Mood & Sleep</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Monitor your emotional wellbeing and sleep patterns.
        </p>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleMoodLog('good')} 
            variant={currentMood === 'good' ? 'default' : 'outline'}
            className="flex-1"
          >
            <Smile className="h-5 w-5 mr-2" />
            Good
          </Button>
          <Button 
            onClick={() => handleMoodLog('bad')} 
            variant={currentMood === 'bad' ? 'default' : 'outline'}
            className="flex-1"
          >
            <Frown className="h-5 w-5 mr-2" />
            Bad
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
