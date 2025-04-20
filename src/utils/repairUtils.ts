
// Map status to display text
export const statusDisplayMap: Record<string, string> = {
  request_submitted: "Request Submitted",
  request_accepted: "Request Accepted",
  pending_assignment: "Pending Assignment",
  pending_acceptance: "Pending Acceptance",
  assigned: "Assigned to Technician",
  pickup_scheduled: "Pickup Scheduled",
  diagnosis_inspection: "Diagnosis in Progress",
  quotation_shared: "Quotation Shared",
  quotation_accepted: "Quotation Accepted",
  repair_in_progress: "Repair in Progress",
  quality_check: "Quality Check",
  ready_for_delivery: "Ready for Delivery",
  delivered: "Delivered"
};

// Helper function to get the appropriate display text for a status
export function getStatusDisplayText(status: string): string {
  return statusDisplayMap[status] || status;
}

// Helper function to log repair request data for debugging
export function logRepairRequest(request: any, label: string = "Repair Request"): void {
  console.log(`[DEBUG] ${label}:`, {
    id: request.id,
    status: request.status,
    repair_status: request.repair_status,
    address: request.address,
    service_type: request.service_type,
    model_name: request.model_name,
    created_at: request.created_at
  });
}

// Helper function to check pincode matches for debugging
export function checkPincodeMatch(address: string, technicianPincode: string): {matched: boolean, method: string, extractedPincode?: string} {
  if (!address || !technicianPincode) {
    return { matched: false, method: "no_data" };
  }
  
  // Try exact match first
  const pincodeRegex = /\b(\d{6})\b/;
  const match = address.match(pincodeRegex);
  
  if (match && match[1]) {
    const extractedPincode = match[1];
    if (extractedPincode === technicianPincode) {
      return { matched: true, method: "exact", extractedPincode };
    }
  }
  
  // Try string contains
  if (address.includes(technicianPincode)) {
    return { matched: true, method: "contains", extractedPincode: technicianPincode };
  }
  
  // Try prefix match
  const prefix = technicianPincode.substring(0, 3);
  const extractedForPrefix = match && match[1] ? match[1] : null;
  
  if (extractedForPrefix && extractedForPrefix.startsWith(prefix)) {
    return { matched: true, method: "prefix", extractedPincode: extractedForPrefix };
  }
  
  return { matched: false, method: "no_match", extractedPincode: match && match[1] ? match[1] : undefined };
}
