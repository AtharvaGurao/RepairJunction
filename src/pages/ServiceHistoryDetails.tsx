import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";

interface ServiceDetails {
  requestNumber: string;
  customerName: string;
  productType: string;
  serialNumber: string;
  modelName: string;
  purchaseDate: string;
  address: string;
  repairNotes: string;
  diagnosis: string;
  repairCost: string;
  partsCost: string;
  additionalCharges: string;
  totalCost: string;
}

const mockServiceDetails: ServiceDetails = {
  requestNumber: "10",
  customerName: "John Doe",
  productType: "Refrigerator",
  serialNumber: "XYZ-123",
  modelName: "ABC-456",
  purchaseDate: "2023-01-15",
  address: "123 Main Street, Anytown, USA",
  repairNotes: "Detailed explanation of the issue diagnosed",
  diagnosis: "Fan issue",
  repairCost: "$150.00",
  partsCost: "$75.00",
  additionalCharges: "$25.00",
  totalCost: "$250.00",
};

export default function ServiceHistoryDetails() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Service History - Request Number: {mockServiceDetails.requestNumber}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer and Appliance Details</h3>
            <div className="grid gap-4">
              <div>
                <p className="font-medium">Full Name:</p>
                <p className="text-muted-foreground">{mockServiceDetails.customerName}</p>
              </div>
              <div>
                <p className="font-medium">Product Type:</p>
                <p className="text-muted-foreground">{mockServiceDetails.productType}</p>
              </div>
              <div>
                <p className="font-medium">Serial Number:</p>
                <p className="text-muted-foreground">{mockServiceDetails.serialNumber}</p>
              </div>
              <div>
                <p className="font-medium">Model Name:</p>
                <p className="text-muted-foreground">{mockServiceDetails.modelName}</p>
              </div>
              <div>
                <p className="font-medium">Purchase Date:</p>
                <p className="text-muted-foreground">{mockServiceDetails.purchaseDate}</p>
              </div>
              <div>
                <p className="font-medium">Address:</p>
                <p className="text-muted-foreground">{mockServiceDetails.address}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold">Repair Notes Section</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-muted-foreground">{mockServiceDetails.repairNotes}</p>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold">Repair Quotation</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="font-medium">Diagnosis Fee:</p>
                <p className="text-muted-foreground">{mockServiceDetails.diagnosis}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Repair Cost:</p>
                <p className="text-muted-foreground">{mockServiceDetails.repairCost}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Parts Cost:</p>
                <p className="text-muted-foreground">{mockServiceDetails.partsCost}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Additional Charges:</p>
                <p className="text-muted-foreground">{mockServiceDetails.additionalCharges}</p>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <p className="font-bold">Total Cost:</p>
                <p className="font-bold">{mockServiceDetails.totalCost}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}