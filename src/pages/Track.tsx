import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { FlowLevel, Mood, Symptom } from '@/types';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

const Track: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [flowLevel, setFlowLevel] = useState<FlowLevel | undefined>(undefined);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState<string>('');
  
  const { addCycleDay, cycleDays, user } = useAppStore();
  const { toast } = useToast();
  
  const handleFlowSelect = (flow: FlowLevel) => {
    setFlowLevel(flowLevel === flow ? undefined : flow);
  };
  
  const handleMoodSelect = (selectedMood: Mood) => {
    setMoods(prevMoods => {
      if (prevMoods.includes(selectedMood)) {
        return prevMoods.filter(m => m !== selectedMood);
      } else {
        return [...prevMoods, selectedMood];
      }
    });
  };
  
  const handleSymptomToggle = (symptom: Symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };
  
  const handleQuickAdd = () => {
    addCycleDay({
      date: selectedDate,
      flow: FlowLevel.MEDIUM,
      symptoms: [],
      moods: [],
      userId: user?.id || 'guest'
    });
    
    toast({
      title: "Flow added",
      description: "Medium flow added for the selected date.",
    });
  };
  
  const handleReset = () => {
    setSelectedDate(new Date());
    setFlowLevel(undefined);
    setMoods([]);
    setSymptoms([]);
    setTemperature(undefined);
    setNotes('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if we have at least one piece of data
    if (!flowLevel && moods.length === 0 && symptoms.length === 0 && !temperature && !notes) {
      toast({
        title: "Error",
        description: "Please add at least one type of data to track.",
        variant: "destructive"
      });
      return;
    }
    
    // Add the cycle day data
    addCycleDay({
      date: selectedDate,
      flow: flowLevel,
      moods: moods,
      symptoms: symptoms,
      baselTemperature: temperature,
      notes: notes,
      userId: user?.id || 'guest'
    });
    
    toast({
      title: "Success",
      description: "Your data has been saved.",
    });
    
    // Reset form
    handleReset();
  };
  
  return (
    <Layout requireAuth={true}>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">Track Your Cycle</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Today's Entry</CardTitle>
              <CardDescription>
                Log how you're feeling today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Flow Tracking */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period Flow</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {Object.values(FlowLevel).map(flow => (
                      <button
                        key={flow}
                        type="button"
                        className={`py-2 px-4 rounded-lg text-sm ${
                          flowLevel === flow 
                            ? 'bg-phase-menstrual text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                        onClick={() => handleFlowSelect(flow)}
                      >
                        {flow.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Mood Tracking */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Moods (Select multiple)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.values(Mood).map(moodOption => (
                      <button
                        key={moodOption}
                        type="button"
                        className={`py-2 px-4 rounded-lg text-sm ${
                          moods.includes(moodOption)
                            ? 'bg-symptom-mood text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                        onClick={() => handleMoodSelect(moodOption)}
                      >
                        {moodOption}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.values(Symptom).map(symptom => (
                      <button
                        key={symptom}
                        type="button"
                        className={`py-2 px-4 rounded-lg text-sm text-left ${
                          symptoms.includes(symptom) 
                            ? 'bg-symptom-secondary text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                        onClick={() => handleSymptomToggle(symptom)}
                      >
                        {symptom.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Basal Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="42"
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md"
                    value={temperature || ''}
                    onChange={(e) => setTemperature(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-md h-24"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes about your day..."
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Save Entry
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>
                Choose a date for this entry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedDate(new Date())}
                  className="w-full"
                >
                  Reset to Today
                </Button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Add</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    onClick={handleQuickAdd}
                    className="w-full"
                  >
                    Add Flow
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleReset}
                    className="w-full"
                  >
                    Clear Form
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Track;
