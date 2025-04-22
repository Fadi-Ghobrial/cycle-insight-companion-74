
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/calendar', label: 'Calendar' },
  { path: '/insights', label: 'Insights' },
  { path: '/learn', label: 'Learn' },
  { path: '/milestones', label: 'Milestones' },
  { path: '/settings', label: 'Settings' },
];

export const DesktopNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:block container mx-auto px-4 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-cycle-primary flex items-center">
            <span className="mr-2">🌸</span>
            <span>CycleInsight</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          {navItems.map(({ path, label }) => (
            <Link 
              key={path}
              to={path} 
              className={`text-gray-700 hover:text-cycle-primary ${isActive(path) ? 'text-cycle-primary font-medium' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
