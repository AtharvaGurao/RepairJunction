
import { supabase } from "@/lib/supabase";
import { RepairRequest } from "@/types/repair";
import { extractPincodeFromAddress } from "../pincodeUtils";

/**
 * Match requests that have exact pincode match with the technician's pincode
 */
export async function findExactPincodeMatch(pincode: string) {
  if (!pincode) {
    console.log("No pincode provided for exact match search");
    return null;
  }
  
  const { data: matchingTechnicians, error: techError } = await supabase
    .from('profiles')
    .select('id, full_name, phone_number, active_request_count, pincode, city_town, state')
    .eq('role', 'technician')
    .eq('can_receive_requests', true)
    .eq('pincode', pincode)
    .order('active_request_count', { ascending: true })
    .limit(1);
    
  if (techError) {
    console.error("Error finding technicians by exact pincode:", techError);
    throw techError;
  }
  
  if (matchingTechnicians && matchingTechnicians.length > 0) {
    console.log("Found technician with exact pincode match:", matchingTechnicians[0].id);
    return matchingTechnicians[0];
  }
  
  return null;
}

/**
 * Find requests with exact pincode matches
 */
export function findExactPincodeRequests(requests: RepairRequest[], technicianPincode: string): RepairRequest[] {
  if (!technicianPincode) {
    console.error("Error: Technician pincode is null or empty");
    return [];
  }
  
  console.log(`Finding exact pincode matches for technician pincode: ${technicianPincode}`);
  
  const matches = requests.filter(req => {
    if (!req.address) return false;
    const addressPincode = extractPincodeFromAddress(req.address);
    const matched = addressPincode === technicianPincode;
    
    if (matched) {
      console.log(`Request #${req.id} matched via exact pincode: ${addressPincode}`);
    }
    
    return matched;
  });
  
  console.log(`Found ${matches.length} exact pincode matches`);
  return matches;
}
