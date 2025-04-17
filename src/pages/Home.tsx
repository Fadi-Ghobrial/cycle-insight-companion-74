
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import Calendar from '@/components/calendar/Calendar';

const Home: React.FC = () => {
  const { cycles, cycleDays, isAuthenticated } = useAppStore();
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-cycle-primary mb-2">CycleInsight Companion</h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl">
          Your clinically validated cycle-prediction engine for comprehensive health tracking
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Your Cycle Calendar</h2>
          <Calendar />
          <div className="mt-4 flex justify-center">
            <Link 
              to="/calendar" 
              className="inline-flex items-center px-4 py-2 bg-cycle-primary text-white rounded-md hover:bg-cycle-secondary transition-colors"
            >
              Full Calendar View
            </Link>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-3">Quick Track</h2>
            <p className="text-gray-600 mb-4">Log your period, symptoms, and mood with just a few taps.</p>
            <Link 
              to="/track" 
              className="inline-flex items-center px-4 py-2 bg-cycle-primary text-white rounded-md hover:bg-cycle-secondary transition-colors w-full justify-center"
            >
              Track Today
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-3">Health Integrations</h2>
            <p className="text-gray-600 mb-4">Connect with Apple Health, Samsung Health and smart devices.</p>
            <Link 
              to="/settings" 
              className="inline-flex items-center px-4 py-2 border border-cycle-primary text-cycle-primary rounded-md hover:bg-cycle-primary/10 transition-colors w-full justify-center"
            >
              Connect Devices
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-3">Cycle Insights</h2>
            <p className="text-gray-600 mb-4">Get personalized insights and predictions about your cycle.</p>
            <Link 
              to="/insights" 
              className="inline-flex items-center px-4 py-2 border border-cycle-primary text-cycle-primary rounded-md hover:bg-cycle-primary/10 transition-colors w-full justify-center"
            >
              View Insights
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-cycle-primary">Cycle Prediction</h3>
            <p className="text-sm text-gray-600 mt-2">Advanced ML algorithms for accurate cycle predictions</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-cycle-primary">Symptom Tracking</h3>
            <p className="text-sm text-gray-600 mt-2">Log symptoms, mood, and more with custom tags</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-cycle-primary">Health Integration</h3>
            <p className="text-sm text-gray-600 mt-2">Connect with Apple Health and Samsung Health</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-cycle-primary">Smart Reminders</h3>
            <p className="text-sm text-gray-600 mt-2">IoT-enabled reminders on your smart devices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
