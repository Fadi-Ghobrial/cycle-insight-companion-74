
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import { FlowLevel, Mood, Symptom } from '@/types';
import { DropletIcon, ChevronLeft, ChevronRight, CalendarIcon, SmileIcon, ThermometerIcon } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { cycleDays } = useAppStore();
  
  // Get days in current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Navigation functions
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Get cycle data for a specific date
  const getCycleDataForDate = (date: Date) => {
    return cycleDays.find(day => 
      isSameDay(new Date(day.date), date)
    );
  };
  
  // Handle day click
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsDialogOpen(true);
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
      default:
        return '';
    }
  };
  
  // Get mood emoji
  const getMoodEmoji = (mood: Mood) => {
    switch (mood) {
      case Mood.HAPPY:
        return '😊';
      case Mood.SENSITIVE:
        return '😢';
      case Mood.IRRITABLE:
        return '😠';
      case Mood.ANXIOUS:
        return '😰';
      case Mood.CALM:
        return '😌';
      default:
        return '';
    }
  };
  
  // Format symptom name
  const formatSymptomName = (symptom: Symptom) => {
    return symptom.replace('_', ' ');
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">Cycle Calendar</h1>
        
        <Card className="mb-6">
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
                <div key={`empty-start-${index}`} className="h-20 p-1 bg-gray-50 rounded-md"></div>
              ))}
              
              {monthDays.map((day) => {
                const cycleData = getCycleDataForDate(day);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div 
                    key={day.toString()} 
                    className={`h-20 p-1 rounded-md border cursor-pointer transition-colors hover:bg-gray-50 ${
                      isToday ? 'border-cycle-primary' : 'border-gray-200'
                    }`}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium ${isToday ? 'text-cycle-primary' : ''}`}>
                        {format(day, 'd')}
                      </span>
                      
                      {cycleData?.flow && (
                        <div className={`w-3 h-3 rounded-full ${getFlowLevelColor(cycleData.flow)}`}></div>
                      )}
                    </div>
                    
                    <div className="mt-1 flex flex-col gap-1">
                      {cycleData?.mood && (
                        <div className="text-sm">{getMoodEmoji(cycleData.mood)}</div>
                      )}
                      
                      {cycleData?.symptoms && cycleData.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1">
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
                    </div>
                  </div>
                );
              })}
              
              {Array(6 - monthEnd.getDay()).fill(null).map((_, index) => (
                <div key={`empty-end-${index}`} className="h-20 p-1 bg-gray-50 rounded-md"></div>
              ))}
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
                <span className="font-medium">Current Cycle: Day 14</span>
              </div>
              
              <div className="flex items-center gap-2">
                <DropletIcon className="text-pink-500" />
                <span className="font-medium">Next Period: In 14 days</span>
              </div>
              
              <div className="flex items-center gap-2">
                <SmileIcon className="text-yellow-500" />
                <span className="font-medium">Fertile Window: In 2 days</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Day Detail Dialog */}
        {selectedDate && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {format(selectedDate, 'MMMM d, yyyy')}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {(() => {
                  const cycleData = getCycleDataForDate(selectedDate);
                  
                  if (!cycleData) {
                    return (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No data recorded for this day.</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-4">
                      {cycleData.flow && (
                        <div className="flex items-center gap-2">
                          <DropletIcon className="text-pink-500" />
                          <div>
                            <h3 className="font-medium">Flow</h3>
                            <p className="capitalize">{cycleData.flow.replace('_', ' ')}</p>
                          </div>
                        </div>
                      )}
                      
                      {cycleData.mood && (
                        <div className="flex items-center gap-2">
                          <SmileIcon className="text-yellow-500" />
                          <div>
                            <h3 className="font-medium">Mood</h3>
                            <p className="capitalize">{cycleData.mood}</p>
                          </div>
                        </div>
                      )}
                      
                      {cycleData.symptoms && cycleData.symptoms.length > 0 && (
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
                      
                      {cycleData.baselTemperature && (
                        <div className="flex items-center gap-2">
                          <ThermometerIcon className="text-red-500" />
                          <div>
                            <h3 className="font-medium">Basal Temperature</h3>
                            <p>{cycleData.baselTemperature}°C</p>
                          </div>
                        </div>
                      )}
                      
                      {cycleData.notes && (
                        <div>
                          <h3 className="font-medium mb-2">Notes</h3>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                            {cycleData.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};

export default Calendar;
