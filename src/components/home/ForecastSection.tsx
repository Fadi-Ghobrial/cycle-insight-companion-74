
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PeriodForecastWidget from '@/components/forecast/PeriodForecastWidget';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { LifeStage } from '@/types';

const ForecastSection: React.FC = () => {
  const { currentLifeStage } = useAppStore();
  
  // Skip for certain life stages
  if (currentLifeStage === LifeStage.PREGNANCY || currentLifeStage === LifeStage.NO_PERIOD) {
    return null;
  }
  
  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Cycle Forecast</h2>
        <Link to="/calendar">
          <Button variant="link" size="sm" className="text-cycle-primary p-0">
            View Calendar <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      
      <PeriodForecastWidget />
    </div>
  );
};

export default ForecastSection;
