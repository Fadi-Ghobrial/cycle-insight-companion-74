
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarIcon, HomeIcon, LineChartIcon, Settings2Icon, BookOpen, Flag } from 'lucide-react';

export const MobileNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className="md:hidden container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-cycle-primary flex items-center">
            <span className="mr-1">🌸</span>
            <span>CycleInsight</span>
          </Link>
        </div>
      </div>

      <div className="fixed md:hidden bottom-0 left-0 right-0 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] z-50">
        <div className="grid grid-cols-7 py-2">
          <MobileNavLink to="/" icon={HomeIcon} label="Home" isActive={isActive('/')} />
          <MobileNavLink to="/calendar" icon={CalendarIcon} label="Calendar" isActive={isActive('/calendar')} />
          <MobileNavLink to="/insights" icon={LineChartIcon} label="Insights" isActive={isActive('/insights')} />
          
          <Link to="/track" className="flex flex-col items-center justify-center">
            <div className="bg-cycle-primary text-white rounded-full p-3 -mt-6 shadow-md border-4 border-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs mt-1 text-cycle-primary">Track</span>
          </Link>
          
          <MobileNavLink to="/milestones" icon={Flag} label="Milestones" isActive={isActive('/milestones')} />
          <MobileNavLink to="/learn" icon={BookOpen} label="Learn" isActive={isActive('/learn')} />
          <MobileNavLink to="/settings" icon={Settings2Icon} label="Settings" isActive={isActive('/settings')} />
        </div>
      </div>
    </>
  );
};

interface MobileNavLinkProps {
  to: string;
  icon: React.ComponentType<any>;
  label: string;
  isActive: boolean;
}

const MobileNavLink = ({ to, icon: Icon, label, isActive }: MobileNavLinkProps) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center justify-center ${isActive ? 'text-cycle-primary' : 'text-gray-500'}`}
  >
    <Icon size={20} />
    <span className="text-xs mt-1">{label}</span>
  </Link>
);
