
import { RepairRequest } from "@/types/repair";
import { extractPincodeFromAddress } from "@/utils/pincodeUtils";

/**
 * Match requests that have exact pincode match with the technician's pincode
 * @param requests List of repair requests to filter
 * @param technicianPincode The technician's pincode
 * @returns Filtered list of requests with exact pincode match
 */
export function findExactPincodeMatches(requests: RepairRequest[], technicianPincode: string): RepairRequest[] {
  if (!technicianPincode) {
    console.error("Error: Technician pincode is null or empty");
    return [];
  }
  
  console.log(`Finding exact pincode matches for technician pincode: ${technicianPincode}`);
  
  const matches = requests.filter(req => {
    if (!req.address) return false;
    
    // Try to extract pincode from address
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

/**
 * Match requests by address containing the technician's pincode
 * @param requests List of repair requests to filter
 * @param technicianPincode The technician's pincode
 * @param existingMatches List of already matched request IDs to exclude
 * @returns Filtered list of requests that contain the pincode string
 */
export function findStringContainsMatches(
  requests: RepairRequest[], 
  technicianPincode: string, 
  existingMatches: RepairRequest[]
): RepairRequest[] {
  if (!technicianPincode) return [];
  
  const existingIds = existingMatches.map(match => match.id);
  
  const matches = requests.filter(req => {
    // Skip if already matched
    if (existingIds.includes(req.id)) return false;
    if (!req.address) return false;
    
    // Direct string contains check - most reliable method
    const matched = req.address.includes(technicianPincode);
    if (matched) {
      console.log(`Request #${req.id} matched via string contains: ${technicianPincode}`);
    }
    
    return matched;
  });
  
  console.log(`Found ${matches.length} string contains matches`);
  return matches;
}

/**
 * Match requests by pincode prefix
 * @param requests List of repair requests to filter
 * @param technicianPincode The technician's pincode
 * @param existingMatches List of already matched request IDs to exclude
 * @returns Filtered list of requests with matching pincode prefix
 */
export function findPrefixMatches(
  requests: RepairRequest[], 
  technicianPincode: string, 
  existingMatches: RepairRequest[]
): RepairRequest[] {
  if (!technicianPincode) return [];
  
  const existingIds = existingMatches.map(match => match.id);
  const pincodePrefix = technicianPincode.substring(0, 3); // Use first 3 digits for broader matching
  
  console.log("Trying prefix matching with:", pincodePrefix);
  
  const matches = requests.filter(req => {
    // Skip requests already matched
    if (existingIds.includes(req.id)) return false;
    if (!req.address) return false;
    
    // Extract pincode from address and check prefix
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

/**
 * Get all matching requests using multiple strategies
 * @param requests All pending requests
 * @param technicianPincode The technician's pincode
 * @returns Combined list of matching requests
 */
export function getAllMatchingRequests(
  requests: RepairRequest[],
  technicianPincode: string
): RepairRequest[] {
  if (!requests.length || !technicianPincode) {
    console.log("No requests or technician pincode not available");
    return [];
  }

  // Apply all matching strategies in sequence
  const exactMatches = findExactPincodeMatches(requests, technicianPincode);
  const stringMatches = findStringContainsMatches(requests, technicianPincode, exactMatches);
  const prefixMatches = findPrefixMatches(requests, technicianPincode, [...exactMatches, ...stringMatches]);
  
  // Combine all matches
  const allMatches = [...exactMatches, ...stringMatches, ...prefixMatches];
  
  console.log(`Total matched requests: ${allMatches.length}`);
  
  // If no matches found with any method, return all requests
  if (allMatches.length === 0) {
    console.log("No matches found with any method, returning all pending requests");
    return requests;
  }
  
  return allMatches;
}
