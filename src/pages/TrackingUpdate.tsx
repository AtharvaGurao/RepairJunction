
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface RepairRequest {
  id: number;
  repair_status: string;
  customer_name: string;
  appliance_type: string;
  service_type: string;
  address: string;
}

const statusOptions = [
  { value: "request_accepted", label: "Request Accepted" },
  { value: "pickup_scheduled", label: "Pickup Scheduled" },
  { value: "diagnosis_inspection", label: "Diagnosis and Initial Inspection" },
  { value: "quotation_shared", label: "Service Quotation Shared" },
  { value: "quotation_accepted", label: "Service Quotation Accepted" },
  { value: "repair_in_progress", label: "Repair In Progress" },
  { value: "quality_check", label: "Quality Check" },
  { value: "ready_for_delivery", label: "Ready for Delivery" },
  { value: "delivered", label: "Delivered" }
];

const statusSteps = {
  request_submitted: { text: "Request Submitted", step: 0 },
  request_accepted: { text: "Request Accepted", step: 1 },
  pickup_scheduled: { text: "Pickup Scheduled", step: 2 },
  diagnosis_inspection: { text: "Diagnosis and Initial Inspection", step: 3 },
  quotation_shared: { text: "Service Quotation Shared", step: 4 },
  quotation_accepted: { text: "Service Quotation Accepted", step: 5 },
  repair_in_progress: { text: "Repair In Progress", step: 6 },
  quality_check: { text: "Quality Check", step: 7 },
  ready_for_delivery: { text: "Ready for Delivery", step: 8 },
  delivered: { text: "Delivered", step: 9 }
};

export default function TrackingUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [statusHistory, setStatusHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;
      
      try {
        // Get the repair request
        const { data, error } = await supabase
          .from('repair_requests')
          .select('id, repair_status, customer_name, appliance_type, service_type, address')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setRequest(data);
          setSelectedStatus(data.repair_status);
          
          // Get status history for this request
          const { data: historyData, error: historyError } = await supabase
            .from('repair_status_history')
            .select('status, changed_at')
            .eq('repair_request_id', id)
            .order('changed_at', { ascending: true });
            
          if (historyError) throw historyError;
          
          if (historyData) {
            setStatusHistory(historyData);
          }
        }
      } catch (error) {
        console.error('Error fetching request data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch request data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequest();
  }, [id, toast]);

  const handleUpdate = async () => {
    if (!id || !selectedStatus) return;
    
    setUpdating(true);
    try {
      // Critical change: Ensure consistent status values and add completion_date when delivered
      const isCompleted = selectedStatus === 'delivered';
      const updateData = { 
        repair_status: selectedStatus,
        // Explicitly set status to 'completed' when delivered to ensure trigger fires
        status: isCompleted ? 'completed' : 
               (selectedStatus === 'repair_in_progress' ? 'in_progress' : 'assigned')
      };
      
      // Add completion_date when marking as delivered/completed
      if (isCompleted) {
        Object.assign(updateData, { 
          completion_date: new Date().toISOString() 
        });
      }

      console.log("Updating repair request:", updateData);
      
      const { error } = await supabase
        .from('repair_requests')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      if (isCompleted) {
        // Get technician ID and update active request count for verification
        const { data: requestData } = await supabase
          .from('repair_requests')
          .select('technician_id')
          .eq('id', id)
          .single();
          
        if (requestData?.technician_id) {
          console.log("Checking technician profile after completion:", requestData.technician_id);
          // Get updated count (should be decremented by trigger)
          const { data: techData } = await supabase
            .from('profiles')
            .select('active_request_count, can_receive_requests')
            .eq('id', requestData.technician_id)
            .single();
            
          console.log("Updated technician data:", techData);
        }
      }

      toast({
        title: "Status Updated",
        description: "The repair request status has been updated successfully"
      });

      navigate(`/technician/tracking/${id}/success`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update tracking status",
        variant: "destructive",
      });
      setUpdating(false);
    }
  };

  // Calculate current progress
  const getCurrentProgress = () => {
    if (!request?.repair_status) return 0;
    const currentStep = statusSteps[request.repair_status as keyof typeof statusSteps]?.step || 0;
    return (currentStep / (Object.keys(statusSteps).length - 1)) * 100;
  };

  // Get available next statuses
  const getNextStatusOptions = () => {
    if (!request?.repair_status) return statusOptions;
    
    const currentStep = statusSteps[request.repair_status as keyof typeof statusSteps]?.step || 0;
    
    return statusOptions.filter(option => {
      const optionStep = statusSteps[option.value as keyof typeof statusSteps]?.step || 0;
      // Allow setting current status or one step ahead (not allow skipping steps)
      return optionStep <= currentStep + 1;
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Loading request data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Request #{id}</span>
            {request && (
              <span className="text-sm font-normal text-muted-foreground">
                Current Status: {statusSteps[request.repair_status as keyof typeof statusSteps]?.text || "Unknown"}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {request && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Customer:</span> {request.customer_name}
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span> {request.appliance_type}
                </div>
                <div>
                  <span className="text-muted-foreground">Service:</span> {request.service_type === 'home' ? 'Home Service' : 'Pickup Service'}
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground">Address:</span> {request.address}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Current Progress:</p>
                <Progress value={getCurrentProgress()} className="h-2" />
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">Update Repair Status:</h3>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getNextStatusOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: You can only update to the current status or the next step in the repair process.
                </p>
              </div>

              {statusHistory.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Status History:</h3>
                  <div className="space-y-2">
                    {statusHistory.map((history, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between text-sm border-l-2 border-primary pl-3 py-1"
                      >
                        <span>
                          {statusSteps[history.status as keyof typeof statusSteps]?.text || history.status}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(history.changed_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button onClick={handleUpdate} disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
