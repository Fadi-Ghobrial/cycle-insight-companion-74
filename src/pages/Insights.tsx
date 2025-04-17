
import React, { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DropletIcon, CalendarIcon, ThermometerIcon, ActivityIcon, BarChart3 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CyclePhase, FlowLevel, Symptom } from '@/types';

const Insights: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { cycles, cycleDays, currentCycleId } = useAppStore();
  
  const currentCycle = cycles.find(c => c.id === currentCycleId);
  
  // Calculate cycle stats
  const calculateStats = () => {
    if (cycleDays.length === 0) {
      return {
        avgCycleLength: 0,
        avgPeriodLength: 0,
        nextPeriodDate: null,
        daysUntilNextPeriod: 0,
        mostCommonSymptoms: [],
      };
    }
    
    // Sort cycle days by date
    const sortedDays = [...cycleDays].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate average cycle length
    let avgCycleLength = 28; // Default
    if (cycles.length > 1) {
      const cycleLengths = cycles
        .filter(c => c.daysInCycle)
        .map(c => c.daysInCycle as number);
      
      if (cycleLengths.length > 0) {
        avgCycleLength = cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length;
      }
    }
    
    // Calculate average period length
    const periodDays = sortedDays.filter(day => day.flow !== undefined);
    const periods: Array<{start: Date, days: number}> = [];
    
    let currentPeriodStart: Date | null = null;
    let currentPeriodDays = 0;
    
    periodDays.forEach((day, i) => {
      if (i === 0 || differenceInDays(day.date, periodDays[i-1].date) > 1) {
        // Start of a new period
        if (currentPeriodStart !== null) {
          periods.push({ start: currentPeriodStart, days: currentPeriodDays });
        }
        currentPeriodStart = day.date;
        currentPeriodDays = 1;
      } else {
        // Continuation of current period
        currentPeriodDays++;
      }
    });
    
    // Add the last period if it exists
    if (currentPeriodStart !== null) {
      periods.push({ start: currentPeriodStart, days: currentPeriodDays });
    }
    
    const avgPeriodLength = periods.length > 0
      ? periods.reduce((sum, period) => sum + period.days, 0) / periods.length
      : 0;
    
    // Calculate next period date and days until
    let nextPeriodDate = null;
    let daysUntilNextPeriod = 0;
    
    if (currentCycle?.predictions?.nextPeriodStart) {
      nextPeriodDate = new Date(currentCycle.predictions.nextPeriodStart);
      daysUntilNextPeriod = differenceInDays(nextPeriodDate, new Date());
    }
    
    // Calculate most common symptoms
    const symptomCounts: Record<string, number> = {};
    
    sortedDays.forEach(day => {
      if (day.symptoms && day.symptoms.length > 0) {
        day.symptoms.forEach(symptom => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
      }
    });
    
    const mostCommonSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([symptom, count]) => ({ symptom, count }));
    
    return {
      avgCycleLength: Math.round(avgCycleLength),
      avgPeriodLength: Math.round(avgPeriodLength),
      nextPeriodDate,
      daysUntilNextPeriod,
      mostCommonSymptoms,
    };
  };
  
  const stats = calculateStats();
  
  // Prepare data for temperature chart
  const prepareTemperatureData = () => {
    if (cycleDays.length === 0) return [];
    
    return cycleDays
      .filter(day => day.baselTemperature !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(day => ({
        date: format(new Date(day.date), 'MMM dd'),
        temperature: day.baselTemperature,
      }));
  };
  
  // Prepare data for symptom chart
  const prepareSymptomData = () => {
    if (cycleDays.length === 0) return [];
    
    const symptomCounts: Record<string, number> = {};
    
    cycleDays.forEach(day => {
      if (day.symptoms && day.symptoms.length > 0) {
        day.symptoms.forEach(symptom => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
      }
    });
    
    return Object.entries(symptomCounts)
      .map(([name, value]) => ({ name, value }));
  };
  
  const temperatureData = prepareTemperatureData();
  const symptomData = prepareSymptomData();
  
  // Colors for pie chart
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">Cycle Insights</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DropletIcon className="text-pink-500" size={18} />
                    Cycle Length
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cycle-primary">
                    {stats.avgCycleLength || '--'} <span className="text-sm text-gray-500">days</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Average cycle length</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="text-pink-500" size={18} />
                    Period Length
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cycle-primary">
                    {stats.avgPeriodLength || '--'} <span className="text-sm text-gray-500">days</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Average period duration</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="text-cycle-primary" size={18} />
                    Next Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cycle-primary">
                    {stats.nextPeriodDate ? format(stats.nextPeriodDate, 'MMM dd') : '--'}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {stats.daysUntilNextPeriod > 0 
                      ? `In ${stats.daysUntilNextPeriod} days`
                      : stats.daysUntilNextPeriod === 0
                      ? "Today"
                      : "Calculating..."}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ActivityIcon className="text-cycle-primary" size={18} />
                    Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-cycle-primary">
                    {cycleDays.length || '0'} <span className="text-sm text-gray-500">days</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Total days tracked</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Common Symptoms</CardTitle>
                  <CardDescription>Your most frequent symptoms</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.mostCommonSymptoms.length > 0 ? (
                    <div className="space-y-3">
                      {stats.mostCommonSymptoms.map(({ symptom, count }) => (
                        <div key={symptom} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge className="capitalize bg-purple-100 text-purple-800 hover:bg-purple-200">
                              {symptom.replace('_', ' ')}
                            </Badge>
                          </div>
                          <span className="text-sm font-medium">{count} days</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No symptom data recorded yet
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Current Cycle</CardTitle>
                  <CardDescription>
                    {currentCycle?.predictions 
                      ? `Cycle started on ${format(new Date(currentCycle.startDate), 'MMMM dd, yyyy')}`
                      : "No active cycle detected"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentCycle?.predictions ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Period</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge className="bg-pink-100 text-pink-800">
                              {format(new Date(currentCycle.startDate), 'MMM dd')} - 
                              {format(new Date(currentCycle.predictions.nextPeriodEnd), 'MMM dd')}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Fertile Window</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge className="bg-green-100 text-green-800">
                              {format(new Date(currentCycle.predictions.nextFertileWindowStart), 'MMM dd')} - 
                              {format(new Date(currentCycle.predictions.nextFertileWindowEnd), 'MMM dd')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Ovulation</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge className="bg-green-200 text-green-800">
                            {format(new Date(currentCycle.predictions.nextOvulationDate), 'MMMM dd')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Prediction Confidence</p>
                        <div className="relative pt-1 mt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div 
                              style={{ width: `${(currentCycle.predictions.confidence * 100).toFixed(0)}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cycle-primary"
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Low</span>
                            <span>{(currentCycle.predictions.confidence * 100).toFixed(0)}%</span>
                            <span>High</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">No cycle predictions yet</p>
                      <Button 
                        onClick={() => window.location.href = '/track'}
                        className="bg-cycle-primary hover:bg-cycle-secondary"
                      >
                        Start Tracking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThermometerIcon className="text-red-500" size={18} />
                  Temperature Chart
                </CardTitle>
                <CardDescription>Your basal body temperature over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {temperatureData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={temperatureData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[36, 38]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#8884d8" 
                        name="Temperature (°C)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No temperature data recorded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="text-cycle-primary" size={18} />
                  Symptom Distribution
                </CardTitle>
                <CardDescription>Frequency of recorded symptoms</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {symptomData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={symptomData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name }) => name.replace('_', ' ')}
                      >
                        {symptomData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name.replace('_', ' ')]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No symptom data recorded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cycle Predictions</CardTitle>
                <CardDescription>Machine learning based predictions</CardDescription>
              </CardHeader>
              <CardContent>
                {currentCycle?.predictions ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Phase Predictions</h3>
                      <div className="space-y-3">
                        {currentCycle.predictions.phases.map((phase, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <Badge className={`
                                ${phase.phase === CyclePhase.MENSTRUAL ? 'bg-red-100 text-red-800' : ''}
                                ${phase.phase === CyclePhase.FOLLICULAR ? 'bg-blue-100 text-blue-800' : ''}
                                ${phase.phase === CyclePhase.OVULATION ? 'bg-green-100 text-green-800' : ''}
                                ${phase.phase === CyclePhase.LUTEAL ? 'bg-purple-100 text-purple-800' : ''}
                              `}>
                                {phase.phase.charAt(0).toUpperCase() + phase.phase.slice(1)} Phase
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {format(new Date(phase.startDate), 'MMM dd')} - {format(new Date(phase.endDate), 'MMM dd')}
                              </span>
                            </div>
                            
                            {phase.symptoms && phase.symptoms.length > 0 && (
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Common symptoms in this phase:</p>
                                <div className="flex flex-wrap gap-1">
                                  {phase.symptoms.map(symptom => (
                                    <Badge key={symptom} variant="outline" className="capitalize">
                                      {symptom.replace('_', ' ')}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Key Dates</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Next Period Start</span>
                          <Badge className="bg-pink-100 text-pink-800">
                            {format(new Date(currentCycle.predictions.nextPeriodStart), 'MMMM dd, yyyy')}
                          </Badge>
                        </li>
                        <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Next Period End</span>
                          <Badge className="bg-pink-100 text-pink-800">
                            {format(new Date(currentCycle.predictions.nextPeriodEnd), 'MMMM dd, yyyy')}
                          </Badge>
                        </li>
                        <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Fertile Window Start</span>
                          <Badge className="bg-green-100 text-green-800">
                            {format(new Date(currentCycle.predictions.nextFertileWindowStart), 'MMMM dd, yyyy')}
                          </Badge>
                        </li>
                        <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Fertile Window End</span>
                          <Badge className="bg-green-100 text-green-800">
                            {format(new Date(currentCycle.predictions.nextFertileWindowEnd), 'MMMM dd, yyyy')}
                          </Badge>
                        </li>
                        <li className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Predicted Ovulation</span>
                          <Badge className="bg-green-200 text-green-800">
                            {format(new Date(currentCycle.predictions.nextOvulationDate), 'MMMM dd, yyyy')}
                          </Badge>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-500">
                        Predictions are based on your historical cycle data and are continuously refined with more tracking data. 
                        Our algorithm has a confidence rating of {(currentCycle.predictions.confidence * 100).toFixed(0)}% 
                        for your current predictions.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">
                      No predictions available yet. Add more cycle data to generate predictions.
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/track'}
                      className="bg-cycle-primary hover:bg-cycle-secondary"
                    >
                      Start Tracking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Insights;
