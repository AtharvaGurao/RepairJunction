
import { supabase } from "@/lib/supabase";

/**
 * Accepts a repair request by assigning it to a technician
 */
export async function acceptRepairRequest(requestId: number, technicianId: string): Promise<void> {
  console.log(`Attempting to assign request #${requestId} to technician ${technicianId}`);
  
  // Check if technician can receive more requests
  const { data: techData, error: techError } = await supabase
    .from('profiles')
    .select('active_request_count, can_receive_requests')
    .eq('id', technicianId)
    .single();
  
  if (techError) {
    console.error("Error checking technician capacity:", techError);
    throw techError;
  }
    
  if (!techData?.can_receive_requests) {
    console.error("Technician cannot receive more requests");
    throw new Error("Maximum requests reached");
  }
  
  // Accept the request - update status
  const { error: updateError } = await supabase
    .from('repair_requests')
    .update({ 
      technician_id: technicianId,
      status: 'assigned',
      repair_status: 'request_accepted'
    })
    .eq('id', requestId);
    
  if (updateError) {
    console.error("Error updating request status:", updateError);
    throw updateError;
  }
  
  // Increment the technician's active request count
  const { error: countError } = await supabase
    .from('profiles')
    .update({ 
      active_request_count: (techData?.active_request_count || 0) + 1 
    })
    .eq('id', technicianId);
    
  if (countError) {
    console.error("Error updating technician's active request count:", countError); 
    throw countError;
  }
  
  console.log(`Successfully assigned request #${requestId} to technician ${technicianId}`);
}
