
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "./use-toast";

export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTechnician, setIsTechnician] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Initialize auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        setIsTechnician(false);
        setIsUser(false);
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      if (session?.user?.id) {
        setIsAuthenticated(true);
        
        try {
          // Use setTimeout to avoid potential deadlocks with Supabase auth
          setTimeout(async () => {
            if (!mounted) return;
            
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();

            if (!mounted) return;

            if (profileError) {
              console.error("Error fetching profile:", profileError);
              setIsTechnician(false);
              setIsUser(false);
              setUserRole(null);
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to verify user role",
              });
            } else {
              const role = profile?.role;
              setUserRole(role);
              const isTech = role === 'technician';
              setIsTechnician(isTech);
              setIsUser(role === 'user');
              console.log("User role updated:", role);
            }
            
            setIsLoading(false);
          }, 0);
        } catch (error) {
          console.error("Error in auth state change:", error);
          if (mounted) {
            setIsTechnician(false);
            setIsUser(false);
            setUserRole(null);
            setIsLoading(false);
          }
        }
      }
    });

    // Then check for existing session
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!mounted) return;

        if (session?.user?.id) {
          setIsAuthenticated(true);
          
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();

            if (!mounted) return;

            if (profileError) {
              console.error("Error fetching profile:", profileError);
              setIsTechnician(false);
              setIsUser(false);
              setUserRole(null);
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to verify user role",
              });
            } else {
              const role = profile?.role;
              setUserRole(role);
              const isTech = role === 'technician';
              setIsTechnician(isTech);
              setIsUser(role === 'user');
              console.log("User role:", role);
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
            if (mounted) {
              setIsTechnician(false);
              setIsUser(false);
              setUserRole(null);
            }
          }
        } else {
          setIsAuthenticated(false);
          setIsTechnician(false);
          setIsUser(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsTechnician(false);
          setIsUser(false);
          setUserRole(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Check for existing session
    checkAuth();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [toast]);

  return { 
    isAuthenticated, 
    setIsAuthenticated, 
    isTechnician, 
    setIsTechnician, 
    isUser,
    setIsUser,
    userRole,
    isLoading 
  };
};
