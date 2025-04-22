
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useAppStore } from '@/lib/store';
import { LifeStage } from '@/types';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { QuickActions } from '@/components/home/QuickActions';
import ForecastSection from '@/components/home/ForecastSection';
import { TTCRecommendation } from '@/components/home/TTCRecommendation';
import { PregnancyTools } from '@/components/home/PregnancyTools';
import { PerimenopausalTools } from '@/components/home/PerimenopausalTools';
import { NoPeriodTools } from '@/components/home/NoPeriodTools';
import { FirstPeriodSection } from '@/components/home/FirstPeriodSection';
import { TTCTools } from '@/components/home/TTCTools';
import { GeneralTools } from '@/components/home/GeneralTools';

const Home: React.FC = () => {
  const { currentLifeStage } = useAppStore();
  
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <WelcomeSection />
        <QuickActions />
        <ForecastSection />
        <TTCRecommendation />

        {currentLifeStage === LifeStage.PREGNANCY && <PregnancyTools />}
        {currentLifeStage === LifeStage.PERIMENOPAUSE && <PerimenopausalTools />}
        {currentLifeStage === LifeStage.NO_PERIOD && <NoPeriodTools />}
        {currentLifeStage === LifeStage.FIRST_PERIOD && <FirstPeriodSection />}
        {currentLifeStage === LifeStage.TTC && <TTCTools />}

        <GeneralTools />
      </div>
    </Layout>
  );
};

export default Home;
