import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Quotation as QuotationType } from "@/types/repair";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { QuotationCard } from "@/components/quotation/QuotationCard";

interface RequestDetails {
  description: string;
  id: number;
}

export default function QuotationApproval() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotations, setQuotations] = useState<QuotationType[]>([]);
  const [requestDetails, setRequestDetails] = useState<Record<number, RequestDetails>>({});
  const [processingQuotations, setProcessingQuotations] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) {
          throw new Error("Not authenticated");
        }

        // Fetch all pending quotations for the user
        const { data: quotationsData, error: quotationsError } = await supabase
          .from('quotations')
          .select('*')
          .eq('status', 'pending_approval')
          .order('created_at', { ascending: false });

        if (quotationsError) throw quotationsError;

        if (quotationsData) {
          // Filter out any quotations that are already accepted or rejected
          const validQuotations = quotationsData.filter(q => 
            q.status === 'pending_approval' && 
            !['accepted', 'rejected'].includes(q.status)
          );
          
          setQuotations(validQuotations);
          
          // Fetch request details for all valid quotations
          const requestIds = validQuotations.map(q => q.request_id);
          if (requestIds.length > 0) {
            const { data: requestsData, error: requestsError } = await supabase
              .from('repair_requests')
              .select('id, description')
              .in('id', requestIds);

            if (requestsError) throw requestsError;

            if (requestsData) {
              const detailsMap = requestsData.reduce((acc, req) => {
                acc[req.id] = req;
                return acc;
              }, {} as Record<number, RequestDetails>);
              setRequestDetails(detailsMap);
            }
          } else {
            setRequestDetails({});
          }
        }
      } catch (error: any) {
        console.error('Error fetching quotations:', error);
        setError(error.message || "Failed to load quotations");
        toast({
          title: "Error",
          description: error.message || "Failed to load quotations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [toast]);

  const handleAcceptQuotation = async (quotationId: string) => {
    const quotation = quotations.find(q => q.id === quotationId);
    if (!quotation) {
      toast({
        title: "Error",
        description: "Quotation not found",
        variant: "destructive",
      });
      return;
    }

    setProcessingQuotations(prev => new Set(prev).add(quotationId));
    
    try {
      // First update repair_requests table
      const { error: requestUpdateError } = await supabase
        .from('repair_requests')
        .update({ 
          status: 'in_progress',
          repair_status: 'repair_in_progress'
        })
        .eq('id', quotation.request_id);
        
      if (requestUpdateError) throw requestUpdateError;

      // Then update quotations table
      const { error: quotationUpdateError } = await supabase
        .from('quotations')
        .update({ status: 'accepted' })
        .eq('id', quotationId);
        
      if (quotationUpdateError) {
        console.error('Quotation update error:', quotationUpdateError);
        throw quotationUpdateError;
      }

      // Update local state by removing the accepted quotation
      setQuotations(prev => prev.filter(q => q.id !== quotationId));
      
      toast({
        title: "Quotation Accepted",
        description: "The repair request has been initiated.",
      });

      // Notify parent component to refresh
      window.postMessage({ type: 'REPAIR_STATUS_UPDATED' }, '*');
    } catch (error: any) {
      console.error('Error accepting quotation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept quotation",
        variant: "destructive",
      });
    } finally {
      setProcessingQuotations(prev => {
        const next = new Set(prev);
        next.delete(quotationId);
        return next;
      });
    }
  };

  const handleRejectQuotation = async (quotationId: string) => {
    const quotation = quotations.find(q => q.id === quotationId);
    if (!quotation) {
      toast({
        title: "Error",
        description: "Quotation not found",
        variant: "destructive",
      });
      return;
    }

    setProcessingQuotations(prev => new Set(prev).add(quotationId));
    
    try {
      // First update repair_requests table
      const { error: requestUpdateError } = await supabase
        .from('repair_requests')
        .update({ 
          status: 'completed',
          repair_status: 'request_submitted'
        })
        .eq('id', quotation.request_id);
        
      if (requestUpdateError) throw requestUpdateError;

      // Then update quotations table
      const { error: quotationUpdateError } = await supabase
        .from('quotations')
        .update({ status: 'rejected' })
        .eq('id', quotationId);
        
      if (quotationUpdateError) {
        console.error('Quotation update error:', quotationUpdateError);
        throw quotationUpdateError;
      }

      // Update local state by removing the rejected quotation
      setQuotations(prev => prev.filter(q => q.id !== quotationId));
      
      toast({
        title: "Quotation Rejected",
        description: "The repair request has been closed.",
      });

      // Notify parent component to refresh
      window.postMessage({ type: 'REPAIR_STATUS_UPDATED' }, '*');
    } catch (error: any) {
      console.error('Error rejecting quotation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject quotation",
        variant: "destructive",
      });
    } finally {
      setProcessingQuotations(prev => {
        const next = new Set(prev);
        next.delete(quotationId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading quotations...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-8">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quotations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No pending quotations found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Quotation Approval</h1>
      <div className="grid grid-cols-1 gap-8">
        {quotations.map((quotation) => (
          <QuotationCard
            key={quotation.id}
            quotation={quotation}
            requestDetails={requestDetails[quotation.request_id]}
            onAccept={handleAcceptQuotation}
            onReject={handleRejectQuotation}
            isProcessing={processingQuotations.has(quotation.id)}
          />
        ))}
      </div>
    </div>
  );
}
