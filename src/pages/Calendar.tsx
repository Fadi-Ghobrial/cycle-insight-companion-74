
import React, { useState } from 'react';
import { format } from 'date-fns';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { FlowLevel, LifeStage } from '@/types';
import { ScrollArea } from "@/components/ui/scroll-area";
import Calendar from '@/components/calendar/Calendar';
import PeriodForecastWidget from '@/components/forecast/PeriodForecastWidget';
import PeriodReminderSettings from '@/components/forecast/PeriodReminderSettings';

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { addCycleDay, cycleDays, user, currentLifeStage } = useAppStore();

  // Find cycle day data for the selected date
  const selectedCycleDay = cycleDays.find(day => 
    new Date(day.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <Layout requireAuth={true}>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">Cycle Calendar</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar and details section */}
          <div className="lg:col-span-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Track and view your cycle days</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar onDayClick={(date) => setSelectedDate(date)} />
              </CardContent>
            </Card>
          </div>

          {/* Selected day and forecast section */}
          <div className="lg:col-span-4 space-y-6">
            {/* Selected day card */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Date</CardTitle>
                <CardDescription>
                  Information for {format(selectedDate, 'MMMM dd, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedCycleDay ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-4">No data available for this date.</p>
                    <Button 
                      className="bg-cycle-primary hover:bg-cycle-secondary"
                      onClick={() => {
                        const dayDetailModal = document.createElement('div');
                        dayDetailModal.id = 'day-detail-modal';
                        document.body.appendChild(dayDetailModal);
                        
                        const event = new CustomEvent('open-day-detail', {
                          detail: { date: selectedDate }
                        });
                        document.dispatchEvent(event);
                      }}
                    >
                      Add Data for This Date
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">
                        {format(new Date(selectedCycleDay.date), 'MMMM dd, yyyy')}
                      </h3>
                      <p className="py-1">Flow: {selectedCycleDay.flow || 'None'}</p>
                      <p className="py-1">Symptoms: {selectedCycleDay.symptoms.join(', ') || 'None'}</p>
                      <p className="py-1">Moods: {selectedCycleDay.moods.join(', ') || 'None'}</p>
                      <p className="py-1">Notes: {selectedCycleDay.notes || 'None'}</p>
                    </div>
                    <Button 
                      className="mt-4 bg-cycle-primary hover:bg-cycle-secondary"
                      onClick={() => {
                        const event = new CustomEvent('open-day-detail', {
                          detail: { date: selectedDate }
                        });
                        document.dispatchEvent(event);
                      }}
                    >
                      Edit Data
                    </Button>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Only show forecast for relevant life stages */}
            {currentLifeStage !== LifeStage.PREGNANCY && 
             currentLifeStage !== LifeStage.NO_PERIOD && (
              <>
                {/* Forecast widget */}
                <PeriodForecastWidget />
                
                {/* Reminders settings */}
                <PeriodReminderSettings />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
