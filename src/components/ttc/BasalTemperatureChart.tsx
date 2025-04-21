import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { addDays, format, subDays } from 'date-fns';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Generate mock data for the chart
const generateMockData = (days: number = 30) => {
  const today = new Date();
  const data = [];
  let baseTemp = 36.4;
  let baseHRV = 54;
  
  // Simulate a typical BBT pattern with a rise after ovulation
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const day = date.getDate();
    
    // Simulate temperature pattern (lower before ovulation, higher after)
    let temp = baseTemp;
    let hrv = baseHRV;
    
    // Mimic ovulation around day 14 with temperature increase
    if (day > 14) {
      temp += 0.3 + (Math.random() * 0.1);
      hrv -= 5 + (Math.random() * 3);
    } else {
      temp += Math.random() * 0.2;
      hrv += Math.random() * 6 - 3;
    }
    
    // Add some randomness
    temp += (Math.random() * 0.1) - 0.05;
    
    data.push({
      date: format(date, 'MM/dd'),
      temperature: temp.toFixed(2),
      hrv: Math.round(hrv)
    });
  }
  
  return data;
};

export const BasalTemperatureChart: React.FC = () => {
  const { addFertilityData } = useAppStore();
  const { toast } = useToast();
  const [chartData, setChartData] = useState(generateMockData());
  const [chartPeriod, setChartPeriod] = useState('month');
  const [newTemp, setNewTemp] = useState('');
  const [newHRV, setNewHRV] = useState('');
  
  // Add a new temperature reading
  const addTemperature = () => {
    if (!newTemp) return;
    
    const tempValue = parseFloat(newTemp);
    
    if (isNaN(tempValue) || tempValue < 35 || tempValue > 39) {
      toast({
        title: "Invalid Temperature",
        description: "Please enter a valid temperature between 35°C and 39°C",
        variant: "destructive"
      });
      return;
    }
    
    // Add to fertility data
    addFertilityData({
      userId: 'guest',
      cycleId: 'current',
      basalTemperature: tempValue,
      date: new Date(),
    });
    
    // Update chart data
    const today = format(new Date(), 'MM/dd');
    const hrvValue = newHRV ? parseInt(newHRV) : null;
    
    const updatedData = [...chartData];
    const todayIndex = updatedData.findIndex(d => d.date === today);
    
    if (todayIndex >= 0) {
      updatedData[todayIndex] = {
        ...updatedData[todayIndex],
        temperature: tempValue.toFixed(2),
        ...(hrvValue ? { hrv: hrvValue } : {})
      };
    } else {
      updatedData.push({
        date: today,
        temperature: tempValue.toFixed(2),
        ...(hrvValue ? { hrv: hrvValue } : {})
      });
    }
    
    setChartData(updatedData);
    setNewTemp('');
    setNewHRV('');
    
    toast({
      title: "Reading Added",
      description: `Temperature of ${tempValue}°C has been recorded for today.`
    });
  };
  
  // Get chart data for the selected period
  const getChartDataForPeriod = () => {
    if (chartPeriod === 'week') {
      return chartData.slice(-7);
    } else if (chartPeriod === 'month') {
      return chartData;
    } else {
      return chartData.slice(-14);
    }
  };
  
  // Estimated ovulation line position
  const findOvulationDay = () => {
    for (let i = 1; i < chartData.length; i++) {
      const current = parseFloat(chartData[i].temperature);
      const previous = parseFloat(chartData[i-1].temperature);
      
      if (current - previous > 0.2) {
        return chartData[i].date;
      }
    }
    return null;
  };
  
  const ovulationDay = findOvulationDay();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basal Temperature & HRV Insights</CardTitle>
        <CardDescription>
          Track your basal body temperature and heart rate variability
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Time period tabs */}
          <Tabs value={chartPeriod} onValueChange={setChartPeriod}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="2week">2 Weeks</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Temperature chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getChartDataForPeriod()}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  yAxisId="temp"
                  domain={[35.8, 37.2]} 
                  ticks={[36, 36.2, 36.4, 36.6, 36.8, 37, 37.2]}
                  label={{ value: '°C', angle: -90, position: 'insideLeft' }} 
                />
                <YAxis 
                  yAxisId="hrv"
                  orientation="right"
                  domain={[40, 70]}
                  ticks={[40, 45, 50, 55, 60, 65, 70]}
                  label={{ value: 'ms', angle: 90, position: 'insideRight' }} 
                />
                <Tooltip formatter={(value, name) => {
                  if (name === 'temperature') return [`${value}°C`, 'Temperature'];
                  if (name === 'hrv') return [`${value}ms`, 'HRV'];
                  return [value, name];
                }} />
                <Legend />
                <Line 
                  yAxisId="temp"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#F97316" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  yAxisId="hrv"
                  type="monotone" 
                  dataKey="hrv" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                />
                {ovulationDay && (
                  <ReferenceLine 
                    x={ovulationDay} 
                    stroke="#D946EF" 
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    label={{ value: 'Est. Ovulation', fill: '#D946EF', position: 'top' }}
                    yAxisId="temp"
                  />
                )}
                <ReferenceLine 
                  yAxisId="temp"
                  y={36.6} 
                  stroke="#64748B" 
                  strokeDasharray="3 3"
                  label={{ value: 'Baseline', fill: '#64748B', position: 'insideBottomRight' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Add new reading */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Add Today's Reading</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input 
                    id="temperature"
                    type="number" 
                    placeholder="36.50"
                    step="0.01"
                    min="35"
                    max="39"
                    value={newTemp}
                    onChange={(e) => setNewTemp(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hrv">HRV (ms) - Optional</Label>
                  <Input 
                    id="hrv"
                    type="number" 
                    placeholder="55"
                    step="1"
                    min="20"
                    max="100"
                    value={newHRV}
                    onChange={(e) => setNewHRV(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={addTemperature}
                disabled={!newTemp}
              >
                Record Today's Reading
              </Button>
            </CardContent>
          </Card>
          
          {/* Insights */}
          <Card className="bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Temperature Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">How to use:</span> Take your temperature every morning at the same time, 
                  before getting out of bed or any activity.
                </p>
                <p>
                  <span className="font-medium">What to look for:</span> A sustained rise of 0.2°C or more indicates that 
                  ovulation has occurred. This typically happens around day 14 of your cycle.
                </p>
                <p>
                  <span className="font-medium">HRV insights:</span> HRV often decreases slightly after ovulation due to 
                  hormonal changes. Lower HRV with higher temperature helps confirm ovulation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
