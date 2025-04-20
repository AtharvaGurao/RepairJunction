
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function TrackingUpdateSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle>Status Updated Successfully</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            The repair status for Request #{id} has been successfully updated. 
            The customer will be notified of this update.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button onClick={() => navigate("/technician/tracking")}>
              Return to Tracking Management
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
