import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";

interface ProfileDisplayProps {
  profile: Profile;
  onEdit: () => void;
}

export function ProfileDisplay({ profile, onEdit }: ProfileDisplayProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Full Name</h3>
        <p className="text-muted-foreground">{profile?.full_name || 'Not set'}</p>
      </div>
      <div>
        <h3 className="font-medium">Phone Number</h3>
        <p className="text-muted-foreground">{profile?.phone_number || 'Not set'}</p>
      </div>
      <div>
        <h3 className="font-medium">Email Address</h3>
        <p className="text-muted-foreground">{profile?.email || 'Not set'}</p>
      </div>
      <div>
        <h3 className="font-medium">Address</h3>
        <p className="text-muted-foreground">{profile?.address || 'Not set'}</p>
      </div>
      <Button onClick={onEdit}>Edit Profile</Button>
    </div>
  );
}