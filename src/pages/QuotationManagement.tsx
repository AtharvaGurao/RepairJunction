
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Quotation {
  id: number;
  requestId: number;
  status: string;
  customer_name: string;
  appliance_type: string;
}

export default function QuotationManagement() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;
        
        // Fetch repair requests that need quotations
        const { data, error } = await supabase
          .from('repair_requests')
          .select('id, repair_status, customer_name, appliance_type')
          .eq('technician_id', session.session.user.id)
          .eq('repair_status', 'diagnosis_inspection')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform to quotation format
        const quotationData = (data || []).map(request => ({
          id: request.id,
          requestId: request.id,
          status: "Pending",
          customer_name: request.customer_name,
          appliance_type: request.appliance_type
        }));
        
        setQuotations(quotationData);
      } catch (error) {
        console.error('Error fetching quotations:', error);
        toast({
          title: "Error",
          description: "Failed to load quotation data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Quotation Management</h1>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading quotations...</p>
          </div>
        </div>
      ) : quotations.length === 0 ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-muted-foreground text-lg">No requests ready for quotation</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quotations.map((quotation) => (
            <Link
              key={quotation.id}
              to={`/technician/quotations/${quotation.id}/submit`}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Request Number: {quotation.requestId}</CardTitle>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                      {quotation.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Customer:</span> {quotation.customer_name}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Appliance:</span> {quotation.appliance_type}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
