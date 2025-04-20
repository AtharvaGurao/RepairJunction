
import { supabase } from "@/lib/supabase";
import { RepairRequest } from "@/types/repair";
import { logRepairRequest } from "@/utils/repairUtils";

/**
 * Fetches pending repair requests that are not yet assigned to any technician
 */
export async function fetchPendingRequests(): Promise<RepairRequest[]> {
  const { data: pendingData, error: pendingError } = await supabase
    .from('repair_requests')
    .select(`id, status, repair_status, customer_name, created_at, appliance_type, address, service_type, model_name`)
    .in('status', ['pending_assignment', 'pending_acceptance'])
    .order('created_at', { ascending: false });
  
  if (pendingError) {
    console.error("Error fetching pending repair requests:", pendingError);
    throw pendingError;
  }

  // Log all pending requests for debugging
  if (pendingData && pendingData.length > 0) {
    console.log(`Found ${pendingData.length} pending requests total`);
    pendingData.forEach(request => {
      logRepairRequest(request, "All pending requests");
    });
  } else {
    console.log("No pending requests found in the database");
  }
  
  return pendingData || [];
}

/**
 * Fetches recently assigned requests to a specific technician
 */
export async function fetchAssignedRequests(technicianId: string, days: number = 1): Promise<RepairRequest[]> {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - days);
  
  const { data: assignedData, error: assignedError } = await supabase
    .from('repair_requests')
    .select(`id, status, repair_status, customer_name, created_at, appliance_type, address, service_type, model_name`)
    .eq('technician_id', technicianId)
    .eq('status', 'assigned')
    .gt('created_at', pastDate.toISOString())
    .order('created_at', { ascending: false });
    
  if (assignedError) {
    console.error("Error fetching assigned requests:", assignedError);
    throw assignedError;
  }
  
  console.log("Recently assigned requests:", assignedData?.length || 0);
  return assignedData || [];
}
