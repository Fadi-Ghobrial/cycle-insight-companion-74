
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, DropletIcon, SmileIcon, ThermometerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import { CyclePhase, FlowLevel } from '@/types';
import Layout from '@/components/layout/Layout';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  const { cycleDays, cycles, currentCycleId, recalculatePredictions } = useAppStore();
  
  // Get current cycle with predictions
  const currentCycle = cycles.find(c => c.id === currentCycleId);
  
  // Get days of the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });
  
  // Previous and next month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  // Find if a day has data from cycle days or predictions
  const getDayData = (date: Date) => {
    // Check if this day has tracking data
    const cycleDayData = cycleDays.find(day => 
      isSameDay(new Date(day.date), date)
    );
    
    // If we have tracking data, return it
    if (cycleDayData) {
      return {
        hasData: true,
        flowLevel: cycleDayData.flow,
        symptoms: cycleDayData.symptoms,
        mood: cycleDayData.mood,
        temperature: cycleDayData.baselTemperature,
        isActual: true,
      };
    }
    
    // If no tracking data but we have cycle predictions
    if (currentCycle?.predictions) {
      // Find which phase this date belongs to
      const phase = currentCycle.predictions.phases.find(phase => 
        date >= new Date(phase.startDate) && date <= new Date(phase.endDate)
      );
      
      if (phase) {
        return {
          hasData: true,
          phase: phase.phase,
          isActual: false,
          isPeriod: phase.phase === CyclePhase.MENSTRUAL,
          isFertile: phase.phase === CyclePhase.OVULATION,
        };
      }
    }
    
    return { hasData: false };
  };
  
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };
  
  const getPhaseColor = (phase: CyclePhase) => {
    switch (phase) {
      case CyclePhase.MENSTRUAL:
        return "bg-red-100 text-red-800";
      case CyclePhase.FOLLICULAR:
        return "bg-blue-100 text-blue-800";
      case CyclePhase.OVULATION:
        return "bg-green-100 text-green-800";
      case CyclePhase.LUTEAL:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cycle-primary">Cycle Calendar</h1>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => recalculatePredictions()}
              variant="outline"
              className="text-cycle-primary"
            >
              Re-evaluate
            </Button>
            <Button 
              onClick={() => navigate('/track')}
              className="bg-cycle-primary hover:bg-cycle-secondary"
            >
              Track Today
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Days of week header */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty slots before first day of month */}
              {Array.from({ length: daysInMonth[0].getDay() }).map((_, index) => (
                <div key={`empty-start-${index}`} className="aspect-square"></div>
              ))}
              
              {/* Days of the month */}
              {daysInMonth.map((day) => {
                const dayData = getDayData(day);
                const isCurrentDay = isToday(day);
                
                return (
                  <button
                    key={day.toISOString()}
                    className={`aspect-square p-1 relative rounded-md border ${
                      isCurrentDay ? 'border-cycle-primary' : 'border-transparent'
                    } hover:bg-gray-50 hover:border-gray-200`}
                    onClick={() => handleDayClick(day)}
                  >
                    <span className={`text-sm ${isCurrentDay ? 'font-bold text-cycle-primary' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    
                    {dayData.hasData && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {dayData.isActual && dayData.flowLevel && (
                          <div 
                            className={`absolute inset-0 rounded-md opacity-30 ${
                              dayData.flowLevel === FlowLevel.SPOTTING ? 'bg-pink-100' :
                              dayData.flowLevel === FlowLevel.LIGHT ? 'bg-pink-200' :
                              dayData.flowLevel === FlowLevel.MEDIUM ? 'bg-pink-300' :
                              dayData.flowLevel === FlowLevel.HEAVY ? 'bg-pink-400' :
                              'bg-pink-500' // VERY_HEAVY
                            }`}
                          ></div>
                        )}
                        
                        {!dayData.isActual && dayData.phase && (
                          <div 
                            className={`absolute inset-0 rounded-md opacity-30 ${
                              dayData.isPeriod ? 'bg-pink-200' :
                              dayData.isFertile ? 'bg-green-200' :
                              'bg-purple-100'
                            }`}
                          ></div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Legend for calendar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cycle Phases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-pink-200 text-pink-800 hover:bg-pink-300">Period</Badge>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Follicular Phase</Badge>
                <Badge className="bg-green-200 text-green-800 hover:bg-green-300">Ovulation</Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Luteal Phase</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Flow Intensity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">Spotting</Badge>
                <Badge className="bg-pink-200 text-pink-800 hover:bg-pink-300">Light</Badge>
                <Badge className="bg-pink-300 text-pink-800 hover:bg-pink-400">Medium</Badge>
                <Badge className="bg-pink-400 text-pink-800 hover:bg-pink-500">Heavy</Badge>
                <Badge className="bg-pink-500 text-pink-800 hover:bg-pink-600">Very Heavy</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Day detail dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            {selectedDate && (
              <>
                <DialogHeader>
                  <DialogTitle>{format(selectedDate, 'MMMM dd, yyyy')}</DialogTitle>
                  <DialogDescription>
                    {isToday(selectedDate) ? "Today's tracking data" : "Tracking data"}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {(() => {
                    const dayData = getDayData(selectedDate);
                    
                    if (!dayData.hasData) {
                      return (
                        <div className="text-center py-4">
                          <p className="text-gray-500">No data for this day</p>
                          <Button
                            onClick={() => {
                              setIsDialogOpen(false);
                              navigate('/track', { state: { date: selectedDate } });
                            }}
                            className="mt-2 bg-cycle-primary hover:bg-cycle-secondary"
                          >
                            Add tracking data
                          </Button>
                        </div>
                      );
                    }
                    
                    if (dayData.isActual) {
                      return (
                        <>
                          {dayData.flowLevel && (
                            <div className="flex items-center gap-2">
                              <DropletIcon className="text-pink-500" size={18} />
                              <span className="font-medium">Flow:</span>
                              <span className="capitalize">{dayData.flowLevel.replace('_', ' ')}</span>
                            </div>
                          )}
                          
                          {dayData.mood && (
                            <div className="flex items-center gap-2">
                              <SmileIcon className="text-yellow-500" size={18} />
                              <span className="font-medium">Mood:</span>
                              <span className="capitalize">{dayData.mood}</span>
                            </div>
                          )}
                          
                          {dayData.temperature && (
                            <div className="flex items-center gap-2">
                              <ThermometerIcon className="text-red-500" size={18} />
                              <span className="font-medium">BBT:</span>
                              <span>{dayData.temperature}°C</span>
                            </div>
                          )}
                          
                          {dayData.symptoms && dayData.symptoms.length > 0 && (
                            <div>
                              <span className="font-medium">Symptoms:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {dayData.symptoms.map(symptom => (
                                  <Badge key={symptom} variant="outline" className="capitalize">
                                    {symptom.replace('_', ' ')}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsDialogOpen(false);
                                navigate('/track', { state: { date: selectedDate, edit: true } });
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        </>
                      );
                    } else if (dayData.phase) {
                      return (
                        <div className="space-y-2">
                          <Badge className={getPhaseColor(dayData.phase)}>
                            {dayData.phase.charAt(0).toUpperCase() + dayData.phase.slice(1)} Phase
                          </Badge>
                          
                          <p className="text-sm text-gray-600">
                            {dayData.isPeriod
                              ? "Predicted period day. You can track your actual flow when it starts."
                              : dayData.isFertile
                              ? "Predicted fertile window. Higher chance of conception."
                              : "Predicted non-fertile phase."}
                          </p>
                          
                          <div className="text-xs text-gray-500 mt-2">
                            This is a prediction based on your cycle history.
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              onClick={() => {
                                setIsDialogOpen(false);
                                navigate('/track', { state: { date: selectedDate } });
                              }}
                              className="bg-cycle-primary hover:bg-cycle-secondary"
                            >
                              Add actual data
                            </Button>
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Calendar;
