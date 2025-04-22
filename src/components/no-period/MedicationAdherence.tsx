
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const MedicationAdherence = () => {
  const { toast } = useToast();
  const [lastMedicationLog, setLastMedicationLog] = useState<string | null>(null);

  const handleMedicationLog = () => {
    const now = new Date().toLocaleTimeString();
    setLastMedicationLog(now);
    
    toast({
      title: "Medication Logged",
      description: "Your medication intake has been recorded.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Medication Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Track your HRT, medications and get reminders for refills.
        </p>
        {lastMedicationLog && (
          <p className="text-xs text-green-600 mb-2">Last logged: {lastMedicationLog}</p>
        )}
        <Button onClick={handleMedicationLog} className="w-full">
          Log Medication
        </Button>
      </CardContent>
    </Card>
  );
};
