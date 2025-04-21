
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bandage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RecoveryMilestones = () => {
  const { toast } = useToast();

  const handleMilestoneUpdate = () => {
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
        <Button onClick={handleMilestoneUpdate} className="w-full">
          Update Progress
        </Button>
      </CardContent>
    </Card>
  );
};
