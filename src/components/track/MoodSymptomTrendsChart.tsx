
import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { CycleDay, Mood, Symptom } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Rectangle,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts';

const MOOD_COLORS: Record<Mood, string> = {
  happy: '#34D399',        // green
  sensitive: '#FBBF24',    // yellow
  sad: '#818CF8',          // blue
  energetic: '#F59E42',    // orange
  tired: '#D1D5DB',        // gray
  anxious: '#A78BFA',      // purple
  irritable: '#F87171',    // red
  calm: '#60A5FA',         // light blue
};

const SYMPTOM_COLOR = '#EA580C'; // Orange for symptoms

type ChartDatum = {
  date: string;
  value: Mood | Symptom;
  present: boolean;
};

const RECENT_DAYS = 14;

function getRecentDates() {
  const days: string[] = [];
  for (let i = RECENT_DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(`${d.getMonth()+1}/${d.getDate()}`);
  }
  return days;
}

const MoodSymptomTrendsChart: React.FC = () => {
  const { cycleDays } = useAppStore();
  const recentDates = getRecentDates();
  
  // Generate mood chart data
  const moodData: ChartDatum[] = [];
  recentDates.forEach(dateLabel => {
    const [month, day] = dateLabel.split('/').map(Number);
    const foundDay = cycleDays.find(
      d =>
        new Date(d.date).getMonth() + 1 === month &&
        new Date(d.date).getDate() === day
    );
    
    Object.values(Mood).forEach(mood => {
      moodData.push({
        date: dateLabel,
        value: mood,
        present: foundDay?.moods.includes(mood) || false
      });
    });
  });

  // Identify top 5 most common symptoms
  const symptomCounts: Record<Symptom, number> = {} as any;
  cycleDays.forEach(d => {
    d.symptoms.forEach(s => {
      symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    });
  });
  const mostCommonSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(x => x[0] as Symptom);

  // Generate symptom chart data
  const symptomData: ChartDatum[] = [];
  recentDates.forEach(dateLabel => {
    const [month, day] = dateLabel.split('/').map(Number);
    const foundDay = cycleDays.find(
      d =>
        new Date(d.date).getMonth() + 1 === month &&
        new Date(d.date).getDate() === day
    );
    
    mostCommonSymptoms.forEach(symptom => {
      symptomData.push({
        date: dateLabel,
        value: symptom,
        present: foundDay?.symptoms.includes(symptom) || false
      });
    });
  });

  // Custom scatter shape that shows a rectangle (like a heatmap cell)
  const renderCustomShape = (props: any) => {
    const { cx, cy, dataKey, height, width, payload } = props;
    const fill = payload.present ? 
      (typeof payload.value === 'string' && payload.value in MOOD_COLORS ? 
        MOOD_COLORS[payload.value as Mood] : 
        SYMPTOM_COLOR) : 
      '#F1F5F9';
      
    return (
      <Rectangle
        x={cx - width / 2}
        y={cy - height / 2}
        width={width}
        height={height}
        fill={fill}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Mood Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                type="category" 
                name="Date" 
                allowDuplicatedCategory={false} 
              />
              <YAxis 
                dataKey="value" 
                type="category" 
                name="Mood"
                tickFormatter={(value) => typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value}
              />
              <Tooltip 
                formatter={(value, name, props) => [
                  props.payload.present ? 'Yes' : 'No', 
                  name === 'value' ? 'Present' : name
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Scatter 
                name="Mood" 
                data={moodData} 
                shape={renderCustomShape}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardHeader>
        <CardTitle>Symptoms Trends (Top 5)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                type="category" 
                name="Date" 
                allowDuplicatedCategory={false} 
              />
              <YAxis 
                dataKey="value" 
                type="category" 
                name="Symptom" 
                tickFormatter={(value) => {
                  if (typeof value === 'string') {
                    return value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ');
                  }
                  return value;
                }}
              />
              <Tooltip 
                formatter={(value, name, props) => [
                  props.payload.present ? 'Yes' : 'No', 
                  name === 'value' ? 'Present' : name
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Scatter 
                name="Symptom" 
                data={symptomData} 
                shape={renderCustomShape}
                fill={SYMPTOM_COLOR}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodSymptomTrendsChart;
