
import { supabase } from "@/lib/supabase";

type AutoAssignResult = {
  success: boolean;
  assigned: boolean;
  message: string;
  technician?: any;
}

/**
 * Attempts to find eligible technicians and auto-assign a request
 */
export async function autoAssignRequestToTechnician(
  requestId: number, 
  addressPincode: string,
  city?: string,
  state?: string
): Promise<AutoAssignResult> {
  try {
    console.log(`Auto-assignment: Starting for request #${requestId} with location:`, {
      pincode: addressPincode,
      city,
      state
    });
    
    if (!addressPincode && !city && !state) {
      console.log("Auto-assignment: No location data provided, cannot match technicians");
      return { success: true, assigned: false, message: "No location data available for matching" };
    }
    
    // Find matching technician
    const { data: matchingTechnicians, error: techError } = await supabase
      .from('profiles')
      .select('id, full_name, phone_number, active_request_count, pincode, city_town, state')
      .eq('role', 'technician')
      .eq('can_receive_requests', true)
      .eq('pincode', addressPincode)
      .order('active_request_count', { ascending: true })
      .limit(1);
    
    if (techError) {
      console.error("Auto-assignment: Error finding technicians by pincode:", techError);
      return { success: false, assigned: false, message: "Error finding technicians" };
    }
    
    if (!matchingTechnicians || matchingTechnicians.length === 0) {
      console.log("Auto-assignment: No available technician found for this area");
      return { success: true, assigned: false, message: "No available technician found for this area" };
    }
    
    const technician = matchingTechnicians[0];
    
    // Assign the request to the found technician
    const { error: updateError } = await supabase
      .from('repair_requests')
      .update({ 
        technician_id: technician.id,
        status: 'assigned',
        repair_status: 'request_accepted'
      })
      .eq('id', requestId);
      
    if (updateError) {
      console.error("Auto-assignment: Error updating request:", updateError);
      return { success: false, assigned: false, message: "Error assigning request" };
    }
    
    // Update technician's request count
    const { error: countError } = await supabase
      .from('profiles')
      .update({ 
        active_request_count: (technician.active_request_count || 0) + 1,
        can_receive_requests: ((technician.active_request_count || 0) + 1) < 3
      })
      .eq('id', technician.id);
      
    if (countError) {
      console.error("Auto-assignment: Error updating technician count:", countError);
      return { success: false, assigned: false, message: "Error updating technician status" };
    }
    
    return { 
      success: true, 
      assigned: true, 
      technician: technician,
      message: "Request successfully assigned" 
    };
    
  } catch (error) {
    console.error("Auto-assignment: Unexpected error:", error);
    return { 
      success: false, 
      assigned: false, 
      message: "Internal error during assignment process" 
    };
  }
}
