
import React, { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const SymptomKickCounter = () => {
  const { lifeStageData, addKickCount } = useAppStore();
  const pregnancy = lifeStageData.pregnancy?.pregnancyData;
  const kicks = pregnancy?.kickCounts || [];
  const symptoms = pregnancy?.symptoms || [];

  // We'll just show recent entries for demo
  const kicksToday = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return kicks.filter(k => k.date.toString().slice(0, 10) === todayStr);
  }, [kicks]);

  if (!pregnancy) return null;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Symptom & Kick Counter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <span className="font-medium text-base">Symptoms Today:</span>
          <ul className="list-disc ml-6 mt-1 text-sm">
            {symptoms.length
              ? symptoms.map((s, i) => <li key={i}>{s.replace('_', ' ')}</li>)
              : <li className="text-gray-400">None logged</li>}
          </ul>
        </div>
        <div className="mb-2">
          <span className="font-medium text-base">Kick Counts Today:</span>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-2xl font-bold">{kicksToday.length}</span>
            <Button
              size="sm"
              variant="default"
              onClick={() => addKickCount(pregnancy.id, {
                date: new Date(),
                startTime: new Date(),
                count: 1,
              })}
            >
              + Add Kick
            </Button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Regular movement is a good sign. Contact your provider for any concerns.
        </div>
      </CardContent>
    </Card>
  );
};
