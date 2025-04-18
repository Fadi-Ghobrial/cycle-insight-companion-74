import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthStatus } from '@/lib/auth-provider';
import { CalendarIcon, HomeIcon, LineChartIcon, Settings2Icon, BookOpen, Flag } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = window.innerWidth < 768;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      {/* Desktop navigation */}
      <div className="hidden md:block container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-cycle-primary flex items-center">
              <span className="mr-2">🌸</span>
              <span>CycleInsight</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-gray-700 hover:text-cycle-primary ${isActive('/') ? 'text-cycle-primary font-medium' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/calendar" 
              className={`text-gray-700 hover:text-cycle-primary ${isActive('/calendar') ? 'text-cycle-primary font-medium' : ''}`}
            >
              Calendar
            </Link>
            <Link 
              to="/insights" 
              className={`text-gray-700 hover:text-cycle-primary ${isActive('/insights') ? 'text-cycle-primary font-medium' : ''}`}
            >
              Insights
            </Link>
            <Link 
              to="/learn" 
              className={`text-gray-700 hover:text-cycle-primary ${isActive('/learn') ? 'text-cycle-primary font-medium' : ''}`}
            >
              Learn
            </Link>
            <Link 
              to="/milestones" 
              className={`text-gray-700 hover:text-cycle-primary ${isActive('/milestones') ? 'text-cycle-primary font-medium' : ''}`}
            >
              Milestones
            </Link>
            <Link 
              to="/settings" 
              className={`text-gray-700 hover:text-cycle-primary ${isActive('/settings') ? 'text-cycle-primary font-medium' : ''}`}
            >
              Settings
            </Link>
          </div>
          
          <div>
            <AuthStatus />
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-cycle-primary flex items-center">
            <span className="mr-1">🌸</span>
            <span>CycleInsight</span>
          </Link>
          
          <div>
            <AuthStatus />
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] z-50">
        <div className="grid grid-cols-6 py-2">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center ${isActive('/') ? 'text-cycle-primary' : 'text-gray-500'}`}
          >
            <HomeIcon size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            to="/calendar" 
            className={`flex flex-col items-center justify-center ${isActive('/calendar') ? 'text-cycle-primary' : 'text-gray-500'}`}
          >
            <CalendarIcon size={20} />
            <span className="text-xs mt-1">Calendar</span>
          </Link>
          
          <Link 
            to="/insights" 
            className={`flex flex-col items-center justify-center ${isActive('/insights') ? 'text-cycle-primary' : 'text-gray-500'}`}
          >
            <LineChartIcon size={20} />
            <span className="text-xs mt-1">Insights</span>
          </Link>
          
          <Link 
            to="/track" 
            className="flex flex-col items-center justify-center"
          >
            <div className="bg-cycle-primary text-white rounded-full p-3 -mt-6 shadow-md border-4 border-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs mt-1 text-cycle-primary">Track</span>
          </Link>
          
          <Link 
            to="/milestones" 
            className={`flex flex-col items-center justify-center ${isActive('/milestones') ? 'text-cycle-primary' : 'text-gray-500'}`}
          >
            <Flag size={20} />
            <span className="text-xs mt-1">Milestones</span>
          </Link>
          
          <Link 
            to="/learn" 
            className={`flex flex-col items-center justify-center ${isActive('/learn') ? 'text-cycle-primary' : 'text-gray-500'}`}
          >
            <BookOpen size={20} />
            <span className="text-xs mt-1">Learn</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
