
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile } from "@/types/profile";
import { CertificationsUploader } from "./CertificationsUploader";

interface ProfileFormProps {
  formData: Partial<Profile>;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCertificationsChange: (files: FileList | null) => void;
  isFirstTime?: boolean;
  isTechnician?: boolean;
}

export function ProfileForm({ 
  formData, 
  saving, 
  onCancel, 
  onSubmit, 
  onChange,
  onCertificationsChange,
  isFirstTime,
  isTechnician
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Personal Information Section */}
      <div className="space-y-4 col-span-1 md:col-span-2">
        <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name || ''}
              onChange={onChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number *</Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={onChange}
              required
              placeholder="Enter your phone number"
              type="tel"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            value={formData.email || ''}
            type="email"
            disabled
            className="bg-gray-100"
          />
          <p className="text-xs text-muted-foreground">Your registered email address</p>
        </div>

        {/* Address Information for all users */}
        <div className="space-y-4">
          <h4 className="text-md font-medium">Address Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flat_no_house_no">House/Flat Number</Label>
              <Input
                id="flat_no_house_no"
                name="flat_no_house_no"
                value={formData.flat_no_house_no || ''}
                onChange={onChange}
                placeholder="Enter your house/flat number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={onChange}
                placeholder="Enter your street address"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city_town">City/Town</Label>
              <Input
                id="city_town"
                name="city_town"
                value={formData.city_town || ''}
                onChange={onChange}
                placeholder="Enter your city/town"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state || ''}
                onChange={onChange}
                placeholder="Enter your state"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode {isTechnician && '*'}</Label>
              <Input
                id="pincode"
                name="pincode"
                value={formData.pincode || ''}
                onChange={onChange}
                required={isTechnician}
                placeholder="Enter your pincode"
              />
              {isTechnician && (
                <p className="text-xs text-muted-foreground">
                  Repair requests in this pincode area will be assigned to you
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Technician Specific Section */}
      {isTechnician && (
        <div className="space-y-4 col-span-1 md:col-span-2">
          <h3 className="text-lg font-medium border-b pb-2">Professional Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="skills">Skills/Expertise *</Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills || ''}
              onChange={onChange}
              placeholder="Enter your skills (e.g., Appliance Repair, Electronics)"
              required={isTechnician}
            />
            <p className="text-sm text-muted-foreground">List your areas of expertise separated by commas</p>
          </div>
          
          {/* Replace with CertificationsUploader component */}
          <CertificationsUploader 
            initialCertifications={formData.certifications} 
            onCertificationsChange={onCertificationsChange} 
          />
        </div>
      )}

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Saving...
            </>
          ) : (
            isFirstTime ? "Complete Profile" : "Save Changes"
          )}
        </Button>
        {!isFirstTime && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
