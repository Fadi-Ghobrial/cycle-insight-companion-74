
import React from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const DueDateWidgets = () => {
  const { lifeStageData } = useAppStore();
  const pregnancy = lifeStageData.pregnancy?.pregnancyData;
  
  if (!pregnancy) return null;

  const msLeft = new Date(pregnancy.dueDate).getTime() - new Date().getTime();
  const daysLeft = Math.max(0, Math.round(msLeft / (1000 * 60 * 60 * 24)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-1">
            <Clock size={18} /> Due Date Countdown
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-2">
          <span className="text-3xl font-bold">{daysLeft}</span>
          <span className="text-sm text-gray-600">days remaining</span>
        </div>
        <div className="text-xs">Estimated due date: <strong>{new Date(pregnancy.dueDate).toLocaleDateString()}</strong></div>
        <div className="text-xs mt-2 text-gray-500">Share countdown with your partner and family!</div>
      </CardContent>
    </Card>
  );
};
