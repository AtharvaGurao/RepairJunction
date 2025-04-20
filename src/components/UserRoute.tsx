
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const UserRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkUserStatus = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!mounted) return;

        if (!session?.user?.id) {
          setIsUser(false);
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
          setIsUser(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to verify user status. Please try again.",
          });
        } else {
          const isRegularUser = profile?.role === 'user';
          setIsUser(isRegularUser);

          if (!isRegularUser) {
            toast({
              variant: "destructive",
              title: "Access Denied",
              description: "This area is restricted to regular users only.",
            });
          }
        }
      } catch (error: any) {
        console.error("Error checking user status:", error);
        if (mounted) {
          setIsUser(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to verify user status. Please try again.",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Check user status
    checkUserStatus();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setIsUser(false);
        setLoading(false);
        return;
      }

      // Re-check user status on auth changes
      checkUserStatus();
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
