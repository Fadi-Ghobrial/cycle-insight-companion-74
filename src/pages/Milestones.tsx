import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfidenceMeter } from '@/components/ui/confidence-meter';
import { LifeStageCard } from '@/components/milestones/LifeStageCard';
import { FeatureCard } from '@/components/milestones/FeatureCard';
import { CrossModeDesign } from '@/components/milestones/CrossModeDesign';
import { 
  Book, Heart, BabyIcon, FlameIcon, 
  ThermometerIcon, Sparkles, 
  BarChart, Lightbulb, LineChart, PlusCircle,
  Calendar, CalendarCheck, Activity, Brain,
  Clock, Microscope, Thermometer, Pill,
  Lock, Mail, Share2
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';
import { LifeStage } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

const lifeStageInfo = {
  [LifeStage.FIRST_PERIOD]: {
    icon: Sparkles,
    title: "First Period",
    description: "Information for those new to menstruation",
    color: "bg-pink-100 text-pink-800",
    features: [
      {
        title: "Period 101 Carousel",
        description: "Swipe cards explaining what's happening biologically and how to use period products",
        icon: Book
      },
      {
        title: "Confidence Meter",
        description: "A simple bar that fills as the app gets three consecutive cycles logged correctly",
        icon: BarChart
      },
      {
        title: "Ask-a-Nurse Chat",
        description: "Opt-in, moderated chat window for puberty questions",
        icon: Lightbulb
      },
      {
        title: "Loose Prediction Model",
        description: "Wide windows and \"learning\" language as the app gets to know your cycle",
        icon: LineChart
      },
      {
        title: "Parent/Guardian Share",
        description: "Export a secure, read-only PDF digest of cycles and insights to a trusted adult",
        icon: Share2,
        safetyFeature: true,
        securityInfo: "Requires passcode verification and data is encrypted"
      }
    ]
  },
  [LifeStage.STANDARD]: {
    icon: Calendar,
    title: "Regular Cycles",
    description: "Understanding your normal menstrual cycle",
    color: "bg-blue-100 text-blue-800",
    features: [
      {
        title: "Next-Period & PMS Forecast",
        description: "Calendar, widgets, and push reminders for upcoming periods",
        icon: CalendarCheck
      },
      {
        title: "Daily Mood & Symptom Logging",
        description: "Track your mood and symptoms with trend heat-maps",
        icon: Activity
      },
      {
        title: "Lifestyle Correlations",
        description: "7/30-day insights about how your cycle affects sleep, energy, and more",
        icon: LineChart
      },
      {
        title: "Adaptive Prediction Engine",
        description: "Algorithms that learn and improve with each cycle you track",
        icon: Brain
      },
      {
        title: "Custom Reminders",
        description: "Set notifications for medications, hydration, or workout recovery",
        icon: Clock
      }
    ]
  },
  [LifeStage.TTC]: {
    icon: BabyIcon,
    title: "Trying to Conceive",
    description: "Optimize your chances of conception",
    color: "bg-green-100 text-green-800",
    features: [
      {
        title: "Fertile Window Countdown",
        description: "Daily countdown to your most fertile days with partner-share option",
        icon: CalendarCheck
      },
      {
        title: "Ovulation Test Scanner",
        description: "Camera feature that reads LH test lines and logs your surge",
        icon: Microscope
      },
      {
        title: "Basal Temperature Insights",
        description: "Temperature and heart rate variability graphs to confirm ovulation",
        icon: Thermometer
      },
      {
        title: "Sperm Quality Tips",
        description: "Evidence-based advice on improving sperm quality and conception odds",
        icon: Lightbulb
      },
      {
        title: "Pre-conception Checklist",
        description: "Track folic acid, vaccinations, and other pre-pregnancy preparations",
        icon: PlusCircle
      }
    ]
  },
  [LifeStage.PREGNANCY]: {
    icon: Heart,
    title: "Pregnancy",
    description: "Week-by-week guidance during pregnancy",
    color: "bg-purple-100 text-purple-800",
    features: [
      {
        title: "Gestational Age Tracker",
        description: "Week-by-week fetal development images and information",
        icon: CalendarCheck
      },
      {
        title: "Symptom & Kick Counter",
        description: "Track pregnancy symptoms and fetal movements with safety alerts",
        icon: Activity
      },
      {
        title: "Pregnancy Checklist Hub",
        description: "Prenatal visits, tests, and hospital bag preparation reminders",
        icon: PlusCircle
      },
      {
        title: "Weight & Vitals Log",
        description: "Track blood pressure, weight, and other important health metrics",
        icon: LineChart
      },
      {
        title: "Due Date Widgets",
        description: "Countdown to your due date with sharing options for partners",
        icon: Clock
      }
    ]
  },
  [LifeStage.PERIMENOPAUSE]: {
    icon: FlameIcon,
    title: "Perimenopause",
    description: "Navigating the transition to menopause",
    color: "bg-orange-100 text-orange-800",
    features: [
      {
        title: "Expanded Symptom Tracking",
        description: "Track hot flashes, night sweats, brain fog, and other perimenopause symptoms",
        icon: Activity
      },
      {
        title: "Sleep Quality & HRV",
        description: "Monitor sleep patterns and heart rate variability changes",
        icon: LineChart
      },
      {
        title: "Hormone Therapy Tracker",
        description: "Log dosages, schedules, and side effects of hormone treatments",
        icon: Pill
      },
      {
        title: "Cycle Variability Graph",
        description: "12-month view highlighting changes in your cycle pattern",
        icon: BarChart
      },
      {
        title: "Clinician Referral",
        description: "Get alerts when symptoms suggest you should consult a healthcare provider",
        icon: Lightbulb
      }
    ]
  },
  [LifeStage.NO_PERIOD]: {
    icon: ThermometerIcon,
    title: "No Period / HRT",
    description: "Support for those without menstruation",
    color: "bg-gray-100 text-gray-800",
    features: [
      {
        title: "Medication Adherence",
        description: "Track HRT, prolactin-suppressants, and other medications with refill reminders",
        icon: Pill
      },
      {
        title: "Recovery Milestones",
        description: "Track healing progress for surgical procedures or postpartum recovery",
        icon: CalendarCheck
      },
      {
        title: "Mood & Sleep Dashboard",
        description: "Monitor emotional wellbeing with depression screening tools",
        icon: Activity
      },
      {
        title: "Fertility Return Estimator",
        description: "For users coming off HRT or in post-partum amenorrhea",
        icon: LineChart
      },
      {
        title: "Community Stories",
        description: "Read experiences from others on a similar journey",
        icon: Book
      }
    ]
  }
};

const MilestonesPage = () => {
  const { 
    currentLifeStage, 
    changeLifeStage, 
    lifeStageFeatures, 
    getAvailableFeatures,
    toggleFeature,
    incrementFeatureUsage
  } = useAppStore();
  const { toast } = useToast();
  const [lifecycleTab, setLifecycleTab] = useState<string>(currentLifeStage);
  const [availableFeatures, setAvailableFeatures] = useState(getAvailableFeatures());
  const isMobile = useIsMobile();

  useEffect(() => {
    setAvailableFeatures(getAvailableFeatures());
  }, [getAvailableFeatures, lifecycleTab]);

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

  const handleToggleFeature = (featureId: string, currentState: boolean) => {
    toggleFeature(featureId, !currentState);
    
    toast({
      title: currentState ? "Feature Disabled" : "Feature Enabled",
      description: `The feature has been ${currentState ? "disabled" : "enabled"} successfully.`,
      duration: 3000,
    });
  };

  const handleUseFeature = (featureId: string, featureTitle: string) => {
    incrementFeatureUsage(featureId);
    
    toast({
      title: "Feature Used",
      description: `You are now using the ${featureTitle} feature.`,
      duration: 3000,
    });
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
              <div className="overflow-x-auto pb-2">
                <TabsList className={`flex ${isMobile ? 'flex-wrap justify-start gap-1 pb-1' : 'grid grid-cols-6'} w-full`}>
                  {Object.entries(lifeStageInfo).map(([stage, info]) => (
                    <TabsTrigger 
                      key={stage} 
                      value={stage} 
                      className={`flex flex-col items-center py-2 ${isMobile ? 'min-w-[5.5rem]' : ''}`}
                    >
                      <info.icon size={18} className="mb-1" />
                      <span className="text-xs">{info.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {Object.entries(lifeStageInfo).map(([stage, info]) => (
                <TabsContent key={stage} value={stage} className="pt-4">
                  <LifeStageCard
                    stage={stage as LifeStage}
                    icon={info.icon}
                    title={info.title}
                    description={info.description}
                    color={info.color}
                    isCurrentStage={stage === currentLifeStage}
                    onSwitch={() => handleLifeStageChange(stage)}
                  />

                  {stage === LifeStage.FIRST_PERIOD && currentLifeStage === LifeStage.FIRST_PERIOD && (
                    <div className="mt-4 p-4 border rounded-lg space-y-4">
                      <ConfidenceMeter />
                    </div>
                  )}

                  <div className="mt-4">
                    <h4 className="font-medium mb-3">Features in this mode:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {info.features.map((feature, index) => {
                        const featureId = lifeStageFeatures
                          .find(f => f.lifeStage === stage && f.title === feature.title)?.id;
                        
                        if (!featureId) return null;
                        
                        const featureData = lifeStageFeatures.find(f => f.id === featureId);
                        if (!featureData) return null;
                        
                        return (
                          <FeatureCard
                            key={index}
                            feature={feature}
                            status={featureData.implementationStatus}
                            enabled={featureData.enabled}
                            usageCount={featureData.usageCount || 0}
                            borderColor={info.color.replace('bg-', '#').replace('text-', '#').replace('100', '300').replace('800', '500')}
                            onUse={() => handleUseFeature(featureId, feature.title)}
                            onToggle={(enabled) => handleToggleFeature(featureId, enabled)}
                          />
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <CrossModeDesign />
      </div>
    </Layout>
  );
};

export default MilestonesPage;
