
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

export const QuickActions = () => {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/calendar">
          <Card className="h-24 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col justify-center items-center h-full">
              <span className="text-sm md:text-base font-medium text-center">Calendar</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/track">
          <Card className="h-24 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col justify-center items-center h-full">
              <span className="text-sm md:text-base font-medium text-center">Log Today</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/insights">
          <Card className="h-24 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col justify-center items-center h-full">
              <span className="text-sm md:text-base font-medium text-center">Insights</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/learn">
          <Card className="h-24 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col justify-center items-center h-full">
              <span className="text-sm md:text-base font-medium text-center">Learn</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
};
