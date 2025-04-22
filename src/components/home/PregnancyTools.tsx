
import React from 'react';
import { GestationalAgeTracker } from '@/components/pregnancy/GestationalAgeTracker';
import { SymptomKickCounter } from '@/components/pregnancy/SymptomKickCounter';
import { PregnancyChecklistHub } from '@/components/pregnancy/PregnancyChecklistHub';
import { WeightVitalsLog } from '@/components/pregnancy/WeightVitalsLog';
import { DueDateWidgets } from '@/components/pregnancy/DueDateWidgets';

export const PregnancyTools = () => {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Pregnancy Tools</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GestationalAgeTracker />
        <SymptomKickCounter />
        <PregnancyChecklistHub />
        <WeightVitalsLog />
        <DueDateWidgets />
      </div>
    </section>
  );
};
