
import { RepairRequest } from "@/types/repair";
import { TrackingRequestCard } from "./TrackingRequestCard";
import { EmptyState, LoadingState } from "./TrackingListStates";

interface TrackingRequestsListProps {
  requests: RepairRequest[];
  loading: boolean;
  onClaimRequest: (requestId: number) => void;
  getUpdatePath: (request: RepairRequest) => string;
}

export function TrackingRequestsList({ 
  requests, 
  loading, 
  onClaimRequest, 
  getUpdatePath 
}: TrackingRequestsListProps) {
  if (loading) {
    return <LoadingState />;
  }

  if (requests.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((request) => (
        <TrackingRequestCard 
          key={request.id}
          request={request}
          onClaimRequest={onClaimRequest}
          getUpdatePath={getUpdatePath}
        />
      ))}
    </div>
  );
}
