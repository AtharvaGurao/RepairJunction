
import { RepairRequest } from "@/types/repair";
import { Loader2 } from "lucide-react";
import { RequestCard } from "./RequestCard";

interface RequestsListProps {
  requests: RepairRequest[];
  loading: boolean;
  onAcceptRequest: (requestId: number) => void;
}

export function RequestsList({ requests, loading, onAcceptRequest }: RequestsListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-muted-foreground text-lg">No new repair requests found in your service area</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((request) => (
        <RequestCard 
          key={request.id} 
          request={request} 
          onAccept={onAcceptRequest} 
        />
      ))}
    </div>
  );
}
