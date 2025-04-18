import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  requireAuth?: boolean;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ requireAuth = true, children }) => {
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);

  React.useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const content = (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );

  if (requireAuth && !authenticated) {
    return <Navigate to="/auth" replace />;
  }

  return content;
};

export default Layout;
