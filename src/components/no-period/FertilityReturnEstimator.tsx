
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const FertilityReturnEstimator = () => {
  const { toast } = useToast();

  const handleEstimateRequest = () => {
    toast({
      title: "Fertility Estimate",
      description: "Based on your data, we'll provide an estimate for fertility return.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Fertility Return
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Estimate potential return of fertility post-HRT or amenorrhea.
        </p>
        <Button onClick={handleEstimateRequest} className="w-full">
          Get Estimate
        </Button>
      </CardContent>
    </Card>
  );
};
