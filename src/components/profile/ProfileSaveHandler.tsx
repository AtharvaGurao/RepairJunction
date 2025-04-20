
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/profile";

interface ProfileSaveHandlerProps {
  formData: Partial<Profile>;
  certificationsToUpload: FileList | null;
  isTechnician?: boolean;
  isFirstTime?: boolean;
  onProfileUpdate?: () => void;
  children: (props: {
    saving: boolean;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
  }) => React.ReactNode;
}

export function ProfileSaveHandler({
  formData,
  certificationsToUpload,
  isTechnician,
  isFirstTime,
  onProfileUpdate,
  children
}: ProfileSaveHandlerProps) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isProfileComplete = (data: Partial<Profile>, isTech: boolean): boolean => {
    const hasBasicInfo = !!data.full_name && !!data.phone_number;
    
    if (isTech) {
      return hasBasicInfo && !!data.skills && !!data.pincode;
    }
    
    return hasBasicInfo;
  };

  const handleCertificationUpload = async (userId: string) => {
    if (!certificationsToUpload || certificationsToUpload.length === 0) return [];

    const certificationData = [];
    
    try {
      const folderPath = `${userId}/`;
      
      for (let i = 0; i < certificationsToUpload.length; i++) {
        const file = certificationsToUpload[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${folderPath}${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('certifications')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const publicUrl = supabase.storage
          .from('certifications')
          .getPublicUrl(filePath).data.publicUrl;
          
        certificationData.push({
          name: file.name,
          path: filePath,
          url: publicUrl,
          type: file.type,
          size: file.size,
          uploaded_at: new Date().toISOString()
        });
      }
      
      return certificationData;
    } catch (error: any) {
      console.error("Error uploading certifications:", error);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: `Failed to upload certifications: ${error.message}`
      });
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      if (!formData.full_name?.trim() || !formData.phone_number?.trim()) {
        throw new Error("Full Name and Phone Number are required");
      }

      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(formData.phone_number)) {
        throw new Error("Please enter a valid phone number");
      }

      let certifications = formData.certifications || '[]';
      
      if (certificationsToUpload && certificationsToUpload.length > 0) {
        const uploadedCertifications = await handleCertificationUpload(user.id);
        
        let existingCerts = [];
        try {
          existingCerts = certifications ? JSON.parse(certifications as string) : [];
          if (!Array.isArray(existingCerts)) existingCerts = [];
        } catch (e) {
          existingCerts = [];
        }
        
        const mergedCertifications = [...existingCerts, ...uploadedCertifications];
        certifications = JSON.stringify(mergedCertifications);
      }

      // Clean address data - make sure we trim values and handle null/undefined
      const addressFields = {
        address: formData.address?.trim() || null,
        state: formData.state?.trim() || null,
        city_town: formData.city_town?.trim() || null,
        pincode: formData.pincode?.trim() || null,
        flat_no_house_no: formData.flat_no_house_no?.trim() || null
      };

      console.log("Address fields to save:", addressFields);

      // Create the update data object with all fields
      const updateData: Partial<Profile> = {
        id: user.id,
        full_name: formData.full_name.trim(),
        phone_number: formData.phone_number.trim(),
        email: formData.email,
        ...addressFields, // Add all address fields directly
        certifications: certifications as string,
        updated_at: new Date().toISOString(),
        is_profile_complete: isProfileComplete(formData, !!isTechnician),
      };

      // Ensure role and skills are set for technicians
      if (isTechnician) {
        updateData.role = 'technician'; // Explicitly set role
        updateData.skills = formData.skills?.trim() || null;
        console.log("Setting technician specific fields:", { 
          role: 'technician',
          skills: updateData.skills 
        });
      } else {
        updateData.role = user.user_metadata?.role || 'user';
      }

      console.log("Updating profile with final data:", updateData);

      // Use upsert to create or update the profile and return the result
      const { error, data } = await supabase
        .from('profiles')
        .upsert(updateData, {
          onConflict: 'id'
        })
        .select();

      if (error) throw error;
      
      console.log("Profile update response:", data);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      if (isFirstTime || isProfileComplete(updateData, !!isTechnician)) {
        navigate(isTechnician ? '/technician' : '/');
      }

      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    } finally {
      setSaving(false);
    }
  };

  return <>{children({ saving, handleSubmit })}</>;
}
