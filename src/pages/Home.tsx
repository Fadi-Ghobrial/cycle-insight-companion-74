import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import Calendar from '@/components/calendar/Calendar';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Baby, Flame, ThermometerSun, AlertCircle } from 'lucide-react';
import { LifeStage } from '@/types';
import CalendarLegend from '@/components/calendar/CalendarLegend';

const Home: React.FC = () => {
  const { cycleDays, isAuthenticated, currentLifeStage, lifeStageHistory } = useAppStore();
  
  const renderLifeStageContent = () => {
    switch(currentLifeStage) {
      case LifeStage.FIRST_PERIOD:
        return (
          <Card className="bg-pink-50 border-pink-200 mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="text-pink-500" size={20} />
                <CardTitle className="text-lg text-pink-700">First Period Mode</CardTitle>
              </div>
              <CardDescription>Building your cycle confidence and literacy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-pink-700 mb-3">Track your first few cycles to understand your unique pattern.</p>
              <Link to="/learn/menstrual_basics">
                <Button variant="outline" className="border-pink-500 text-pink-700 hover:bg-pink-100">
                  Learn Menstrual Basics
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
        
      case LifeStage.TTC:
        return (
          <Card className="bg-green-50 border-green-200 mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Baby className="text-green-500" size={20} />
                <CardTitle className="text-lg text-green-700">Trying to Conceive Mode</CardTitle>
              </div>
              <CardDescription>Optimize your chances of conception</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">Fertile Window</p>
                  <p className="font-bold text-green-700">April 20 - 25, 2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ovulation Day</p>
                  <p className="font-bold text-green-700">April 22, 2025</p>
                </div>
              </div>
              <Link to="/insights">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  View Fertility Insights
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
        
      case LifeStage.PREGNANCY:
        return (
          <Card className="bg-purple-50 border-purple-200 mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Baby className="text-purple-500" size={20} />
                <CardTitle className="text-lg text-purple-700">Pregnancy Mode</CardTitle>
              </div>
              <CardDescription>Week-by-week pregnancy tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-3">
                <Badge className="bg-purple-200 text-purple-800">Week 12</Badge>
                <p className="mt-2 text-purple-700">Your baby is the size of a lime</p>
                <p className="text-sm text-gray-600">Congratulations on reaching the second trimester!</p>
              </div>
              <Link to="/learn">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Pregnancy Resources
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
        
      case LifeStage.PERIMENOPAUSE:
        return (
          <Card className="bg-orange-50 border-orange-200 mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Flame className="text-orange-500" size={20} />
                <CardTitle className="text-lg text-orange-700">Perimenopause Mode</CardTitle>
              </div>
              <CardDescription>Track symptoms during your transition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-3">
                <Button variant="outline" size="sm" className="bg-white border-orange-300 text-orange-700 hover:bg-orange-100">
                  Hot Flash
                </Button>
                <Button variant="outline" size="sm" className="bg-white border-orange-300 text-orange-700 hover:bg-orange-100">
                  Mood Change
                </Button>
                <Button variant="outline" size="sm" className="bg-white border-orange-300 text-orange-700 hover:bg-orange-100">
                  Sleep Issue
                </Button>
              </div>
              <Link to="/track">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Track Symptoms
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
        
      case LifeStage.NO_PERIOD:
        return (
          <Card className="bg-blue-50 border-blue-200 mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ThermometerSun className="text-blue-500" size={20} />
                <CardTitle className="text-lg text-blue-700">No Period / HRT Mode</CardTitle>
              </div>
              <CardDescription>Track symptoms and medication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <p className="text-blue-700">Medication reminders and symptom tracking customized for your needs</p>
              </div>
              <Link to="/track">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Track Symptoms
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Layout requireAuth={true}>
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-cycle-primary mb-2">CycleInsight Companion</h1>
          <p className="text-lg text-gray-600 text-center max-w-2xl">
            Your clinically validated cycle-prediction engine for comprehensive health tracking
          </p>
        </div>
        
        {renderLifeStageContent()}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Your Cycle Calendar</h2>
            <Calendar />
            <CalendarLegend />
            <div className="mt-4 flex justify-center">
              <Link 
                to="/calendar" 
                className="inline-flex items-center px-4 py-2 bg-cycle-primary text-white rounded-md hover:bg-cycle-secondary transition-colors"
              >
                Full Calendar View
              </Link>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-3">Quick Track</h2>
              <p className="text-gray-600 mb-4">Log your period, symptoms, and mood with just a few taps.</p>
              <Link 
                to="/track" 
                className="inline-flex items-center px-4 py-2 bg-cycle-primary text-white rounded-md hover:bg-cycle-secondary transition-colors w-full justify-center"
              >
                Track Today
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-3">Life Stage</h2>
              <p className="text-gray-600 mb-4">Personalize your experience based on your current life stage.</p>
              <Link 
                to="/learn" 
                className="inline-flex items-center px-4 py-2 border border-cycle-primary text-cycle-primary rounded-md hover:bg-cycle-primary/10 transition-colors w-full justify-center"
              >
                Change Life Stage
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-3">Cycle Insights</h2>
              <p className="text-gray-600 mb-4">Get personalized insights and predictions about your cycle.</p>
              <Link 
                to="/insights" 
                className="inline-flex items-center px-4 py-2 border border-cycle-primary text-cycle-primary rounded-md hover:bg-cycle-primary/10 transition-colors w-full justify-center"
              >
                View Insights
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-cycle-primary">Cycle Prediction</h3>
              <p className="text-sm text-gray-600 mt-2">Advanced ML algorithms for accurate cycle predictions</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-cycle-primary">Symptom Tracking</h3>
              <p className="text-sm text-gray-600 mt-2">Log symptoms, mood, and more with custom tags</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-cycle-primary">Health Integration</h3>
              <p className="text-sm text-gray-600 mt-2">Connect with Apple Health and Samsung Health</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium text-cycle-primary">Life Stages</h3>
              <p className="text-sm text-gray-600 mt-2">Customize your experience to your current needs</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
