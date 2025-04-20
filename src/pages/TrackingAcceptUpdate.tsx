
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Loader2 } from "lucide-react";

// Map steps to display
const acceptedSteps = [
  "Request Accepted",
  "Pickup Scheduled",
  "Diagnosis and Initial Inspection",
  "Service Quotation Accepted",
  "Repair Process Begins",
  "Quality Check",
  "Ready for Delivery"
];

export default function TrackingAcceptUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<any>(null);
  const [pickupDate, setPickupDate] = useState<Date | undefined>(
    (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1); // Set default to tomorrow
      return date;
    })()
  );

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('repair_requests')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setRequest(data);
      } catch (error) {
        console.error('Error fetching request:', error);
      }
    };
    
    fetchRequest();
  }, [id]);

  const handleUpdate = async () => {
    if (!id || !pickupDate) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('repair_requests')
        .update({ 
          repair_status: 'repair_in_progress',
          status: 'in_progress',
          scheduled_pickup_datetime: pickupDate.toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Repair Started",
        description: `The repair process has been started for request #${id}`
      });

      navigate(`/technician/tracking/${id}/success`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Start Repair - Request #{id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h3 className="font-medium text-green-800 mb-2">Quotation Accepted!</h3>
            <p className="text-sm text-green-700">
              The customer has accepted the quotation for this repair request. 
              You can now schedule a pickup/visit and begin the repair process.
            </p>
          </div>
          
          {request && request.service_type === "home" && (
            <div>
              <h3 className="font-medium mb-3">Schedule Service Visit:</h3>
              <Calendar
                mode="single"
                selected={pickupDate}
                onSelect={setPickupDate}
                disabled={(date) => {
                  // Can't select dates in the past
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                className="rounded-md border mx-auto"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Select a date for your service visit to the customer's location.
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <h3 className="font-medium">Repair Process Steps:</h3>
            <div className="space-y-4">
              {acceptedSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1 border-l-2 border-primary pl-4 pb-6">
                    <p className="text-sm font-medium">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Start Repair Process"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
