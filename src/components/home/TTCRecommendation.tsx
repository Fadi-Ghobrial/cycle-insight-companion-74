
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BabyIcon, BarChart, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { LifeStage } from '@/types';

export const TTCRecommendation: React.FC = () => {
  const { currentLifeStage } = useAppStore();
  
  // Only show for TTC life stage
  if (currentLifeStage !== LifeStage.TTC) {
    return null;
  }
  
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Trying to Conceive</h2>
        <Link to="/ttc">
          <Button variant="link" className="text-cycle-primary p-0">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-100">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <BabyIcon className="h-6 w-6 text-green-800" />
            </div>
            <div>
              <h3 className="text-lg font-medium">TTC Mode Active</h3>
              <p className="text-sm text-gray-600">
                Your experience is now optimized for conception
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fertile Window</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <BarChart className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Track your optimal days</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ovulation Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <BarChart className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Log test results</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        
        <CardFooter className="px-6 py-3 bg-white/50 flex justify-between">
          <Link to="/track">
            <Button variant="outline" size="sm">
              Log Today
            </Button>
          </Link>
          <Link to="/ttc">
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              TTC Tools
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};
