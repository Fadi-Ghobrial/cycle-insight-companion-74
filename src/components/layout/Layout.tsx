
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { RequireAuth } from '@/lib/auth-provider';

interface LayoutProps {
  requireAuth?: boolean;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ requireAuth = true, children }) => {
  const content = (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );

  if (requireAuth) {
    return <RequireAuth>{content}</RequireAuth>;
  }

  return content;
};

export default Layout;
