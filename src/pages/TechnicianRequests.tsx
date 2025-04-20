import { useState, useEffect } from "react";
import { RequestsList } from "@/components/technician/RequestsList";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RepairRequest } from "@/types/repair";
import { supabase } from "@/lib/supabase";

export default function TechnicianRequests() {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [technicianPincode, setTechnicianPincode] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch technician data including pincode
  useEffect(() => {
    const fetchTechnicianData = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;
        
        const { data: techData } = await supabase
          .from('profiles')
          .select('pincode, active_request_count')
          .eq('id', session.session.user.id)
          .single();
          
        if (techData) {
          setTechnicianPincode(techData.pincode);
          console.log(`Technician has ${techData.active_request_count || 0} active requests`);
        }
      } catch (error) {
        console.error("Error fetching technician data:", error);
      }
    };

    fetchTechnicianData();
  }, []);

  // Fetch requests from our edge function
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast({
          title: "Not authenticated",
          description: "Please login to view repair requests",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("Invoking edge function with technician ID:", session.session.user.id);
      const response = await supabase.functions.invoke('fetch-repair-requests', {
        body: { technician_id: session.session.user.id },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch repair requests');
      }
      
      if (response.data && response.data.requests) {
        setRequests(response.data.requests);
        console.log(`Loaded ${response.data.requests.length} requests (${response.data.pending_count} pending, ${response.data.assigned_count} assigned)`);
      } else {
        setRequests([]);
      }
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

  // Initial fetch
  useEffect(() => {
    fetchRequests();
    
    // Add message listener for quotation updates
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'REQUESTS_UPDATED') {
        setRequests(event.data.requests);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const acceptRequest = async (requestId: number) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to accept a request",
          variant: "destructive",
        });
        return;
      }
      
      // Always fetch the latest technician data to ensure we have the current count
      const { data: techData, error: profileError } = await supabase
        .from('profiles')
        .select('active_request_count, can_receive_requests')
        .eq('id', session.session.user.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching technician profile:", profileError);
        toast({
          title: "Error",
          description: "Could not verify your current request count",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Current technician data before accepting request:", techData);
      
      if (!techData?.can_receive_requests || (techData.active_request_count >= 3)) {
        toast({
          title: "Maximum Requests Reached",
          description: "You have reached your maximum number of active requests (3). Complete existing requests before claiming new ones.",
          variant: "destructive",
        });
        return;
      }
      
      // Accept the request - update both status and repair_status
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
      const { error: countError } = await supabase
        .from('profiles')
        .update({ 
          active_request_count: (techData.active_request_count || 0) + 1,
          can_receive_requests: ((techData.active_request_count || 0) + 1) < 3
        })
        .eq('id', session.session.user.id);
        
      if (countError) throw countError;
      
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

      // Refresh data after a short delay to ensure database updates are reflected
      setTimeout(fetchRequests, 1000);
      
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Request Management</h1>
        <div className="flex items-center gap-4">
          {technicianPincode && (
            <div className="text-sm text-muted-foreground">
              Your service area: <span className="font-medium">{technicianPincode}</span>
            </div>
          )}
          <Button onClick={fetchRequests} variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <RequestsList 
        requests={requests}
        loading={loading}
        onAcceptRequest={acceptRequest}
      />
    </div>
  );
}
