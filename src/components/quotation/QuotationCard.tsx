import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, AlertTriangle, FileText, Truck, CreditCard, Loader2 } from "lucide-react";
import { Quotation } from "@/types/repair";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuotationCardProps {
  quotation: Quotation;
  requestDetails: {
    description: string;
  };
  onAccept: (quotationId: string) => void;
  onReject: (quotationId: string) => void;
  isProcessing?: boolean;
  error?: string | null;
}

export function QuotationCard({ 
  quotation, 
  requestDetails, 
  onAccept, 
  onReject,
  isProcessing,
  error 
}: QuotationCardProps) {
  const totalCost = (
    Number(quotation.diagnosis_fee) +
    Number(quotation.repair_cost) +
    (Number(quotation.part_cost) || 0) +
    (Number(quotation.additional_charges) || 0)
  );

  return (
    <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="text-primary w-5 h-5" />
            <CardTitle>Repair Quotation</CardTitle>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            quotation.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
            quotation.status === 'accepted' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {quotation.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Quote #REP-{quotation.request_id}</p>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="bg-primary/10 p-1 rounded mr-2">
              <Truck className="text-primary w-4 h-4" />
            </span>
            Appliance Details
          </h3>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              <span className="font-medium">Appliance Type:</span> {quotation.appliance_type}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium">Request ID:</span> {quotation.request_id}
            </p>
            {requestDetails?.description && (
              <p className="text-muted-foreground">
                <span className="font-medium">Issue Description:</span> {requestDetails.description}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="bg-primary/10 p-1 rounded mr-2">
              <AlertTriangle className="text-accent w-4 h-4" />
            </span>
            Technician's Notes
          </h3>
          <p className="text-muted-foreground p-4 border border-gray-200 rounded-lg bg-gray-50">
            {quotation.repair_notes}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <span className="bg-primary/10 p-1 rounded mr-2">
              <CreditCard className="text-primary w-4 h-4" />
            </span>
            Cost Breakdown
          </h3>
          
          <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Diagnosis Fee</span>
              <span className="font-medium">₹{quotation.diagnosis_fee.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Repair Cost</span>
              <span className="font-medium">₹{quotation.repair_cost.toFixed(2)}</span>
            </div>

            {quotation.part_name && quotation.part_cost && (
              <>
                <div className="text-sm font-medium py-2 border-b text-muted-foreground">
                  Parts Replacement:
                </div>
                <div className="flex justify-between pl-4 py-1">
                  <span className="text-sm text-muted-foreground">• {quotation.part_name}</span>
                  <span className="font-medium">₹{quotation.part_cost.toFixed(2)}</span>
                </div>
              </>
            )}

            {quotation.additional_charges > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Additional Charges</span>
                <span className="font-medium">₹{quotation.additional_charges.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between py-3 mt-2 bg-gray-50 rounded-md px-2 font-bold">
              <span className="text-muted-foreground">Total Cost</span>
              <span className="text-primary">₹{totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {quotation.status === 'pending_approval' && (
          <div className="flex gap-4 justify-end pt-4">
            <Button 
              variant="outline" 
              onClick={() => onReject(quotation.id)}
              disabled={isProcessing}
              className="border-red-300 hover:bg-red-50 hover:text-red-600 hover:border-red-400"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <X className="w-4 h-4 mr-1" />
              )}
              Reject Quotation
            </Button>
            <Button 
              onClick={() => onAccept(quotation.id)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-1" />
              )}
              Accept Quotation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 