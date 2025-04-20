
// Helper function to check if two pincodes are within proximity
export function arePincodesInProximity(pincode1: string, pincode2: string): boolean {
  if (!pincode1 || !pincode2) return false;
  
  // Match first 4 digits for proximity within ~2-3km in most areas
  return pincode1.substring(0, 4) === pincode2.substring(0, 4);
}

// Enhanced function to handle address pincode extraction
export function extractPincodeFromAddress(address: string): string | null {
  if (!address) return null;
  
  // Normalize the address string to handle inconsistencies
  const normalizedAddress = address.trim().replace(/\s+/g, ' ');
  console.log("Extracting pincode from normalized address:", normalizedAddress);
  
  // Common pincode formats in India: 6 digits, sometimes with spaces or hyphens
  const pincodeRegex = /\b(\d{6})\b/;
  const match = normalizedAddress.match(pincodeRegex);
  
  if (match && match[1]) {
    console.log("Extracted pincode from address:", match[1]);
    return match[1].trim();
  }
  
  // Try an alternative pincode format (with hyphen or space)
  const altPincodeRegex = /\b(\d{3})[ -]?(\d{3})\b/;
  const altMatch = normalizedAddress.match(altPincodeRegex);
  
  if (altMatch && altMatch[1] && altMatch[2]) {
    const extractedPincode = (altMatch[1] + altMatch[2]).trim();
    console.log("Extracted alternative format pincode:", extractedPincode);
    return extractedPincode;
  }
  
  // If no specific pincode format is found, try to extract any 6-digit number
  const anyDigitsRegex = /\D(\d{6})\D/;
  const anyDigitsMatch = (` ${normalizedAddress} `).match(anyDigitsRegex); // Add spaces to ensure matching at boundaries
  
  if (anyDigitsMatch && anyDigitsMatch[1]) {
    const extractedPincode = anyDigitsMatch[1].trim();
    console.log("Extracted generic 6-digit number as pincode:", extractedPincode);
    return extractedPincode;
  }
  
  // No pincode found
  console.log("No pincode found in address:", normalizedAddress);
  return null;
}
