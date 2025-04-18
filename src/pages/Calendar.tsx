
import React, { useState } from 'react';
import { format } from 'date-fns';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { useAppStore } from '@/lib/store';
import { FlowLevel } from '@/types';
import { ScrollArea } from "@/components/ui/scroll-area";

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { addCycleDay, cycleDays, user } = useAppStore();

  const handleAddDay = () => {
    addCycleDay({
      date: selectedDate,
      flow: FlowLevel.MEDIUM,
      symptoms: [],
      moods: [], // Added moods array
      notes: "",
      userId: user?.id || 'guest'
    });
  };

  // Find cycle day data for the selected date
  const selectedCycleDay = cycleDays.find(day => 
    new Date(day.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <Layout requireAuth={true}>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-cycle-primary mb-6">Cycle Calendar</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <CalendarUI
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
              <div className="flex justify-center">
                <Button 
                  onClick={handleAddDay}
                  className="bg-cycle-primary hover:bg-cycle-secondary"
                >
                  Add Data for Selected Date
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selected Date</CardTitle>
              <CardDescription>
                Information for {format(selectedDate, 'MMMM dd, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedCycleDay ? (
                <p className="text-center py-12 text-gray-500">No data available. Please add a cycle day.</p>
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
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
