import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";

const mockRequest = {
  id: 1,
  fullName: "John Doe",
  productType: "Refrigerator",
  serialNumber: "1234567890",
  modelName: "XYZ-123",
  purchaseDate: "2023-01-15",
  address: "123 Main Street, Anytown, USA",
  image: null,
};

export default function RequestDetails() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Request Number: {id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Details</h3>
            <div className="grid gap-4">
              <div>
                <p className="font-medium">Full Name:</p>
                <p className="text-muted-foreground">{mockRequest.fullName}</p>
              </div>
              <div>
                <p className="font-medium">Product Type:</p>
                <p className="text-muted-foreground">{mockRequest.productType}</p>
              </div>
              <div>
                <p className="font-medium">Serial Number/IMEI:</p>
                <p className="text-muted-foreground">{mockRequest.serialNumber}</p>
              </div>
              <div>
                <p className="font-medium">Model Name:</p>
                <p className="text-muted-foreground">{mockRequest.modelName}</p>
              </div>
              <div>
                <p className="font-medium">Purchase Date:</p>
                <p className="text-muted-foreground">{mockRequest.purchaseDate}</p>
              </div>
              <div>
                <p className="font-medium">Address:</p>
                <p className="text-muted-foreground">{mockRequest.address}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link to={`/technician/requests/${id}/pickup`}>
              <Button>Schedule Pickup</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}