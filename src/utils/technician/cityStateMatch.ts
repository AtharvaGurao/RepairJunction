
import { supabase } from "@/lib/supabase";

/**
 * Find technician by city and state match
 */
export async function findTechnicianByCityState(city: string, state: string) {
  if (!city || !state) {
    console.log("Missing city or state for location match");
    return null;
  }
  
  console.log(`Searching for technician in ${city}, ${state}`);
  
  const { data: techniciansByCityState, error: cityStateError } = await supabase
    .from('profiles')
    .select('id, full_name, phone_number, active_request_count, pincode, city_town, state')
    .eq('role', 'technician')
    .eq('can_receive_requests', true)
    .eq('city_town', city)
    .eq('state', state)
    .order('active_request_count', { ascending: true })
    .limit(1);
    
  if (cityStateError) {
    console.error("Error in city/state match query:", cityStateError);
    throw cityStateError;
  }
  
  if (techniciansByCityState && techniciansByCityState.length > 0) {
    console.log("Found technician with city/state match:", techniciansByCityState[0].id);
    return techniciansByCityState[0];
  }
  
  return null;
}
