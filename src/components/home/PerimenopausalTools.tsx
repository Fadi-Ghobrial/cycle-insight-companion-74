
import React from 'react';
import { ExpandedSymptomTracker } from '@/components/perimenopause/ExpandedSymptomTracker';
import { SleepQualityTracker } from '@/components/perimenopause/SleepQualityTracker';
import { HormoneTherapyTracker } from '@/components/perimenopause/HormoneTherapyTracker';
import { CycleVariabilityGraph } from '@/components/perimenopause/CycleVariabilityGraph';
import { ClinicianReferral } from '@/components/perimenopause/ClinicianReferral';

export const PerimenopausalTools = () => {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Perimenopause Tools</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ExpandedSymptomTracker />
        <SleepQualityTracker />
        <HormoneTherapyTracker />
        <CycleVariabilityGraph />
        <ClinicianReferral />
      </div>
    </section>
  );
};
