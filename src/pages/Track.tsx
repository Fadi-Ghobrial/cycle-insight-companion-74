import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';
import { FlowLevel, Mood, Symptom } from '@/types';
import Layout from '@/components/layout/Layout';
import { format } from 'date-fns';
import { DropletIcon, ThermometerIcon, SmileIcon, Activity } from 'lucide-react';

const Track: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("flow");
  const [selectedFlow, setSelectedFlow] = useState<FlowLevel | undefined>(undefined);
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>(undefined);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");
  
  const { addCycleDay, cycleDays } = useAppStore();
  const navigate = useNavigate();
  
  const existingData = cycleDays.find(
    day => format(day.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      if (existingData) {
        setSelectedFlow(existingData.flow);
        setSelectedMood(existingData.mood);
        setSelectedSymptoms(existingData.symptoms);
        setTemperature(existingData.baselTemperature);
        setNotes(existingData.notes || "");
      } else {
        setSelectedFlow(undefined);
        setSelectedMood(undefined);
        setSelectedSymptoms([]);
        setTemperature(undefined);
        setNotes("");
      }
      setIsDialogOpen(true);
    }
  };
  
  const handleSave = () => {
    addCycleDay({
      date,
      flow: selectedFlow,
      mood: selectedMood,
      symptoms: selectedSymptoms,
      baselTemperature: temperature,
      notes
    });
    
    toast({
      title: "Tracking data saved",
      description: `Data for ${format(date, 'MMMM dd, yyyy')} has been saved.`
    });
    
    setIsDialogOpen(false);
    navigate('/calendar');
  };
  
  const toggleSymptom = (symptom: Symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">Track Your Cycle</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select a Date</CardTitle>
              <CardDescription>Choose a date to log cycle information</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border p-3 pointer-events-auto"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Add</CardTitle>
              <CardDescription>Quickly log your period for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Select your flow level for today:</p>
                
                <div className="flex flex-wrap gap-2">
                  {Object.values(FlowLevel).map((flow) => (
                    <Button
                      key={flow}
                      variant="outline"
                      className={`flex items-center gap-2 ${
                        selectedFlow === flow 
                          ? 'bg-cycle-primary text-white' 
                          : 'hover:bg-cycle-primary/10'
                      }`}
                      onClick={() => setSelectedFlow(flow)}
                    >
                      <DropletIcon size={16} />
                      <span className="capitalize">{flow.replace('_', ' ')}</span>
                    </Button>
                  ))}
                </div>
                
                <Button
                  className="w-full mt-4 bg-cycle-primary hover:bg-cycle-secondary"
                  onClick={() => {
                    if (selectedFlow) {
                      addCycleDay({
                        date: new Date(),
                        flow: selectedFlow,
                        symptoms: []
                      });
                      
                      toast({
                        title: "Period logged",
                        description: "Your period has been logged for today."
                      });
                      
                      navigate('/calendar');
                    } else {
                      toast({
                        title: "Flow level required",
                        description: "Please select a flow level.",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  Save for Today
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>
                {format(date, 'MMMM dd, yyyy')}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="flow">Flow</TabsTrigger>
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                <TabsTrigger value="mood">Mood</TabsTrigger>
                <TabsTrigger value="more">More</TabsTrigger>
              </TabsList>
              
              <TabsContent value="flow" className="space-y-4 mt-4">
                <h3 className="font-medium flex items-center gap-2">
                  <DropletIcon size={18} className="text-cycle-primary" />
                  Flow Level
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(FlowLevel).map((flow) => (
                    <Button
                      key={flow}
                      variant="outline"
                      className={`flex items-center justify-center gap-2 ${
                        selectedFlow === flow 
                          ? 'bg-cycle-primary text-white' 
                          : 'hover:bg-cycle-primary/10'
                      }`}
                      onClick={() => setSelectedFlow(flow)}
                    >
                      <span className="capitalize">{flow.replace('_', ' ')}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="symptoms" className="space-y-4 mt-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Activity size={18} className="text-cycle-primary" />
                  Symptoms
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(Symptom).slice(0, 10).map((symptom) => (
                    <Button
                      key={symptom}
                      variant="outline"
                      className={`flex items-center justify-start gap-2 ${
                        selectedSymptoms.includes(symptom) 
                          ? 'bg-cycle-primary text-white' 
                          : 'hover:bg-cycle-primary/10'
                      }`}
                      onClick={() => toggleSymptom(symptom)}
                    >
                      <span className="capitalize">{symptom.replace('_', ' ')}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="mood" className="space-y-4 mt-4">
                <h3 className="font-medium flex items-center gap-2">
                  <SmileIcon size={18} className="text-cycle-primary" />
                  Mood
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(Mood).map((mood) => (
                    <Button
                      key={mood}
                      variant="outline"
                      className={`flex items-center justify-center gap-2 ${
                        selectedMood === mood 
                          ? 'bg-cycle-primary text-white' 
                          : 'hover:bg-cycle-primary/10'
                      }`}
                      onClick={() => setSelectedMood(mood)}
                    >
                      <span className="capitalize">{mood}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="more" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <ThermometerIcon size={18} className="text-cycle-primary" />
                    Basal Body Temperature
                  </h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={temperature ? [temperature] : [36.5]}
                      min={35.5}
                      max={38.0}
                      step={0.1}
                      onValueChange={(value) => setTemperature(value[0])}
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">35.5°C</span>
                      <span className="text-sm font-medium">
                        {temperature ? temperature.toFixed(1) : "36.5"}°C
                      </span>
                      <span className="text-sm text-gray-500">38.0°C</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Notes</h3>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about how you're feeling..."
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-cycle-primary hover:bg-cycle-secondary"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Track;
