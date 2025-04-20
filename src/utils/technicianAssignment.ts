
import { supabase } from "@/lib/supabase";
import { MAX_ACTIVE_REQUESTS } from "./technicianConstants";
import { findTechnicianByPincode } from "./technicianLookup";

export async function assignRequestToTechnician(requestId: number, technicianId: string) {
  try {
    // First check the technician's current workload
    const { data: techData, error: techError } = await supabase
      .from('profiles')
      .select('active_request_count, can_receive_requests')
      .eq('id', technicianId)
      .single();
      
    if (techError) throw techError;
    
    // If technician has reached their limit, return false
    if (techData && (techData.active_request_count >= MAX_ACTIVE_REQUESTS || !techData.can_receive_requests)) {
      return { success: false, message: "Technician has reached their maximum request limit" };
    }
    
    // Update the request to assign it to the technician
    const { error: updateError } = await supabase
      .from('repair_requests')
      .update({ 
        technician_id: technicianId,
        status: 'assigned',
        repair_status: 'request_accepted'
      })
      .eq('id', requestId);
      
    if (updateError) throw updateError;
    
    // Increment the technician's active request count
    const newCount = (techData?.active_request_count || 0) + 1;
    const { error: countError } = await supabase
      .from('profiles')
      .update({ 
        active_request_count: newCount,
        can_receive_requests: newCount < MAX_ACTIVE_REQUESTS
      })
      .eq('id', technicianId);
      
    if (countError) throw countError;
    
    return { success: true };
  } catch (error) {
    console.error("Error assigning request:", error);
    return { success: false, message: "Failed to assign request" };
  }
}

export async function completeOrCancelRequest(requestId: number, technicianId: string) {
  try {
    // Update the request status
    const { error: updateError } = await supabase
      .from('repair_requests')
      .update({ status: 'completed' })
      .eq('id', requestId)
      .eq('technician_id', technicianId);
      
    if (updateError) throw updateError;
    
    // Get current count
    const { data: techData, error: techError } = await supabase
      .from('profiles')
      .select('active_request_count')
      .eq('id', technicianId)
      .single();
      
    if (techError) throw techError;
    
    // Decrement the technician's active request count
    const newCount = Math.max(0, (techData?.active_request_count || 1) - 1);
    const { error: countError } = await supabase
      .from('profiles')
      .update({ 
        active_request_count: newCount,
        can_receive_requests: true // Always set to true when completing a request
      })
      .eq('id', technicianId);
      
    if (countError) throw countError;
    
    return { success: true };
  } catch (error) {
    console.error("Error completing request:", error);
    return { success: false, message: "Failed to complete request" };
  }
}

export async function autoAssignTechnicianToRequest(requestId: number, addressPincode: string, city?: string, state?: string) {
  try {
    console.log(`Attempting to auto-assign request #${requestId} for location: pincode='${addressPincode}', city='${city}', state='${state}'`);
    
    // Normalize inputs to prevent matching issues
    const normalizedPincode = addressPincode ? addressPincode.trim() : addressPincode;
    const normalizedCity = city ? city.trim() : city;
    const normalizedState = state ? state.trim() : state;
    
    console.log("Normalized location values for lookup:", {
      pincode: normalizedPincode, 
      city: normalizedCity, 
      state: normalizedState
    });
    
    // Verify the request exists and is valid for assignment
    const { data: requestData, error: requestError } = await supabase
      .from('repair_requests')
      .select('id, status')
      .eq('id', requestId)
      .single();
      
    if (requestError) {
      console.error("Error retrieving request data:", requestError);
      return { success: false, message: "Error retrieving request data" };
    }
    
    if (!requestData) {
      console.error("Request not found with ID:", requestId);
      return { success: false, message: "Request not found" };
    }
    
    console.log("Request status before assignment:", requestData.status);
    
    // Find an available technician using enhanced location matching
    const { success, technician } = await findTechnicianByPincode(
      normalizedPincode, 
      normalizedCity, 
      normalizedState
    );
    
    if (!success) {
      console.error("Error finding technician");
      return { success: false, message: "Error in technician lookup" };
    }
    
    if (!technician) {
      console.log("No available technician found for this area");
      return { success: true, assigned: false, message: "No available technician found" };
    }
    
    console.log("Found technician to assign:", {
      id: technician.id,
      name: technician.full_name,
      pincode: technician.pincode,
      city: technician.city_town,
      state: technician.state
    });
    
    // Assign the request to the found technician
    const result = await assignRequestToTechnician(requestId, technician.id);
    
    if (!result.success) {
      return { success: false, assigned: false, message: result.message };
    }
    
    console.log(`Successfully assigned request #${requestId} to technician ${technician.id}`);
    return { 
      success: true, 
      assigned: true, 
      technician: technician,
      message: "Request successfully assigned" 
    };
  } catch (error) {
    console.error("Error in auto-assignment process:", error);
    return { success: false, assigned: false, message: "Internal error during assignment process" };
  }
}
