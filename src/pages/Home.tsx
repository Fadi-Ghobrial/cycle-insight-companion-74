
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { LifeStage } from '@/types';
import ForecastSection from '@/components/home/ForecastSection';

const Home: React.FC = () => {
  const { user, currentLifeStage } = useAppStore();
  
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <section className="mb-8">
          <h1 className="text-2xl font-bold text-cycle-primary mb-2">
            Welcome{user ? `, ${user.displayName || ''}` : ''}
          </h1>
          <p className="text-gray-600">
            Track, predict, and understand your cycle.
          </p>
        </section>
        
        {/* Quick Actions */}
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
        
        {/* Forecast Section */}
        <ForecastSection />
        
        {/* Life Stage Specific Content */}
        {currentLifeStage === LifeStage.FIRST_PERIOD && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Getting Started</h2>
              <Link to="/milestones">
                <Button variant="link" className="text-cycle-primary p-0">
                  View More <ArrowRight className="h-4 w-4 ml-1" />
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
        )}
        
        {/* Footer Cards - Available to all users */}
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
      </div>
    </Layout>
  );
};

export default Home;
