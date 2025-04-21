
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', cycleDays: 28 },
  { month: 'Feb', cycleDays: 32 },
  { month: 'Mar', cycleDays: 25 },
  { month: 'Apr', cycleDays: 35 },
  { month: 'May', cycleDays: 29 },
];

export const CycleVariabilityGraph = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Cycle Variability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cycleDays"
                stroke="#8884d8"
                name="Cycle Length"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
