
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  repairStatus: string;
}

export function RepairStatusBadge({ status, repairStatus }: StatusBadgeProps) {
  // First check the repair_status
  if (repairStatus) {
    switch (repairStatus) {
      case 'request_submitted':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">New Request</Badge>;
      case 'request_accepted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Accepted</Badge>;
      case 'pickup_scheduled':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">Pickup Scheduled</Badge>;
      case 'diagnosis_inspection':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Diagnosis</Badge>;
      case 'quotation_shared':
        return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-300">Quotation Shared</Badge>;
      case 'quotation_accepted':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">Quotation Accepted</Badge>;
      case 'repair_in_progress':
        return <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-300">In Progress</Badge>;
      case 'quality_check':
        return <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-300">Quality Check</Badge>;
      case 'ready_for_delivery':
        return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-300">Ready for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Completed</Badge>;
      default:
        break;
    }
  }
  
  // Fall back to the legacy status field if needed
  switch (status) {
    case 'pending_assignment':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">Pending Assignment</Badge>;
    case 'assigned':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Assigned</Badge>;
    case 'in_progress':
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">In Progress</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Completed</Badge>;
    case 'quotation_accepted':
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">Quotation Accepted</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
