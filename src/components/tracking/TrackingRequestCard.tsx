
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RepairRequest } from "@/types/repair";
import { RepairStatusBadge } from "./RepairStatusBadge";
import { statusDisplayMap } from "@/utils/repairUtils";

interface TrackingRequestCardProps {
  request: RepairRequest;
  onClaimRequest: (requestId: number) => void;
  getUpdatePath: (request: RepairRequest) => string;
}

export function TrackingRequestCard({ 
  request, 
  onClaimRequest, 
  getUpdatePath 
}: TrackingRequestCardProps) {
  return (
    <Link 
      key={request.id} 
      to={getUpdatePath(request)}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Request #{request.id}</CardTitle>
            <RepairStatusBadge status={request.status} repairStatus={request.repair_status} />
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
            <p className="text-sm line-clamp-2">
              <span className="text-muted-foreground">Address:</span> {request.address}
            </p>
            <p className="text-sm text-muted-foreground">
              Received: {new Date(request.created_at).toLocaleDateString()}
            </p>
            {request.repair_status && (
              <p className="text-sm font-medium mt-2">
                Status: {statusDisplayMap[request.repair_status] || request.repair_status}
              </p>
            )}
          </div>
          
          {request.status === 'pending_assignment' && (
            <Button 
              variant="outline" 
              className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClaimRequest(request.id);
              }}
            >
              Claim Request
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
