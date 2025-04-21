
import React from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChecklistItem } from "@/types";

export const PregnancyChecklistHub = () => {
  const { lifeStageData, updatePregnancyData } = useAppStore();
  const pregnancy = lifeStageData.pregnancy?.pregnancyData;
  const checklist: ChecklistItem[] = pregnancy?.checklistItems || [];

  if (!pregnancy) return null;

  const handleToggleComplete = (itemId: string) => {
    const updated = checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updatePregnancyData({ checklistItems: updated });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Pregnancy Checklist Hub</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {checklist.length
            ? checklist.map(item => (
                <li key={item.id} className="flex items-center justify-between">
                  <span className={`text-sm ${item.completed ? "line-through text-gray-400" : ""}`}>
                    {item.title}
                    {item.dueDate && (
                      <span className="ml-2 text-xs text-gray-500">
                        (Due {new Date(item.dueDate).toLocaleDateString()})
                      </span>
                    )}
                  </span>
                  <Button
                    size="sm"
                    variant={item.completed ? "secondary" : "outline"}
                    onClick={() => handleToggleComplete(item.id)}
                  >
                    {item.completed ? "Undo" : "Mark Done"}
                  </Button>
                </li>
              ))
            : <li className="text-gray-400">No checklist items</li>}
        </ul>
      </CardContent>
    </Card>
  );
};
