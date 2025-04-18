import React, { useState } from 'react';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { addDays, format, isSameDay, isBefore, isAfter } from 'date-fns';
import { useAppStore } from '@/lib/store';
import { CycleDay, FlowLevel } from '@/types';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area"

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { addCycleDay, cycleDays, user } = useAppStore();

  const handleAddDay = (date: Date) => {
    addCycleDay({
      date,
      flow: FlowLevel.MEDIUM,
      symptoms: [],
      moods: [],
      notes: "",
      userId: user?.id || 'guest'
    });
  };

  const renderDayContent = (date: Date) => {
    const day: CycleDay | undefined = cycleDays.find(day => isSameDay(new Date(day.date), date));

    if (day) {
      const dayFlow = day.flow;
      const daySymptoms = day.symptoms;
      const dayMoods = day.moods || [];

      return (
        <div className="flex flex-col items-center justify-center h-full">
          {dayFlow && (
            <Badge variant="secondary" className="mb-1">{dayFlow}</Badge>
          )}
          {daySymptoms && daySymptoms.length > 0 && (
            <Badge variant="outline" className="text-purple-600">Symptoms</Badge>
          )}
           {dayMoods && dayMoods.length > 0 && (
            <Badge variant="outline" className="text-blue-600">Moods</Badge>
          )}
        </div>
      );
    }

    return null;
  };

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
                renderDay={renderDayContent}
              />
              <div className="flex justify-center">
                <Button onClick={() => handleAddDay(selectedDate)}>Add Data for Selected Date</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selected Date</CardTitle>
              <CardDescription>Information for {selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}</CardDescription>
            </CardHeader>
            <CardContent>
              {cycleDays.length === 0 ? (
                <p>No data available. Please add a cycle day.</p>
              ) : (
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  {cycleDays.map((day) => (
                    isSameDay(new Date(day.date), selectedDate) && (
                      <div key={day.id} className="mb-4">
                        <h3 className="text-lg font-semibold">
                          {format(new Date(day.date), 'PPP')}
                        </h3>
                        <p>Flow: {day.flow || 'None'}</p>
                        <p>Symptoms: {day.symptoms.join(', ') || 'None'}</p>
                        <p>Moods: {day.moods.join(', ') || 'None'}</p>
                        <p>Notes: {day.notes || 'None'}</p>
                      </div>
                    )
                  ))}
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
