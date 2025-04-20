
import { useTrackingManagement } from "@/hooks/useTrackingManagement";
import { TrackingRequestsList } from "@/components/tracking/TrackingRequestsList";

export default function TrackingManagement() {
  const { 
    requests, 
    loading, 
    technicianPincode, 
    claimRequest,
    getUpdatePath 
  } = useTrackingManagement();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tracking Management</h1>
        {technicianPincode && (
          <div className="text-sm text-muted-foreground">
            Your service area: <span className="font-medium">{technicianPincode}</span>
          </div>
        )}
      </div>
      
      <TrackingRequestsList 
        requests={requests}
        loading={loading}
        onClaimRequest={claimRequest}
        getUpdatePath={getUpdatePath}
      />
    </div>
  );
}
