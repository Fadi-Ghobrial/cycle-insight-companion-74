
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Book, Heart, BabyIcon, FlameIcon, 
  ThermometerIcon, Sparkles, Calendar 
} from 'lucide-react';
import { LifeStage } from '@/types';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';

const MilestonesPage: React.FC = () => {
  const { currentLifeStage, changeLifeStage } = useAppStore();
  const { toast } = useToast();
  const [lifecycleTab, setLifecycleTab] = useState<string>(currentLifeStage);

  const lifeStageInfo = {
    [LifeStage.FIRST_PERIOD]: {
      icon: Sparkles,
      title: "First Period",
      description: "Information for those new to menstruation",
      color: "bg-pink-100 text-pink-800"
    },
    [LifeStage.STANDARD]: {
      icon: Calendar,
      title: "Regular Cycles",
      description: "Understanding your normal menstrual cycle",
      color: "bg-blue-100 text-blue-800"
    },
    [LifeStage.TTC]: {
      icon: BabyIcon,
      title: "Trying to Conceive",
      description: "Optimize your chances of conception",
      color: "bg-green-100 text-green-800"
    },
    [LifeStage.PREGNANCY]: {
      icon: Heart,
      title: "Pregnancy",
      description: "Week-by-week guidance during pregnancy",
      color: "bg-purple-100 text-purple-800"
    },
    [LifeStage.PERIMENOPAUSE]: {
      icon: FlameIcon,
      title: "Perimenopause",
      description: "Navigating the transition to menopause",
      color: "bg-orange-100 text-orange-800"
    },
    [LifeStage.NO_PERIOD]: {
      icon: ThermometerIcon,
      title: "No Period / HRT",
      description: "Support for those without menstruation",
      color: "bg-gray-100 text-gray-800"
    }
  };

  const handleLifeStageChange = (stage: string) => {
    setLifecycleTab(stage);
    
    if (stage !== currentLifeStage) {
      changeLifeStage(stage as LifeStage, "User changed from Milestones page");
      
      toast({
        title: "Life Stage Updated",
        description: `Your app experience is now optimized for ${lifeStageInfo[stage as LifeStage].title}`,
        duration: 3000,
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">Milestones & Life Stages</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Your Life Stage</CardTitle>
            <CardDescription>
              Customize your experience based on your current life stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={lifecycleTab} onValueChange={handleLifeStageChange} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
                {Object.entries(lifeStageInfo).map(([stage, info]) => (
                  <TabsTrigger key={stage} value={stage} className="flex flex-col items-center py-2">
                    <info.icon size={18} className="mb-1" />
                    <span className="text-xs">{info.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(lifeStageInfo).map(([stage, info]) => (
                <TabsContent key={stage} value={stage} className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${info.color.replace('text-', 'bg-').replace('800', '100')}`}>
                      <info.icon size={24} className={info.color.replace('bg-', 'text-')} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{info.title}</h3>
                      <p className="text-gray-600">{info.description}</p>
                      
                      <div className="mt-4">
                        <Badge className={info.color}>
                          {stage === currentLifeStage ? 'Your Current Life Stage' : 'Click to Switch'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MilestonesPage;
