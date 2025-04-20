
export interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  avatar_url: string | null;
  state: string | null;
  pincode: string | null;
  flat_no_house_no: string | null;
  skills: string | null;
  role: string;
  city_town: string | null;
  certifications?: string | null; // JSON string of certification file data
  is_profile_complete?: boolean; // Added field to track profile completion
  created_at?: string;
  updated_at?: string;
}
