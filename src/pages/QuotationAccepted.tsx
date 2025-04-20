import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const QuotationAccepted = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quotation Accepted</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Thank you for accepting the quotation. The repair process has been initiated. You will receive updates on the progress in the Repair Status Tracker.
          </p>
          <div className="flex justify-center">
            <Link to="/services/track-repair">
              <Button>Go to Repair Tracker</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotationAccepted;