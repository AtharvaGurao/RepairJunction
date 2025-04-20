
import { supabase } from "@/lib/supabase";

/**
 * Fetches the technician's pincode from their profile
 */
export async function fetchTechnicianPincode(technicianId: string): Promise<string | null> {
  const { data: techData, error: techError } = await supabase
    .from('profiles')
    .select('pincode')
    .eq('id', technicianId)
    .single();
    
  if (techError) {
    console.error("Error fetching technician pincode:", techError);
    throw techError;
  }
  
  if (techData?.pincode) {
    console.log("Technician pincode found:", techData.pincode);
    return techData.pincode;
  } else {
    console.log("No pincode found for technician");
    return null;
  }
}
