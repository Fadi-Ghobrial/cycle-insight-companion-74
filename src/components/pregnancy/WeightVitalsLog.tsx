
import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const WeightVitalsLog = () => {
  const { lifeStageData, updatePregnancyData } = useAppStore();
  const pregnancy = lifeStageData.pregnancy?.pregnancyData;
  const [weight, setWeight] = useState<number | "">(pregnancy?.weight || "");
  const [bloodPressure, setBloodPressure] = useState<string>(pregnancy?.bloodPressure || "");

  if (!pregnancy) return null;

  const handleSave = () => {
    updatePregnancyData({
      weight: typeof weight === "number" ? weight : undefined,
      bloodPressure: bloodPressure || undefined,
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Weight & Vitals Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <label className="block text-sm">Weight (kg)</label>
          <input
            type="number"
            min={30}
            max={250}
            value={weight}
            onChange={e => setWeight(e.target.value ? Number(e.target.value) : "")}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <label className="block text-sm mt-2">Blood Pressure</label>
          <input
            type="text"
            placeholder="120/80"
            value={bloodPressure}
            onChange={e => setBloodPressure(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
          />
          <Button size="sm" className="mt-2" onClick={handleSave}>
            Save Vitals
          </Button>
        </div>
        {pregnancy.weight && (
          <div className="text-xs text-gray-500 mt-2">Last Weight: {pregnancy.weight} kg</div>
        )}
        {pregnancy.bloodPressure && (
          <div className="text-xs text-gray-500">Last BP: {pregnancy.bloodPressure}</div>
        )}
      </CardContent>
    </Card>
  );
};
