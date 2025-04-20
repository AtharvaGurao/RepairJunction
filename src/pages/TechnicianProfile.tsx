
import { useLocation, Navigate } from "react-router-dom";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function TechnicianProfile() {
  const location = useLocation();
  const isFirstTime = new URLSearchParams(location.search).get('firstTime') === 'true';
  const { isAuthenticated, isTechnician, isLoading, userRole } = useAuthStatus();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isFirstTime && !isLoading && isAuthenticated) {
      toast({
        title: "Welcome to RepairJunction!",
        description: "Please complete your profile to get started.",
      });
    }
  }, [isFirstTime, isLoading, isAuthenticated, toast]);

  // Check if profile is already complete (and not firstTime mode)
  useEffect(() => {
    let isMounted = true;
    
    if (!isLoading && isAuthenticated && isTechnician && !isFirstTime) {
      const checkProfileCompletion = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            if (isMounted) {
              setIsProfileComplete(false);
              setCheckingProfile(false);
            }
            return;
          }

          console.log("Checking profile completion for user:", user.id);

          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*, is_profile_complete')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to load profile information.",
            });
          }

          if (isMounted) {
            console.log("Full profile data:", profile);
            // Log address fields specifically to debug
            if (profile) {
              console.log("Address fields in profile:", {
                address: profile.address,
                city_town: profile.city_town,
                state: profile.state,
                pincode: profile.pincode,
                flat_no_house_no: profile.flat_no_house_no
              });
            }
            setIsProfileComplete(profile?.is_profile_complete || false);
            setCheckingProfile(false);
          }
        } catch (error) {
          console.error("Error checking profile completion:", error);
          if (isMounted) {
            setIsProfileComplete(false);
            setCheckingProfile(false);
          }
        }
      };

      checkProfileCompletion();
    } else {
      if (isMounted) {
        setCheckingProfile(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [isLoading, isAuthenticated, isTechnician, isFirstTime, toast]);

  console.log("TechnicianProfile rendering:", { 
    isLoading, 
    isAuthenticated, 
    isTechnician, 
    userRole,
    checkingProfile, 
    isProfileComplete,
    isFirstTime 
  });

  // Show loading state while auth status is being determined
  if (isLoading || checkingProfile) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile information...</p>
        </div>
      </div>
    );
  }

  // Redirect non-technicians to login page
  if (!isAuthenticated) {
    return <Navigate to="/login/technician" replace />;
  }

  // Redirect non-technicians to proper login
  if (!isTechnician) {
    toast({
      variant: "destructive",
      title: "Access Denied",
      description: "This page is only accessible to technicians.",
    });
    return <Navigate to="/login/technician" replace />;
  }
  
  return (
    <div className="container max-w-2xl mx-auto p-4 mt-8">
      <ProfileContainer 
        isTechnician={true} 
        isFirstTime={isFirstTime} 
      />
    </div>
  );
}
