
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

export const TTCTools = () => {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Conception Tools</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/ttc">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h3 className="font-medium mb-2">Fertile Window</h3>
              <p className="text-sm text-gray-600">
                Track your most fertile days with our countdown tool.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/ttc?tab=ovulation-test">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h3 className="font-medium mb-2">Ovulation Tests</h3>
              <p className="text-sm text-gray-600">
                Scan and log your ovulation test results.
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/ttc?tab=checklist">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <h3 className="font-medium mb-2">Preconception Checklist</h3>
              <p className="text-sm text-gray-600">
                Track important preparations for pregnancy.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
};
