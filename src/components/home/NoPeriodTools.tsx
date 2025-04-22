
import React from 'react';
import { MedicationAdherence } from '@/components/no-period/MedicationAdherence';
import { RecoveryMilestones } from '@/components/no-period/RecoveryMilestones';
import { MoodSleepDashboard } from '@/components/no-period/MoodSleepDashboard';
import { FertilityReturnEstimator } from '@/components/no-period/FertilityReturnEstimator';
import { CommunityStories } from '@/components/no-period/CommunityStories';

export const NoPeriodTools = () => {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Recovery & Wellness Tools</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MedicationAdherence />
        <RecoveryMilestones />
        <MoodSleepDashboard />
        <FertilityReturnEstimator />
        <CommunityStories />
      </div>
    </section>
  );
};
