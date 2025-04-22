
import React from 'react';
import { useAppStore } from '@/lib/store';

export const WelcomeSection = () => {
  const { user } = useAppStore();
  
  return (
    <section className="mb-8">
      <h1 className="text-2xl font-bold text-cycle-primary mb-2">
        Welcome{user ? `, ${user.displayName || ''}` : ''}
      </h1>
      <p className="text-gray-600">
        Track, predict, and understand your cycle.
      </p>
    </section>
  );
};
