
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the JWT token
    const token = authHeader.replace("Bearer ", "");

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { technician_id } = await req.json();
    if (!technician_id) {
      return new Response(
        JSON.stringify({ error: "Missing technician_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching requests for technician: ${technician_id}`);

    // Get technician's pincode for location-based matching
    const { data: technicianData, error: technicianError } = await supabase
      .from("profiles")
      .select("pincode, city_town, state")
      .eq("id", technician_id)
      .single();
      
    if (technicianError) {
      console.error("Error fetching technician data:", technicianError);
    } else {
      console.log(`Technician pincode: ${technicianData?.pincode}, City: ${technicianData?.city_town}, State: ${technicianData?.state}`);
    }

    // First run auto-assignment for pending requests that match this technician's location
    if (technicianData?.pincode) {
      // Find all pending requests that match this technician's location
      const { data: pendingMatchingRequests, error: matchingError } = await supabase
        .from("repair_requests")
        .select("id, address")
        .eq("status", "pending_assignment")
        .is("technician_id", null);
        
      if (matchingError) {
        console.error("Error fetching matching requests:", matchingError);
      } else if (pendingMatchingRequests && pendingMatchingRequests.length > 0) {
        console.log(`Found ${pendingMatchingRequests.length} unassigned requests to check for auto-assignment`);
        
        // Check each request for pincode match
        for (const request of pendingMatchingRequests) {
          // Check if the request address contains the technician's pincode
          const requestAddress = request.address || "";
          const technicianPincode = technicianData.pincode;
          
          if (requestAddress.includes(technicianPincode)) {
            console.log(`Request #${request.id} matches technician ${technician_id}'s pincode ${technicianPincode}`);
            
            // Check if technician can receive more requests
            const { data: techData } = await supabase
              .from('profiles')
              .select('active_request_count, can_receive_requests')
              .eq('id', technician_id)
              .single();
              
            if (techData && techData.can_receive_requests) {
              console.log(`Technician ${technician_id} can receive more requests, current count: ${techData.active_request_count}`);
              
              // Auto-assign this request to the technician
              const { error: assignError } = await supabase
                .from('repair_requests')
                .update({ 
                  technician_id: technician_id,
                  status: 'assigned',
                  repair_status: 'request_accepted'
                })
                .eq('id', request.id);
                
              if (assignError) {
                console.error(`Error auto-assigning request #${request.id}:`, assignError);
              } else {
                // Increment the technician's active request count
                const newCount = (techData.active_request_count || 0) + 1;
                const canReceiveMore = newCount < 3; // Assuming MAX_ACTIVE_REQUESTS = 3
                
                await supabase
                  .from('profiles')
                  .update({ 
                    active_request_count: newCount,
                    can_receive_requests: canReceiveMore
                  })
                  .eq('id', technician_id);
                  
                console.log(`Successfully auto-assigned request #${request.id} to technician ${technician_id}`);
              }
            } else {
              console.log(`Technician ${technician_id} cannot receive more requests`);
            }
          }
        }
      }
    }

    // Fetch pending requests (that are not assigned to any technician)
    const { data: pendingRequests, error: pendingError } = await supabase
      .from("repair_requests")
      .select("id, status, repair_status, customer_name, created_at, appliance_type, address, service_type, model_name")
      .eq("status", "pending_assignment")
      .is("technician_id", null);

    if (pendingError) {
      console.error("Error fetching pending requests:", pendingError);
      return new Response(
        JSON.stringify({ error: "Error fetching pending requests" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch assigned requests (assigned to the current technician)
    const { data: assignedRequests, error: assignedError } = await supabase
      .from("repair_requests")
      .select("id, status, repair_status, customer_name, created_at, appliance_type, address, service_type, model_name")
      .eq("technician_id", technician_id)
      .eq("status", "assigned");

    if (assignedError) {
      console.error("Error fetching assigned requests:", assignedError);
      return new Response(
        JSON.stringify({ error: "Error fetching assigned requests" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Combine requests
    const allRequests = [...(pendingRequests || []), ...(assignedRequests || [])];
    console.log(`Returning ${allRequests.length} total requests`);

    return new Response(
      JSON.stringify({ 
        requests: allRequests,
        pending_count: pendingRequests?.length || 0,
        assigned_count: assignedRequests?.length || 0
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
