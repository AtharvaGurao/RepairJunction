
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading requests..." }: LoadingStateProps) {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No tracking requests found in your service area" }: EmptyStateProps) {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
}
