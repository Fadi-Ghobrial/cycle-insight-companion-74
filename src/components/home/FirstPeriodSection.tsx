
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const FirstPeriodSection = () => {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Getting Started</h2>
        <Link to="/milestones">
          <Button variant="link" className="text-cycle-primary p-0">
            View More
          </Button>
        </Link>
      </div>
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-100">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">Welcome to your period journey</h3>
          <p className="text-gray-600 mb-4">
            We've customized your experience to help you understand your first periods.
            Track your symptoms, learn what's normal, and get comfortable with your cycle.
          </p>
        </CardContent>
        <CardFooter className="px-6 py-3 bg-white/50 flex justify-between">
          <Link to="/learn">
            <Button variant="outline" size="sm">
              Period 101
            </Button>
          </Link>
          <Link to="/track">
            <Button size="sm" className="bg-cycle-primary hover:bg-cycle-secondary">
              Log Today
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};
