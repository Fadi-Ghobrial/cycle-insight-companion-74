
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { date: '2025-04-15', sleep: 7.5, hrv: 65 },
  { date: '2025-04-16', sleep: 6.8, hrv: 58 },
  { date: '2025-04-17', sleep: 8.2, hrv: 72 },
  { date: '2025-04-18', sleep: 7.1, hrv: 63 },
  { date: '2025-04-19', sleep: 6.5, hrv: 55 },
];

export const SleepQualityTracker = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sleep & HRV Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sleep"
                stroke="#8884d8"
                name="Sleep (hours)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="hrv"
                stroke="#82ca9d"
                name="HRV"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
