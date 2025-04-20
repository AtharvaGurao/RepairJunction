import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RepairRequest } from "@/types/repair";
import { statusDisplayMap } from "@/utils/repairUtils";

interface RequestCardProps {
  request: RepairRequest;
  onAccept: (requestId: number) => void;
}

export function RequestCard({ request, onAccept }: RequestCardProps) {
  // Determine the badge text and style based on status
  const getBadge = () => {
    if (request.status === 'pending_assignment') {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
          New Request
        </Badge>
      );
    } else if (request.status === 'pending_acceptance') {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
          Pending Acceptance
        </Badge>
      );
    } else if (request.status === 'assigned') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          Assigned
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
        {statusDisplayMap[request.repair_status] || request.repair_status}
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Request #{request.id}</CardTitle>
          {getBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="text-muted-foreground">Customer:</span> {request.customer_name}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Appliance:</span> {request.appliance_type}
          </p>
          {request.model_name && (
            <p className="text-sm">
              <span className="text-muted-foreground">Model:</span> {request.model_name}
            </p>
          )}
          {request.service_type && (
            <p className="text-sm">
              <span className="text-muted-foreground">Service Type:</span> {request.service_type === "home" ? "Home Visit" : "Pickup Service"}
            </p>
          )}
          {request.description && (
            <p className="text-sm">
              <span className="text-muted-foreground">Issue Description:</span> {request.description}
            </p>
          )}
          <p className="text-sm line-clamp-2">
            <span className="text-muted-foreground">Address:</span> {request.address}
          </p>
          <p className="text-sm text-muted-foreground">
            Received: {new Date(request.created_at).toLocaleDateString()}
          </p>
          {request.repair_status && (
            <p className="text-sm">
              <span className="text-muted-foreground">Status:</span> {statusDisplayMap[request.repair_status] || request.repair_status}
            </p>
          )}
        </div>
        
        {/* Show Accept button for pending requests */}
        {(request.status === 'pending_assignment' || request.status === 'pending_acceptance') && (
          <Button 
            className="w-full mt-4" 
            onClick={() => onAccept(request.id)}
          >
            Accept Request
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
