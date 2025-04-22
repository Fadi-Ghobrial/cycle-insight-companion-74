
import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { NavAuth } from './NavAuth';

const Navbar: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <DesktopNav />
      <div className="hidden md:flex container mx-auto px-4">
        <NavAuth user={user} />
      </div>
      <MobileNav />
    </nav>
  );
};

export default Navbar;
