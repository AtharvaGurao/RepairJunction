
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceRequest {
  id: number;
  customer_name: string;
  service_type: string;
  completion_date: string;
  status: string;
}

export default function ServiceHistory() {
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchServiceHistory = async () => {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) return;

      // Get technician profile data to verify active request count is correct
      const { data: profileData } = await supabase
        .from('profiles')
        .select('active_request_count')
        .eq('id', session.session.user.id)
        .single();
        
      console.log("Current technician active request count:", profileData?.active_request_count);

      const { data, error } = await supabase
        .from('repair_requests')
        .select('id, customer_name, service_type, completion_date, status, repair_status')
        .eq('technician_id', session.session.user.id)
        .eq('status', 'completed')
        .order('completion_date', { ascending: false });

      if (error) throw error;

      console.log(`Found ${data?.length || 0} completed service requests`);
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching service history:', error);
      toast({
        title: "Error",
        description: "Failed to load service history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceHistory();
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Service History</h1>
        <Button variant="outline" size="sm" onClick={fetchServiceHistory}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center">
          <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center text-muted-foreground">No completed services found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Link key={service.id} to={`/technician/service-history/${service.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Service #{service.id}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Customer: {service.customer_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Service Type: {service.service_type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Completion Date: {new Date(service.completion_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: {service.status}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
