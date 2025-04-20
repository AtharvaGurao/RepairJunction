
import { supabase } from "@/lib/supabase";
import { RepairRequest } from "@/types/repair";
import { extractPincodeFromAddress } from "../pincodeUtils";

/**
 * Find technician by pincode prefix match
 */
export async function findTechnicianByPincodePrefix(pincode: string) {
  if (!pincode) return null;
  
  const pincodePrefix = pincode.substring(0, 4);
  console.log("Searching with pincode prefix:", pincodePrefix);
  
  const { data: nearbyTechnicians, error: nearbyError } = await supabase
    .from('profiles')
    .select('id, full_name, phone_number, active_request_count, pincode, city_town, state')
    .eq('role', 'technician')
    .eq('can_receive_requests', true)
    .ilike('pincode', `${pincodePrefix}%`)
    .order('active_request_count', { ascending: true })
    .limit(1);
    
  if (nearbyError) {
    console.error("Error in pincode prefix match query:", nearbyError);
    throw nearbyError;
  }
  
  if (nearbyTechnicians && nearbyTechnicians.length > 0) {
    console.log("Found technician with prefix match:", nearbyTechnicians[0].id);
    return nearbyTechnicians[0];
  }
  
  return null;
}

/**
 * Find requests by pincode prefix match
 */
export function findPrefixMatchRequests(
  requests: RepairRequest[], 
  technicianPincode: string, 
  existingMatchIds: number[]
): RepairRequest[] {
  if (!technicianPincode) return [];
  
  const pincodePrefix = technicianPincode.substring(0, 3);
  console.log("Trying prefix matching with:", pincodePrefix);
  
  const matches = requests.filter(req => {
    if (existingMatchIds.includes(req.id)) return false;
    if (!req.address) return false;
    
    const addressPincode = extractPincodeFromAddress(req.address);
    if (!addressPincode) return false;
    
    const matched = addressPincode.startsWith(pincodePrefix);
    if (matched) {
      console.log(`Request #${req.id} matched via prefix: ${addressPincode}`);
    }
    
    return matched;
  });
  
  console.log(`Found ${matches.length} prefix pincode matches`);
  return matches;
}
