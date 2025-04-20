
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AddressManager } from "@/components/profile/AddressManager";
import { useProfileData } from "@/hooks/useProfileData";
import { ProfileSaveHandler } from "@/components/profile/ProfileSaveHandler";

interface ProfileContainerProps {
  isFirstTime?: boolean;
  isTechnician?: boolean;
  onProfileUpdate?: () => void;
}

export function ProfileContainer({ isFirstTime, isTechnician, onProfileUpdate }: ProfileContainerProps) {
  const [certificationsToUpload, setCertificationsToUpload] = useState<FileList | null>(null);
  const navigate = useNavigate();
  const { profile, formData, loading, handleFormChange, refreshProfile } = useProfileData();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {isFirstTime ? "Complete Your Profile" : 
           isTechnician ? "Technician Profile" : "Personal Information"}
        </CardTitle>
        {isFirstTime && (
          <p className="text-muted-foreground mt-2">
            Please complete your profile information to continue.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {profile && <ProfileAvatar avatarUrl={profile.avatar_url} fullName={profile.full_name} />}
        
        <ProfileSaveHandler 
          formData={formData}
          certificationsToUpload={certificationsToUpload}
          isTechnician={isTechnician}
          isFirstTime={isFirstTime}
          onProfileUpdate={() => {
            if (onProfileUpdate) onProfileUpdate();
            refreshProfile();
          }}
        >
          {({ saving, handleSubmit }) => (
            <ProfileForm
              formData={formData}
              saving={saving}
              onCancel={() => navigate(isTechnician ? '/technician' : '/')}
              onSubmit={handleSubmit}
              onChange={handleFormChange}
              onCertificationsChange={(files) => setCertificationsToUpload(files)}
              isFirstTime={isFirstTime}
              isTechnician={isTechnician}
            />
          )}
        </ProfileSaveHandler>

        {profile && profile.id && (
          <AddressManager userId={profile.id} />
        )}
      </CardContent>
    </Card>
  );
}
