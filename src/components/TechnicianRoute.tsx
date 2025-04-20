
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const TechnicianRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isTechnician, setIsTechnician] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkTechnicianStatus = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!mounted) return;

        if (!session?.user?.id) {
          setIsTechnician(false);
          setLoading(false);
          return;
        }

        // Check user role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!mounted) return;

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setIsTechnician(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to verify technician status. Please try again.",
          });
        } else {
          const isTech = profile?.role === 'technician';
          console.log("TechnicianRoute - User role:", profile?.role, "isTechnician:", isTech);
          setIsTechnician(isTech);

          if (!isTech) {
            toast({
              variant: "destructive",
              title: "Access Denied",
              description: "This area is restricted to technicians only.",
            });
          }
        }
      } catch (error: any) {
        console.error("Error checking technician status:", error);
        if (mounted) {
          setIsTechnician(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to verify technician status. Please try again.",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Check technician status
    checkTechnicianStatus();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setIsTechnician(false);
        setLoading(false);
        return;
      }

      // Re-check technician status on auth changes
      checkTechnicianStatus();
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isTechnician) {
    return <Navigate to="/login/technician" replace />;
  }

  return <>{children}</>;
};
