
import React from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const GestationalAgeTracker = () => {
  const { lifeStageData } = useAppStore();
  const pregnancy = lifeStageData.pregnancy?.pregnancyData;

  if (!pregnancy) return null;

  // Calculate weeks and days
  const msPerDay = 1000 * 60 * 60 * 24;
  const gestWeeks = Math.floor(pregnancy.gestationalAge / 7);
  const gestDays = pregnancy.gestationalAge % 7;
  const today = new Date();
  const daysLeft = Math.max(0, Math.round((new Date(pregnancy.dueDate).getTime() - today.getTime()) / msPerDay));
  const weeksLeft = Math.floor(daysLeft / 7);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Gestational Age Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-semibold mb-2">
          Week {gestWeeks} {gestDays > 0 && <span>+ {gestDays} days</span>}
        </div>
        <div className="text-base mb-2">
          {daysLeft > 0 
            ? <>Estimated {weeksLeft} weeks left (Due {new Date(pregnancy.dueDate).toLocaleDateString()})</>
            : <>Due date: {new Date(pregnancy.dueDate).toLocaleDateString()}</>
          }
        </div>
        <img src="/images/pregnancy-week.svg" alt="Fetal Development" className="w-32 mb-2" />
        <div className="text-sm text-gray-600">
          Baby is growing! <br />
          Track fetal development week-by-week.
        </div>
      </CardContent>
    </Card>
  );
};
