import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  diagnosisFee: z.string().min(1, "Diagnosis fee is required"),
  repairCost: z.string().min(1, "Repair cost is required"),
  partName: z.string().optional(),
  partCost: z.string().optional(),
  additionalCharges: z.string().optional(),
  repairNotes: z.string().min(10, "Please provide detailed repair notes"),
});

export default function QuotationSubmission() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diagnosisFee: "",
      repairCost: "",
      partName: "",
      partCost: "",
      additionalCharges: "",
      repairNotes: "",
    },
  });

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('repair_requests')
          .select('customer_name, appliance_type, description, address, status')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setCustomerDetails(data);
        }
      } catch (error) {
        console.error("Error fetching request details:", error);
        setError("Could not fetch request details");
      }
    };
    
    fetchRequestDetails();
  }, [id]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id) {
      setError("Missing request ID");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) throw new Error("No authenticated user");

      // Insert the quotation
      const { error: insertError } = await supabase
        .from('quotations')
        .insert({
          request_id: id,
          technician_id: session.session.user.id,
          diagnosis_fee: parseFloat(values.diagnosisFee),
          repair_cost: parseFloat(values.repairCost),
          part_name: values.partName || null,
          part_cost: values.partCost ? parseFloat(values.partCost) : null,
          additional_charges: values.additionalCharges ? parseFloat(values.additionalCharges) : null,
          repair_notes: values.repairNotes,
          status: 'pending_approval',
          appliance_type: customerDetails.appliance_type
        });
        
      if (insertError) throw insertError;

      // Update the repair request status
      const { error: updateError } = await supabase
        .from('repair_requests')
        .update({ 
          status: 'quotation_submitted',
          repair_status: 'quotation_shared'
        })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Quotation Submitted",
        description: "The quotation has been submitted successfully.",
      });
      
      navigate(`/technician/quotations/success/${id}`);
    } catch (error: any) {
      console.error("Error submitting quotation:", error);
      setError(error.message || "Failed to submit quotation");
      
      toast({
        title: "Error",
        description: "There was an error submitting the quotation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Submit Quotation - Request #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {customerDetails && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Customer:</span> {customerDetails.customer_name}</p>
                <p><span className="font-medium">Appliance:</span> {customerDetails.appliance_type}</p>
                <p><span className="font-medium">Issue:</span> {customerDetails.description}</p>
                <p><span className="font-medium">Address:</span> {customerDetails.address}</p>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="repairNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repair Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed explanation of the issue diagnosed"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diagnosisFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis Fee</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="repairCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repair Cost</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h4 className="font-medium">Parts Replacement (if applicable)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="partName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Part Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Compressor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="partCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Part Cost</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="additionalCharges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Charges (e.g., Pickup/Delivery)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Quotation"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
