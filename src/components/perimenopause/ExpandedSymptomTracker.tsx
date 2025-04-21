
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';
import { PerimenopausalSymptom } from '@/types';

export const ExpandedSymptomTracker = () => {
  const { toast } = useToast();
  const { addPerimenopausalData } = useAppStore();

  const handleSymptomToggle = (symptom: PerimenopausalSymptom) => {
    addPerimenopausalData({
      date: new Date(),
      symptoms: [symptom],
      userId: 'current-user'
    });

    toast({
      title: "Symptom Logged",
      description: `${symptom.toLowerCase().replace('_', ' ')} has been recorded.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Symptom Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.values(PerimenopausalSymptom).map((symptom) => (
            <div key={symptom} className="flex items-center space-x-2">
              <Checkbox
                id={symptom}
                onCheckedChange={() => handleSymptomToggle(symptom)}
              />
              <label htmlFor={symptom} className="text-sm font-medium">
                {symptom.toLowerCase().replace('_', ' ')}
              </label>
            </div>
          ))}
          <Button
            className="w-full mt-4"
            onClick={() => toast({
              title: "Symptoms Updated",
              description: "Your symptom log has been saved"
            })}
          >
            Save Symptoms
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
