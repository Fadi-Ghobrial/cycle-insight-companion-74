
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, differenceInDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import { FlowLevel, Mood, Symptom, CyclePhase } from '@/types';
import { DropletIcon, ChevronLeft, ChevronRight, CalendarIcon, SmileIcon, ThermometerIcon, Pencil, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFlow, setEditFlow] = useState<FlowLevel | undefined>(undefined);
  const [editSymptoms, setEditSymptoms] = useState<Symptom[]>([]);
  const [editNotes, setEditNotes] = useState('');
  
  const { cycleDays, cycles, currentCycleId, addCycleDay, updateCycleDay, deleteCycleDay } = useAppStore();
  
  // Get days in current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get current cycle and predictions
  const currentCycle = cycles.find(cycle => cycle.id === currentCycleId);
  const predictions = currentCycle?.predictions;
  
  // Navigation functions
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Get cycle data for a specific date
  const getCycleDataForDate = (date: Date) => {
    return cycleDays.find(day => 
      isSameDay(new Date(day.date), date)
    );
  };
  
  // Get phase for a specific date
  const getPhaseForDate = (date: Date): CyclePhase | undefined => {
    if (!currentCycle?.predictions?.phases) return undefined;
    
    for (const phasePrediction of currentCycle.predictions.phases) {
      const phaseStart = new Date(phasePrediction.startDate);
      const phaseEnd = new Date(phasePrediction.endDate);
      
      if (date >= phaseStart && date <= phaseEnd) {
        return phasePrediction.phase;
      }
    }
    
    return undefined;
  };
  
  // Handle day click
  const handleDayClick = (day: Date) => {
    const exactDay = new Date(day.getTime());
    setSelectedDate(exactDay);
    
    const cycleData = getCycleDataForDate(exactDay);
    
    // Initialize edit state
    setEditFlow(cycleData?.flow);
    setEditSymptoms(cycleData?.symptoms || []);
    setEditNotes(cycleData?.notes || '');
    setIsEditMode(false);
    
    setIsDialogOpen(true);
  };
  
  // Handle edit
  const handleEdit = () => {
    setIsEditMode(true);
  };
  
  // Handle save
  const handleSave = () => {
    if (!selectedDate) return;
    
    const cycleData = getCycleDataForDate(selectedDate);
    
    if (cycleData) {
      updateCycleDay(cycleData.id, {
        flow: editFlow,
        symptoms: editSymptoms,
        notes: editNotes
      });
      toast.success("Entry updated successfully");
    } else {
      addCycleDay({
        date: selectedDate,
        flow: editFlow,
        symptoms: editSymptoms,
        notes: editNotes,
        userId: "guest" // Replace with actual user ID
      });
      toast.success("New entry added");
    }
    
    setIsEditMode(false);
  };
  
  // Handle delete
  const handleDelete = () => {
    if (!selectedDate) return;
    
    const cycleData = getCycleDataForDate(selectedDate);
    
    if (cycleData) {
      deleteCycleDay(cycleData.id);
      toast.success("Entry deleted");
      setIsDialogOpen(false);
    }
  };
  
  // Toggle symptom selection
  const toggleSymptom = (symptom: Symptom) => {
    if (editSymptoms.includes(symptom)) {
      setEditSymptoms(editSymptoms.filter(s => s !== symptom));
    } else {
      setEditSymptoms([...editSymptoms, symptom]);
    }
  };
  
  // Get flow level color
  const getFlowLevelColor = (level: FlowLevel) => {
    switch (level) {
      case FlowLevel.SPOTTING:
        return 'bg-pink-200';
      case FlowLevel.LIGHT:
        return 'bg-pink-300';
      case FlowLevel.MEDIUM:
        return 'bg-pink-400';
      case FlowLevel.HEAVY:
        return 'bg-pink-500';
      case FlowLevel.VERY_HEAVY:
        return 'bg-pink-600';
      default:
        return '';
    }
  };
  
  // Get phase color
  const getPhaseColor = (phase?: CyclePhase) => {
    if (!phase) return '';
    
    switch (phase) {
      case CyclePhase.MENSTRUAL:
        return 'text-phase-menstrual';
      case CyclePhase.FOLLICULAR:
        return 'text-phase-follicular';
      case CyclePhase.OVULATION:
        return 'text-phase-ovulation';
      case CyclePhase.LUTEAL:
        return 'text-phase-luteal';
      default:
        return '';
    }
  };
  
  // Format symptom name
  const formatSymptomName = (symptom: Symptom) => {
    return symptom.replace('_', ' ');
  };
  
  // Next period info
  const nextPeriodStart = predictions?.nextPeriodStart ? new Date(predictions.nextPeriodStart) : undefined;
  const daysUntilNextPeriod = nextPeriodStart ? differenceInDays(nextPeriodStart, new Date()) : undefined;
  
  // Current cycle day
  const firstPeriodDay = cycleDays
    .filter(day => day.flow)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  
  const currentCycleDay = firstPeriodDay 
    ? differenceInDays(new Date(), new Date(firstPeriodDay.date)) + 1 
    : undefined;
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">Cycle Calendar</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="mb-6 lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {format(currentMonth, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Track your cycle and symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Calendar header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-medium text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array(monthStart.getDay()).fill(null).map((_, index) => (
                  <div key={`empty-start-${index}`} className="h-24 p-1 bg-gray-50 rounded-md"></div>
                ))}
                
                {monthDays.map((day) => {
                  const cycleData = getCycleDataForDate(day);
                  const isToday = isSameDay(day, new Date());
                  const phase = getPhaseForDate(day);
                  const phaseColor = getPhaseColor(phase);
                  
                  return (
                    <div 
                      key={day.toString()} 
                      className={`h-24 p-2 rounded-md border relative cursor-pointer transition-colors hover:bg-gray-50 ${
                        isToday ? 'border-cycle-primary' : 'border-gray-200'
                      } ${!cycleData?.flow && phase ? `${phaseColor.replace('text-', 'bg-')}/10` : ''}`}
                      onClick={() => handleDayClick(day)}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium ${isToday ? 'text-cycle-primary' : ''}`}>
                          {format(day, 'd')}
                        </span>
                        
                        {(cycleData || phase) && (
                          <div className="flex items-center space-x-1">
                            {cycleData?.flow && (
                              <div className={`w-3 h-3 rounded-full ${getFlowLevelColor(cycleData.flow)}`}></div>
                            )}
                            
                            {phase && !cycleData?.flow && (
                              <div className={`text-xs font-medium ${phaseColor}`}>{phase.charAt(0).toUpperCase()}</div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-1 flex flex-col gap-1">
                        {cycleData?.symptoms && cycleData.symptoms.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cycleData.symptoms.slice(0, 2).map((symptom) => (
                              <Badge key={symptom} variant="outline" className="text-xs px-1 py-0">
                                {formatSymptomName(symptom)}
                              </Badge>
                            ))}
                            {cycleData.symptoms.length > 2 && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                +{cycleData.symptoms.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {cycleData?.notes && (
                          <div className="mt-1 text-xs text-gray-500 truncate">
                            {cycleData.notes.length > 20 ? cycleData.notes.substring(0, 20) + '...' : cycleData.notes}
                          </div>
                        )}
                        
                        {/* Special days indicators */}
                        {predictions?.nextPeriodStart && isSameDay(day, new Date(predictions.nextPeriodStart)) && (
                          <div className="absolute bottom-1 left-1 right-1">
                            <Badge className="w-full justify-center bg-phase-menstrual hover:bg-phase-menstrual text-white">
                              Next Period
                            </Badge>
                          </div>
                        )}
                        
                        {predictions?.nextOvulationDate && isSameDay(day, new Date(predictions.nextOvulationDate)) && (
                          <div className="absolute bottom-1 left-1 right-1">
                            <Badge className="w-full justify-center bg-phase-ovulation hover:bg-phase-ovulation text-white">
                              Ovulation
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {Array(6 - monthEnd.getDay()).fill(null).map((_, index) => (
                  <div key={`empty-end-${index}`} className="h-24 p-1 bg-gray-50 rounded-md"></div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="mt-6 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-phase-menstrual mr-1"></div>
                  <span>Period</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-phase-follicular mr-1"></div>
                  <span>Follicular</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-phase-ovulation mr-1"></div>
                  <span>Ovulation</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-phase-luteal mr-1"></div>
                  <span>Luteal</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cycle Overview</CardTitle>
              <CardDescription>
                Summary of your current cycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="text-cycle-primary" />
                  <span className="font-medium">
                    Current Cycle: {currentCycleDay 
                      ? `Day ${currentCycleDay}` 
                      : "Not started"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DropletIcon className="text-pink-500" />
                  <span className="font-medium">
                    {nextPeriodStart 
                      ? `Next Period: ${format(nextPeriodStart, 'MMM d')} (in ${daysUntilNextPeriod} days)` 
                      : "Next Period: Not predicted"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <SmileIcon className="text-yellow-500" />
                  <span className="font-medium">
                    {predictions?.nextFertileWindowStart 
                      ? `Fertile Window: ${format(new Date(predictions.nextFertileWindowStart), 'MMM d')} - ${format(new Date(predictions.nextFertileWindowEnd), 'MMM d')}` 
                      : "Fertile Window: Not predicted"}
                  </span>
                </div>
                
                {/* Calendar with highlighted days */}
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">Upcoming Events</h3>
                  <CalendarComponent 
                    mode="single"
                    selected={undefined}
                    onSelect={(date) => date && handleDayClick(date)}
                    className="rounded-md border"
                    modifiers={{
                      period: nextPeriodStart ? [nextPeriodStart] : [],
                      ovulation: predictions?.nextOvulationDate ? [new Date(predictions.nextOvulationDate)] : [],
                      today: [new Date()]
                    }}
                    modifiersClassNames={{
                      period: "bg-phase-menstrual text-white",
                      ovulation: "bg-phase-ovulation text-white",
                      today: "border border-cycle-primary"
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Day Detail Dialog */}
        {selectedDate && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
                  <div className="flex space-x-2">
                    {!isEditMode && getCycleDataForDate(selectedDate) && (
                      <>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleEdit}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete entry?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this day's data. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {!isEditMode ? (
                  (() => {
                    const cycleData = getCycleDataForDate(selectedDate);
                    const phase = getPhaseForDate(selectedDate);
                    
                    return (
                      <div className="space-y-4">
                        {/* Phase info */}
                        {phase && (
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${getPhaseColor(phase).replace('text-', 'bg-')}`} />
                            <div>
                              <h3 className="font-medium">Phase</h3>
                              <p className="capitalize">{phase}</p>
                            </div>
                          </div>
                        )}
                        
                        {!cycleData && !phase && (
                          <div className="text-center py-4">
                            <p className="text-gray-500">No data recorded for this day.</p>
                            <Button 
                              variant="outline" 
                              className="mt-2"
                              onClick={handleEdit}
                            >
                              Add Entry
                            </Button>
                          </div>
                        )}
                        
                        {cycleData?.flow && (
                          <div className="flex items-center gap-2">
                            <DropletIcon className="text-pink-500" />
                            <div>
                              <h3 className="font-medium">Flow</h3>
                              <p className="capitalize">{cycleData.flow.replace('_', ' ')}</p>
                            </div>
                          </div>
                        )}
                        
                        {cycleData?.mood && (
                          <div className="flex items-center gap-2">
                            <SmileIcon className="text-yellow-500" />
                            <div>
                              <h3 className="font-medium">Mood</h3>
                              <p className="capitalize">{cycleData.mood}</p>
                            </div>
                          </div>
                        )}
                        
                        {cycleData?.symptoms && cycleData.symptoms.length > 0 && (
                          <div>
                            <h3 className="font-medium mb-2">Symptoms</h3>
                            <div className="flex flex-wrap gap-2">
                              {cycleData.symptoms.map((symptom) => (
                                <Badge key={symptom} variant="outline">
                                  {formatSymptomName(symptom)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {cycleData?.baselTemperature && (
                          <div className="flex items-center gap-2">
                            <ThermometerIcon className="text-red-500" />
                            <div>
                              <h3 className="font-medium">Basal Temperature</h3>
                              <p>{cycleData.baselTemperature}°C</p>
                            </div>
                          </div>
                        )}
                        
                        {cycleData?.notes && (
                          <div>
                            <h3 className="font-medium mb-2">Notes</h3>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                              {cycleData.notes}
                            </p>
                          </div>
                        )}
                        
                        {/* Show edit button if there's data */}
                        {cycleData && (
                          <div className="flex justify-end">
                            <Button onClick={handleEdit} variant="outline" className="flex items-center gap-1">
                              <Pencil className="h-4 w-4" />
                              Edit Entry
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Period Flow</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.values(FlowLevel).map(level => (
                          <Button 
                            key={level}
                            variant="outline"
                            size="sm"
                            className={`text-xs py-1 px-2 h-auto ${editFlow === level ? 'bg-phase-menstrual text-white border-phase-menstrual' : ''}`}
                            onClick={() => setEditFlow(editFlow === level ? undefined : level)}
                          >
                            {level.replace('_', ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Symptoms</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.values(Symptom).map(symptom => (
                          <Button
                            key={symptom}
                            variant="outline"
                            size="sm"
                            className={`text-xs py-1 px-2 h-auto justify-start ${editSymptoms.includes(symptom) ? 'bg-symptom-mood text-white border-symptom-mood' : ''}`}
                            onClick={() => toggleSymptom(symptom)}
                          >
                            {formatSymptomName(symptom)}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Notes</h3>
                      <textarea
                        className="w-full border rounded-md p-2 h-24 text-sm"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Add any notes about your day..."
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                {isEditMode && (
                  <>
                    <Button variant="outline" onClick={() => setIsEditMode(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default Calendar;
