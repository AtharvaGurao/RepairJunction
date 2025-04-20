
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";

export function useProfileData(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const { toast } = useToast();
  
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      const profileId = userId || user.id;
      console.log("Fetching profile for user:", profileId);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) {
        console.error("Supabase error fetching profile:", error);
        throw error;
      }

      console.log("Profile data fetched:", data);
      
      setProfile(data);
      setFormData(data || { 
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        skills: user.user_metadata?.skills || '',
        role: user.user_metadata?.role || 'user'
      });
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile. Please try again.",
      });
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return {
    profile,
    formData,
    loading,
    error,
    setFormData,
    handleFormChange,
    refreshProfile: fetchProfile
  };
}
