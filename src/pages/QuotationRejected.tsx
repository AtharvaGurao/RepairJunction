import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuotationRejected = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quotation Rejected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            You have declined the repair quotation. The repair request has been closed. Your appliance will be returned to your address shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotationRejected;