
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

export const ClinicianReferral = () => {
  const { toast } = useToast();

  const handleReferralRequest = () => {
    toast({
      title: "Referral Suggested",
      description: "Based on your symptoms, we recommend consulting a healthcare provider.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Clinician Referral
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Get personalized recommendations for when to consult a healthcare provider based on your symptoms.
        </p>
        <Button onClick={handleReferralRequest} className="w-full">
          Check Recommendations
        </Button>
      </CardContent>
    </Card>
  );
};
