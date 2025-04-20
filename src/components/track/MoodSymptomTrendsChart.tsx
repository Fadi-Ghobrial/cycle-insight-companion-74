
import React from 'react';
import { useAppStore } from '@/lib/store';
import { CycleDay, Mood, Symptom } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ResponsiveContainer,
  HeatMap,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
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

type HeatmapDatum = {
  date: string;
  [key: string]: number | string;
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

  // Collate mood frequency for each day
  const heatmapData: HeatmapDatum[] = recentDates.map(dateLabel => {
    const [month, day] = dateLabel.split('/').map(Number);
    const foundDay = cycleDays.find(
      d =>
        new Date(d.date).getMonth() + 1 === month &&
        new Date(d.date).getDate() === day
    );
    const datum: HeatmapDatum = { date: dateLabel };
    for (const mood of Object.values(Mood)) {
      datum[mood] = foundDay?.moods.includes(mood) ? 1 : 0;
    }
    return datum;
  });

  // Collate symptoms frequency for each day, top 5 most-used symptoms
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

  const symptomHeatmapData: HeatmapDatum[] = recentDates.map(dateLabel => {
    const [month, day] = dateLabel.split('/').map(Number);
    const foundDay = cycleDays.find(
      d =>
        new Date(d.date).getMonth() + 1 === month &&
        new Date(d.date).getDate() === day
    );
    const datum: HeatmapDatum = { date: dateLabel };
    mostCommonSymptoms.forEach(symptom => {
      datum[symptom] = foundDay?.symptoms.includes(symptom) ? 1 : 0;
    });
    return datum;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Mood Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <HeatMap
              data={heatmapData}
              xKey="date"
              yKey="mood"
              colorRange={['#F1F5F9', '#8B5CF6']}
            >
              {Object.values(Mood).map(mood => (
                <XAxis
                  dataKey="date"
                  key={mood}
                  hide
                />
              ))}
              <YAxis
                type="category"
                dataKey="mood"
                categories={Object.values(Mood)}
                tickFormatter={mood => mood.charAt(0).toUpperCase() + mood.slice(1)}
              />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Legend />
              {/* Render individual cells */}
              {heatmapData.map((day, idx) =>
                Object.values(Mood).map((mood, jdx) => (
                  <Cell
                    key={`${idx}-${jdx}`}
                    fill={day[mood] === 1 ? MOOD_COLORS[mood] : '#F1F5F9'}
                  />
                ))
              )}
            </HeatMap>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardHeader>
        <CardTitle>Symptoms Trends (Top 5)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <HeatMap
              data={symptomHeatmapData}
              xKey="date"
              yKey="symptom"
              colorRange={['#E0E7FF', '#EA580C']}
            >
              <YAxis
                type="category"
                dataKey="symptom"
                categories={mostCommonSymptoms}
                tickFormatter={symptom => symptom.charAt(0).toUpperCase() + symptom.slice(1).replace('_', ' ')}
              />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Legend />
              {symptomHeatmapData.map((day, idx) =>
                mostCommonSymptoms.map((symptom, jdx) => (
                  <Cell
                    key={`${idx}-${jdx}`}
                    fill={day[symptom] === 1 ? '#EA580C' : '#E0E7FF'}
                  />
                ))
              )}
            </HeatMap>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodSymptomTrendsChart;
