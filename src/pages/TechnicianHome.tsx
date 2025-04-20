
import { HeroSection } from "@/components/technician/HeroSection";
import { HowItWorks } from "@/components/technician/HowItWorks";
import { KeyFeatures } from "@/components/technician/KeyFeatures";
import { Testimonials } from "@/components/technician/Testimonials";
import { FAQ } from "@/components/technician/FAQ";
import { Footer } from "@/components/technician/Footer";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export default function TechnicianHome() {
  const { isAuthenticated, isTechnician, isLoading } = useAuthStatus();
  const navigate = useNavigate();

  // Check if the user is logged in but hasn't completed their profile yet
  useEffect(() => {
    if (!isLoading && isAuthenticated && isTechnician) {
      // Check if this is user's first login by checking their profile completion status
      const checkProfileStatus = async () => {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_profile_complete, phone_number, pincode, skills')
            .eq('id', (await supabase.auth.getUser()).data.user?.id)
            .single();

          // If profile is incomplete, redirect to profile page with firstTime flag
          if (!profile || 
              !profile.phone_number || 
              !profile.pincode || 
              !profile.skills ||
              profile.is_profile_complete === false) {
            navigate("/technician/profile?firstTime=true");
          }
        } catch (error) {
          console.error("Error checking profile status:", error);
        }
      };

      checkProfileStatus();
    }
  }, [isLoading, isAuthenticated, isTechnician, navigate]);

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <KeyFeatures />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
