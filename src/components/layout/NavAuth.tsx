
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const NavAuth = ({ user }: { user: any }) => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <span className="text-sm text-gray-600">{user.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </>
      ) : (
        <Button asChild>
          <Link to="/auth">
            <User className="w-4 h-4 mr-2" />
            Sign in
          </Link>
        </Button>
      )}
    </div>
  );
};
