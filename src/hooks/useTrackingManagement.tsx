
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { RepairRequest } from "@/types/repair";

export function useTrackingManagement() {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [technicianPincode, setTechnicianPincode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) return;
      
      // First fetch the technician's pincode
      const { data: techData, error: techError } = await supabase
        .from('profiles')
        .select('pincode, active_request_count')
        .eq('id', session.session.user.id)
        .single();
        
      if (techError) throw techError;
      
      if (techData) {
        setTechnicianPincode(techData.pincode);
        console.log(`Technician active request count: ${techData.active_request_count}`);
      }

      // Then fetch ongoing repair requests assigned to this technician
      const { data: assignedRequests, error: assignedError } = await supabase
        .from('repair_requests')
        .select('id, status, repair_status, customer_name, created_at, appliance_type, address')
        .eq('technician_id', session.session.user.id)
        .neq('status', 'completed')  // Exclude completed requests
        .order('created_at', { ascending: false });

      if (assignedError) throw assignedError;
      
      // Get repair requests in the technician's pincode area that are pending assignment
      let pendingRequests: any[] = [];
      if (techData?.pincode) {
        console.log("Technician pincode for tracking:", techData.pincode);
        
        // Try first with the join approach
        const { data: pendingData, error: pendingError } = await supabase
          .from('repair_requests')
          .select(`
            id, status, repair_status, customer_name, created_at, appliance_type, address,
            addresses!inner(pincode)
          `)
          .eq('addresses.pincode', techData.pincode)
          .eq('status', 'pending_assignment')
          .is('technician_id', null)
          .order('created_at', { ascending: false });
          
        if (pendingError) {
          console.error("Error fetching pending requests:", pendingError);
        } else if (pendingData && pendingData.length > 0) {
          pendingRequests = pendingData.map(req => ({
            id: req.id,
            status: req.status,
            repair_status: req.repair_status,
            customer_name: req.customer_name,
            created_at: req.created_at,
            appliance_type: req.appliance_type,
            address: req.address
          }));
        } else {
          // If no results from join, try with address field containing pincode
          const { data: addressData, error: addressError } = await supabase
            .from('repair_requests')
            .select('id, status, repair_status, customer_name, created_at, appliance_type, address')
            .ilike('address', `%${techData.pincode}%`)
            .eq('status', 'pending_assignment')
            .is('technician_id', null)
            .order('created_at', { ascending: false });
            
          if (addressError) {
            console.error("Error with address search:", addressError);
          } else {
            console.log("Found requests by address in tracking:", addressData?.length || 0);
            pendingRequests = addressData || [];
          }
        }
      }
      
      // Combine assigned and pending requests
      console.log("Assigned ongoing requests:", assignedRequests?.length || 0);
      console.log("Pending requests:", pendingRequests.length);
      setRequests([...(assignedRequests || []), ...pendingRequests]);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to load tracking requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const claimRequest = async (requestId: number) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to claim a request",
          variant: "destructive",
        });
        return;
      }
      
      // Always fetch fresh technician data to ensure we have current counts
      const { data: techData, error: profileError } = await supabase
        .from('profiles')
        .select('active_request_count, can_receive_requests')
        .eq('id', session.session.user.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast({
          title: "Error",
          description: "Could not verify your current request count",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Current technician data before claiming:", techData);
      
      if (!techData?.can_receive_requests || (techData.active_request_count >= 3)) {
        toast({
          title: "Maximum Requests Reached",
          description: "You have reached your maximum number of active requests (3). Complete existing requests before claiming new ones.",
          variant: "destructive",
        });
        return;
      }
      
      // Claim the request - update both status and repair_status
      const { error: updateError } = await supabase
        .from('repair_requests')
        .update({ 
          technician_id: session.session.user.id,
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
          can_receive_requests: newCount < 3
        })
        .eq('id', session.session.user.id);
        
      if (countError) throw countError;
      
      toast({
        title: "Request Claimed",
        description: "You have successfully claimed this repair request.",
      });
      
      // Refresh the requests list
      fetchRequests();
      
    } catch (error) {
      console.error('Error claiming request:', error);
      toast({
        title: "Error",
        description: "Failed to claim request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUpdatePath = (request: RepairRequest) => {
    if (request.repair_status === 'quotation_accepted') {
      return `/technician/tracking/${request.id}/accept`;
    }
    return `/technician/tracking/${request.id}`;
  };

  return {
    requests,
    loading,
    technicianPincode,
    claimRequest,
    getUpdatePath,
    fetchRequests // Export fetchRequests so we can manually refresh
  };
}
