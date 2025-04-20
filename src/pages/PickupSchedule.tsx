import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PickupSchedule() {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSchedule = () => {
    toast({
      title: "Pickup Scheduled",
      description: `Pickup has been scheduled for ${date?.toLocaleDateString()}`,
    });
    navigate(`/technician/requests/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Schedule Pickup - Request #{id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
            {/* Customer details would be fetched and displayed here */}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Calendar View</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border mx-auto"
            />
          </div>

          <Button onClick={handleSchedule} className="w-full">
            Schedule
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}