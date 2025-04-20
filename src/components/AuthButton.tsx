
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AuthButtonProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setIsTechnician: (value: boolean) => void;
}

export const AuthButton = ({ isAuthenticated, setIsAuthenticated, setIsTechnician }: AuthButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      // Clear auth states first for immediate UI feedback
      setIsAuthenticated(false);
      setIsTechnician(false);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "You have been successfully logged out",
      });

      // Redirect to home page
      navigate("/");
      
    } catch (error: any) {
      console.error("Error during logout:", error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to log out. Please try again.",
      });
      
      // If there was an error, try to restore the session
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        
        // Check if user is technician
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
          
        setIsTechnician(profile?.role === 'technician');
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isAuthenticated) {
    return (
      <Button
        onClick={handleLogout}
        variant="default"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        variant="default"
      >
        <Link to="/login">
          Login
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
      >
        <Link to="/signup">
          Sign Up
        </Link>
      </Button>
    </div>
  );
};
