
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Book, Heart, BabyIcon, FlameIcon, 
  ThermometerIcon, Sparkles, Calendar, 
  CalendarCheck, PlusCircle, LineChart, 
  Thermometer, Pill, Activity, Clock, Brain,
  Microscope, BarChart, Droplets, Lightbulb,
  Check, Settings, Lock
} from 'lucide-react';
import { LifeStage, LifeStageFeature } from '@/types';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';

const MilestonesPage: React.FC = () => {
  const { 
    currentLifeStage, 
    changeLifeStage, 
    lifeStageFeatures, 
    getAvailableFeatures,
    toggleFeature,
    incrementFeatureUsage,
    lifeStageData
  } = useAppStore();
  const { toast } = useToast();
  const [lifecycleTab, setLifecycleTab] = useState<string>(currentLifeStage);
  const [availableFeatures, setAvailableFeatures] = useState<LifeStageFeature[]>([]);

  // Get features for the current life stage
  useEffect(() => {
    setAvailableFeatures(getAvailableFeatures());
  }, [getAvailableFeatures, lifecycleTab]);

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
          description: "Export a PDF of logs to a trusted adult without giving full account access",
          icon: PlusCircle
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

  const getFeatureStatus = (id: string) => {
    const feature = lifeStageFeatures.find(f => f.id === id);
    if (!feature) return { enabled: false, status: 'planned' };
    return { enabled: feature.enabled, status: feature.implementationStatus };
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
                  <div className="flex flex-col gap-6">
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

                    {/* Feature Status Section */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">Features in this mode:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {info.features.map((feature, index) => {
                          const featureId = lifeStageFeatures
                            .find(f => f.lifeStage === stage && f.title === feature.title)?.id;
                          
                          if (!featureId) return null;
                          
                          const { enabled, status } = getFeatureStatus(featureId);
                          const usageCount = lifeStageFeatures
                            .find(f => f.id === featureId)?.usageCount || 0;
                          
                          return (
                            <Card key={index} className="border-l-4" style={{ borderLeftColor: info.color.replace('bg-', '#').replace('text-', '#').replace('100', '300').replace('800', '500') }}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3 mb-2">
                                  <feature.icon className={`${info.color} w-5 h-5`} />
                                  <h5 className="font-medium">{feature.title}</h5>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                                
                                <div className="flex flex-col gap-2 mt-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Status: 
                                      <Badge variant="outline" className="ml-2">
                                        {status === 'completed' ? (
                                          <span className="flex items-center text-green-600">
                                            <Check className="w-3 h-3 mr-1" /> Ready
                                          </span>
                                        ) : status === 'in_progress' ? (
                                          <span className="flex items-center text-yellow-600">
                                            <Activity className="w-3 h-3 mr-1" /> In Progress
                                          </span>
                                        ) : (
                                          <span className="flex items-center text-blue-600">
                                            <Calendar className="w-3 h-3 mr-1" /> Planned
                                          </span>
                                        )}
                                      </Badge>
                                    </span>
                                    
                                    <span className="text-xs text-gray-500">
                                      Used: {usageCount} times
                                    </span>
                                  </div>
                                  
                                  {status === 'completed' && (
                                    <div className="flex justify-between gap-2 mt-1">
                                      <Button 
                                        size="sm" 
                                        variant={enabled ? "default" : "outline"}
                                        className="text-xs w-full"
                                        onClick={() => handleUseFeature(featureId, feature.title)}
                                        disabled={!enabled}
                                      >
                                        Use Feature
                                      </Button>
                                      
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs"
                                        onClick={() => handleToggleFeature(featureId, enabled)}
                                      >
                                        <Settings className="w-3 h-3 mr-1" />
                                      </Button>
                                    </div>
                                  )}
                                  
                                  {status !== 'completed' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="text-xs w-full mt-1"
                                      disabled
                                    >
                                      <Lock className="w-3 h-3 mr-1" />
                                      {status === 'in_progress' ? 'Coming Soon' : 'Planned'}
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    {/* Special UI Elements for First Period mode */}
                    {stage === LifeStage.FIRST_PERIOD && currentLifeStage === LifeStage.FIRST_PERIOD && (
                      <div className="mt-4 p-4 border rounded-lg">
                        <h4 className="font-medium mb-3">Your Period Confidence Meter</h4>
                        <div className="mb-2">
                          <Progress 
                            value={lifeStageData.firstPeriod.confidenceMeter?.confidenceLevel || 0} 
                            className="h-2 bg-pink-100"
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          {lifeStageData.firstPeriod.confidenceMeter?.consecutiveCyclesLogged || 0} of 3 cycles logged.
                          {lifeStageData.firstPeriod.confidenceMeter?.confidenceLevel === 100 
                            ? " Great job! We now have a good understanding of your cycle." 
                            : " Keep logging your period to help us understand your cycle better."}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end mt-2">
                      {stage !== currentLifeStage && (
                        <button 
                          className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${info.color.replace('bg-', 'bg-').replace('text-', 'bg-').replace('100', '600').replace('800', '700')}`}
                          onClick={() => handleLifeStageChange(stage)}
                        >
                          Switch to {info.title} Mode
                        </button>
                      )}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Cross-Mode Design</CardTitle>
            <CardDescription>
              How our app adapts to your changing needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="text-cycle-primary" size={18} />
                  <h3 className="font-medium">Single Data Model, Multiple Views</h3>
                </div>
                <p className="text-sm text-gray-600">Every log lives in one table with a life stage tag; the UI decides what to surface.</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-cycle-primary" size={18} />
                  <h3 className="font-medium">Smart-Switch Prompts</h3>
                </div>
                <p className="text-sm text-gray-600">We detect triggers (like no period for 60 days) and invite you to switch modes.</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="text-cycle-primary" size={18} />
                  <h3 className="font-medium">Always-On Privacy</h3>
                </div>
                <p className="text-sm text-gray-600">Sensitive fields inherit the highest encryption level to protect your data.</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarCheck className="text-cycle-primary" size={18} />
                  <h3 className="font-medium">Historical Continuity</h3>
                </div>
                <p className="text-sm text-gray-600">Timeline badges show when a mode changed so past data still makes sense.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MilestonesPage;
