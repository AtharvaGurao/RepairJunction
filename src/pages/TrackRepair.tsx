import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

// Map status to display text and step number
const statusSteps = {
  request_submitted: { text: "Request Submitted", step: 0 },
  request_accepted: { text: "Request Accepted", step: 1 },
  pickup_scheduled: { text: "Pickup Scheduled", step: 2 },
  diagnosis_inspection: { text: "Diagnosis and Initial Inspection", step: 3 },
  quotation_shared: { text: "Service Quotation Shared", step: 4 },
  quotation_accepted: { text: "Service Quotation Accepted", step: 5 },
  repair_in_progress: { text: "Repair Process Begins", step: 6 },
  quality_check: { text: "Quality Check", step: 7 },
  ready_for_delivery: { text: "Ready for Delivery", step: 8 },
  delivered: { text: "Delivered", step: 9 }
};

const TrackRepair = () => {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRepairRequests = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        toast({
          title: "Not logged in",
          description: "Please log in to view your repair requests",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('repair_requests')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      setRepairRequests(data || []);
    } catch (error) {
      console.error('Error fetching repair requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch repair requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairRequests();

    // Add event listener for repair status updates
    const handleStatusUpdate = (event: MessageEvent) => {
      if (event.data.type === 'REPAIR_STATUS_UPDATED') {
        fetchRepairRequests();
      }
    };

    window.addEventListener('message', handleStatusUpdate);
    return () => window.removeEventListener('message', handleStatusUpdate);
  }, []);

  // Calculate progress percentage based on repair status
  const getProgressPercentage = (status: string) => {
    const currentStep = statusSteps[status as keyof typeof statusSteps]?.step || 0;
    return (currentStep / (Object.keys(statusSteps).length - 1)) * 100;
  };

  return (
    <div className="section-container">
      <h1 className="text-3xl font-bold text-center mb-2">Track Your Repair</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Monitor the progress of your repair requests in real-time
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Loading your repair requests...</p>
        </div>
      ) : repairRequests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl font-medium mb-3">No repair requests found</p>
          <p className="text-muted-foreground mb-6">You haven't submitted any repair requests yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {repairRequests.map((request) => (
            <RepairRequestCard 
              key={request.id} 
              request={request} 
              getProgressPercentage={getProgressPercentage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RepairRequestCard = ({ 
  request, 
  getProgressPercentage 
}: { 
  request: any, 
  getProgressPercentage: (status: string) => number 
}) => {
  const currentStatus = request.repair_status || 'request_submitted';
  const currentStep = statusSteps[currentStatus as keyof typeof statusSteps]?.step || 0;
  const progressPercentage = getProgressPercentage(currentStatus);

  // Convert keys to array for rendering
  const steps = Object.entries(statusSteps).map(([key, value]) => ({
    key,
    ...value
  }));

  return (
    <Card className="border border-gray-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
        <CardTitle className="flex items-center">
          <span className="bg-primary/10 p-1 rounded-full mr-2">
            <Clock className="h-4 w-4 text-primary" />
          </span>
          {request.appliance_type}
        </CardTitle>
        <p className="text-sm text-muted-foreground">Repair ID: #{request.id}</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>{statusSteps[currentStatus as keyof typeof statusSteps]?.text}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="space-y-6 mt-6">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-start gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index <= currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={
                    index <= currentStep
                      ? "font-medium"
                      : "text-muted-foreground"
                  }
                >
                  {step.text}
                </p>
                {index <= currentStep && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {index === currentStep ? "In Progress" : "Completed"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <p className="text-sm font-medium">Request Details:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm">
            <div>
              <span className="text-muted-foreground">Model:</span> {request.model_name}
            </div>
            <div>
              <span className="text-muted-foreground">Type:</span> {request.service_type === 'home' ? 'Home Service' : 'Pickup Service'}
            </div>
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">Submitted:</span> {new Date(request.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackRepair;
