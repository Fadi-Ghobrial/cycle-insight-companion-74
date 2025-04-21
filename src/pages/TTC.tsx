
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/lib/store';
import { LifeStage } from '@/types';
import { FertileWindowCountdown } from '@/components/ttc/FertileWindowCountdown';
import { OvulationTestScanner } from '@/components/ttc/OvulationTestScanner';
import { BasalTemperatureChart } from '@/components/ttc/BasalTemperatureChart';
import { SpermQualityTips } from '@/components/ttc/SpermQualityTips';
import { PreconceptionChecklist } from '@/components/ttc/PreconceptionChecklist';
import { useToast } from '@/components/ui/use-toast';

const TTC: React.FC = () => {
  const { currentLifeStage, incrementFeatureUsage, lifeStageFeatures } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('fertile-window');

  // Check if user is in TTC life stage
  useEffect(() => {
    if (currentLifeStage !== LifeStage.TTC) {
      toast({
        title: "Life Stage Required",
        description: "This page is only available in the Trying to Conceive life stage.",
        variant: "destructive"
      });
      navigate('/milestones');
    }
  }, [currentLifeStage, navigate, toast]);

  // Track feature usage when changing tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Map tab values to feature IDs
    const featureIdMap: Record<string, string> = {
      'fertile-window': 'fertile_window',
      'ovulation-test': 'ovulation_scanner',
      'temperature': 'temperature_insights',
      'sperm-quality': 'sperm_quality',
      'checklist': 'preconception_checklist'
    };
    
    if (featureIdMap[value]) {
      // Find the feature by ID and increment its usage
      const feature = lifeStageFeatures.find(f => f.id === featureIdMap[value]);
      if (feature) {
        incrementFeatureUsage(feature.id);
      }
    }
  };

  if (currentLifeStage !== LifeStage.TTC) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">Trying to Conceive Tools</h1>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="fertile-window">Fertile Window</TabsTrigger>
            <TabsTrigger value="ovulation-test">Ovulation Tests</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="sperm-quality">Sperm Quality</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fertile-window" className="p-4 w-full">
            <FertileWindowCountdown />
          </TabsContent>
          
          <TabsContent value="ovulation-test" className="p-4 w-full">
            <OvulationTestScanner />
          </TabsContent>
          
          <TabsContent value="temperature" className="p-4 w-full">
            <BasalTemperatureChart />
          </TabsContent>
          
          <TabsContent value="sperm-quality" className="p-4 w-full">
            <SpermQualityTips />
          </TabsContent>
          
          <TabsContent value="checklist" className="p-4 w-full">
            <PreconceptionChecklist />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TTC;
