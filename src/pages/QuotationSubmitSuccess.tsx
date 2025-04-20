
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const QuotationSubmitSuccess = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle>Quotation Submitted Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your quotation for repair request #{id} has been submitted successfully. 
            The customer will be notified and can approve or reject the quotation.
          </p>
          <p className="text-muted-foreground">
            You will be notified when the customer responds to your quotation.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link to="/technician/requests">
              <Button variant="outline">View All Requests</Button>
            </Link>
            <Link to="/technician/quotations">
              <Button>View Quotations</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotationSubmitSuccess;
