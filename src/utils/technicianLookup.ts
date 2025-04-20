
import { RepairRequest } from "@/types/repair";
import { findExactPincodeMatch, findExactPincodeRequests } from "./technician/exactMatch";
import { findTechnicianByCityState } from "./technician/cityStateMatch";
import { findTechnicianByPincodePrefix, findPrefixMatchRequests } from "./technician/prefixMatch";

export async function findTechnicianByPincode(pincode: string, city?: string, state?: string) {
  try {
    console.log(`Finding technician for location: pincode='${pincode}', city='${city}', state='${state}'`);
    
    // Try exact pincode match first
    const exactMatch = await findExactPincodeMatch(pincode);
    if (exactMatch) {
      return { success: true, technician: exactMatch };
    }
    
    // If no exact match but we have city and state, try that
    if (city && state) {
      const cityStateMatch = await findTechnicianByCityState(city, state);
      if (cityStateMatch) {
        return { success: true, technician: cityStateMatch };
      }
    }
    
    // Try prefix match as last resort
    if (pincode) {
      const prefixMatch = await findTechnicianByPincodePrefix(pincode);
      if (prefixMatch) {
        return { success: true, technician: prefixMatch };
      }
    }
    
    console.log("No technician found for given location criteria");
    return { success: true, technician: null };
  } catch (error) {
    console.error("Error finding technician:", error);
    return { success: false, technician: null };
  }
}

export function getAllMatchingRequests(
  requests: RepairRequest[],
  technicianPincode: string
): RepairRequest[] {
  if (!requests.length || !technicianPincode) {
    console.log("No requests or technician pincode not available");
    return [];
  }

  // Get exact matches
  const exactMatches = findExactPincodeRequests(requests, technicianPincode);
  
  // Get prefix matches, excluding already matched requests
  const exactMatchIds = exactMatches.map(match => match.id);
  const prefixMatches = findPrefixMatchRequests(requests, technicianPincode, exactMatchIds);
  
  // Combine all matches
  const allMatches = [...exactMatches, ...prefixMatches];
  console.log(`Total matched requests: ${allMatches.length}`);
  
  // If no matches found with any method, return all requests
  if (allMatches.length === 0) {
    console.log("No matches found with any method, returning all pending requests");
    return requests;
  }
  
  return allMatches;
}
