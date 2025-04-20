
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { RepairRequest } from "@/types/repair";
import { 
  fetchPendingRequests,
  fetchAssignedRequests,
  fetchTechnicianPincode, 
  acceptRepairRequest 
} from "@/api/technicianRequestsApi";
import { getAllMatchingRequests } from "@/utils/addressMatchingUtils";

export function useTechnicianRequests() {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [technicianPincode, setTechnicianPincode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      console.log("Fetching technician requests...");
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        console.log("No active session found");
        setLoading(false);
        return;
      }
      
      // First fetch the technician's pincode
      const pincode = await fetchTechnicianPincode(session.session.user.id);
      setTechnicianPincode(pincode);
      
      // If no pincode, early return
      if (!pincode) {
        console.log("No technician pincode found - please update your profile");
        toast({
          title: "Profile Incomplete",
          description: "Please add your pincode in your profile to see matching requests",
        });
        setLoading(false);
        return;
      }
      
      // Get all pending requests
      const pendingRequests = await fetchPendingRequests();
      console.log(`Technician pincode: ${pincode}, Total pending requests found: ${pendingRequests.length || 0}`);
      
      // Get recently assigned requests to this technician (last 24 hours)
      const assignedRequests = await fetchAssignedRequests(session.session.user.id);
      
      // Use our enhanced matching function to find all relevant requests
      let matchingRequests = getAllMatchingRequests(pendingRequests, pincode);
      
      // Combine pending and recently assigned requests
      const allRequests = [...matchingRequests, ...assignedRequests];
      console.log("Final combined requests:", allRequests.length);
      
      setRequests(allRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to load repair requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (requestId: number) => {
    try {
      console.log(`Accepting request #${requestId}...`);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to accept a request",
          variant: "destructive",
        });
        return;
      }
      
      await acceptRepairRequest(requestId, session.session.user.id);
      
      toast({
        title: "Request Accepted",
        description: "You have successfully accepted this repair request.",
      });
      
      // Update the request in the UI by changing its status
      setRequests(requests.map(request => 
        request.id === requestId 
          ? { ...request, status: 'assigned', repair_status: 'request_accepted' }
          : request
      ));
      
    } catch (error) {
      console.error('Error accepting request:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to accept request";
      
      toast({
        title: "Error",
        description: errorMessage === "Maximum requests reached" 
          ? "You have reached your maximum number of active requests" 
          : "Failed to accept request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    requests,
    loading,
    technicianPincode,
    acceptRequest,
    fetchRequests // Export fetchRequests so we can manually refresh
  };
}
