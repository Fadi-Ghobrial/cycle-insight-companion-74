
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';

export const HormoneTherapyTracker = () => {
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const { toast } = useToast();
  const { addHormoneTherapy } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addHormoneTherapy({
      medicationName: medication,
      dosage,
      frequency,
      startDate: new Date(),
      userId: 'current-user'
    });

    toast({
      title: "Therapy Updated",
      description: "Your hormone therapy information has been saved"
    });

    setMedication('');
    setDosage('');
    setFrequency('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Hormone Therapy</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Medication Name"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
            />
          </div>
          <div>
            <Input
              placeholder="Dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>
          <div>
            <Input
              placeholder="Frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Log Therapy
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
