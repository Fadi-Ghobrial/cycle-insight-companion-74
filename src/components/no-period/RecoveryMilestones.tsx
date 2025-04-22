
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bandage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RecoveryMilestones = () => {
  const { toast } = useToast();
  const [progressPercentage, setProgressPercentage] = useState(0);

  const handleMilestoneUpdate = () => {
    // Increment progress by 10%, max 100%
    setProgressPercentage(prev => Math.min(prev + 10, 100));
    
    toast({
      title: "Milestone Updated",
      description: "Your recovery progress has been recorded.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bandage className="h-5 w-5" />
          Recovery Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Track healing progress for procedures or recovery.
        </p>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-green-500 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mb-4 text-right">
          Recovery: {progressPercentage}% complete
        </p>
        
        <Button onClick={handleMilestoneUpdate} className="w-full">
          Update Progress
        </Button>
      </CardContent>
    </Card>
  );
};
