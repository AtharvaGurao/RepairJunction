
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const SubmitSuccess = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle>Request Submitted Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your repair request has been submitted successfully. We will review it shortly
            and a technician will be assigned to your request.
          </p>
          <p className="text-muted-foreground">
            You will receive updates on the status of your repair request.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link to="/services">
              <Button variant="outline">View Services</Button>
            </Link>
            <Link to="/services/track-repair">
              <Button>Track Repair Status</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitSuccess;
