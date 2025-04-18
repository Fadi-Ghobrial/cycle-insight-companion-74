
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Lightbulb, Heart, CalendarCheck } from "lucide-react";

export const CrossModeDesign = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Cross-Mode Design</CardTitle>
        <CardDescription>
          How our app adapts to your changing needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="text-cycle-primary" size={18} />
              <h3 className="font-medium">Single Data Model, Multiple Views</h3>
            </div>
            <p className="text-sm text-gray-600">Every log lives in one table with a life stage tag; the UI decides what to surface.</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="text-cycle-primary" size={18} />
              <h3 className="font-medium">Smart-Switch Prompts</h3>
            </div>
            <p className="text-sm text-gray-600">We detect triggers (like no period for 60 days) and invite you to switch modes.</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="text-cycle-primary" size={18} />
              <h3 className="font-medium">Always-On Privacy</h3>
            </div>
            <p className="text-sm text-gray-600">Sensitive fields inherit the highest encryption level to protect your data.</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CalendarCheck className="text-cycle-primary" size={18} />
              <h3 className="font-medium">Historical Continuity</h3>
            </div>
            <p className="text-sm text-gray-600">Timeline badges show when a mode changed so past data still makes sense.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
