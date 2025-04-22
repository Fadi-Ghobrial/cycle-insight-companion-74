
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const GeneralTools = () => {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">Track Your Cycle</h3>
            <p className="text-sm text-gray-600">
              Log your period, symptoms, and moods to get personalized insights.
            </p>
          </CardContent>
          <CardFooter className="px-6 py-3 bg-gray-50">
            <Link to="/track">
              <Button variant="link" className="text-cycle-primary p-0">
                Start Tracking <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">Calendar View</h3>
            <p className="text-sm text-gray-600">
              View your past cycles and see predictions for upcoming periods.
            </p>
          </CardContent>
          <CardFooter className="px-6 py-3 bg-gray-50">
            <Link to="/calendar">
              <Button variant="link" className="text-cycle-primary p-0">
                View Calendar <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">Cycle Education</h3>
            <p className="text-sm text-gray-600">
              Learn about your menstrual cycle and how to manage symptoms.
            </p>
          </CardContent>
          <CardFooter className="px-6 py-3 bg-gray-50">
            <Link to="/learn">
              <Button variant="link" className="text-cycle-primary p-0">
                Learn More <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};
