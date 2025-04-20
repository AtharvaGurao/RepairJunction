import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Address } from "@/components/profile/AddressManager";
import { Loader2 } from "lucide-react";
import { autoAssignTechnicianToRequest } from "@/utils/technicianUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const APPLIANCE_TYPES = [
  "Refrigerator",
  "Washing Machine",
  "Dryer",
  "Dishwasher",
  "Oven",
  "Microwave",
  "Air Conditioner",
  "Television",
  "Laptop/Computer",
  "Small Kitchen Appliances",
  "Vacuum Cleaner",
  "Water Heater",
  "HVAC Systems",
  "Ceiling Fan",
  "Smart Home Devices",
  "Gaming Consoles",
  "Printer/Scanner",
  "Home Theater System",
  "Electric Chimney",
  "Induction Cooktop",
  "Geyser",
  "Inverter/Battery",
  "Sewing Machine",
  "Hair Dryer/Straighter",
  "Electric Kettle",
  "Food Processor",
  "Ice Maker",
  "Other"
] as const;

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  productType: z.enum([...APPLIANCE_TYPES]),
  otherProductType: z.string().optional(),
  serialNumber: z.string().min(1, "Serial number is required"),
  modelName: z.string().min(1, "Model name is required"),
  purchaseDate: z.string().optional(),
  serviceType: z.enum(["home", "pickup"], {
    required_error: "Please select a service type",
  }),
  address: z.string().min(5, "Address is required"),
  addressId: z.string().min(1, "Please select an address"),
  description: z.string().min(10, "Please provide a detailed description"),
});

const SubmitRequest = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      productType: "Refrigerator",
      otherProductType: "",
      serialNumber: "",
      modelName: "",
      purchaseDate: "",
      serviceType: "home",
      address: "",
      addressId: "",
      description: "",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user.id) {
        setUserId(data.session.user.id);
        fetchUserAddresses(data.session.user.id);
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData && profileData.full_name) {
          form.setValue('fullName', profileData.full_name);
        }
      } else {
        setError("You must be logged in to submit a request");
      }
    };
    
    checkAuth();
  }, []);

  const fetchUserAddresses = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', id)
        .order('is_primary', { ascending: false });
      
      if (error) throw error;
      
      setSavedAddresses(data || []);
      
      if (data && data.length > 0) {
        const primaryAddress = data.find(addr => addr.is_primary) || data[0];
        const formattedAddress = formatAddress(primaryAddress);
        
        form.setValue('address', formattedAddress);
        form.setValue('addressId', primaryAddress.id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setError("Failed to fetch your saved addresses");
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: Address): string => {
    return `${address.flat_no_house_no}, ${address.address}, ${address.city_town}, ${address.state} - ${address.pincode}`;
  };

  const handleAddressChange = (addressId: string) => {
    const selectedAddress = savedAddresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      const formattedAddress = formatAddress(selectedAddress);
      form.setValue('address', formattedAddress);
      form.setValue('addressId', addressId);
    } else if (addressId === 'custom') {
      form.setValue('address', '');
      form.setValue('addressId', '');
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a request",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    setSubmitting(true);
    
    try {
      const selectedAddress = savedAddresses.find(addr => addr.id === values.addressId);
      
      if (!selectedAddress) {
        toast({
          title: "Error",
          description: "Please select a valid address",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }
      
      console.log("Selected address details:", {
        pincode: selectedAddress.pincode,
        city: selectedAddress.city_town,
        state: selectedAddress.state,
        originalAddress: selectedAddress
      });
      
      let fullAddress = values.address;
      if (!fullAddress.includes(selectedAddress.pincode)) {
        fullAddress = `${fullAddress}, ${selectedAddress.pincode}`;
      }

      const normalizedPincode = selectedAddress.pincode ? selectedAddress.pincode.trim() : null;
      const normalizedCity = selectedAddress.city_town ? selectedAddress.city_town.trim() : null;
      const normalizedState = selectedAddress.state ? selectedAddress.state.trim() : null;
      
      console.log("Normalized address fields for technician lookup:", {
        pincode: normalizedPincode,
        city: normalizedCity,
        state: normalizedState
      });
      
      const requestData = {
        customer_name: values.fullName,
        appliance_type: values.productType === "Other" ? values.otherProductType : values.productType,
        serial_number: values.serialNumber,
        model_name: values.modelName,
        purchase_date: values.purchaseDate || null,
        service_type: values.serviceType,
        address: fullAddress,
        address_id: values.addressId,
        description: values.description,
        status: "pending_assignment",
        user_id: userId,
      };

      console.log("Submitting request data:", requestData);
      
      const { data, error } = await supabase
        .from('repair_requests')
        .insert(requestData)
        .select();

      if (error) {
        console.error("Error inserting repair request:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error("No data returned after inserting repair request");
      }
      
      console.log("Request submitted successfully:", data);
      
      const newRequestId = data[0].id;
      const assignmentResult = await autoAssignTechnicianToRequest(
        newRequestId, 
        normalizedPincode,
        normalizedCity,
        normalizedState
      );
      
      console.log("Auto-assignment result:", {
        success: assignmentResult.success,
        assigned: assignmentResult.assigned,
        message: assignmentResult.message,
        technician: assignmentResult.technician ? {
          id: assignmentResult.technician.id,
          name: assignmentResult.technician.full_name,
          pincode: assignmentResult.technician.pincode
        } : null
      });
      
      let successMessage = "Your request has been received. We'll notify you once a technician is available.";
      
      if (assignmentResult.success && assignmentResult.assigned) {
        successMessage = `Your repair request has been assigned to ${assignmentResult.technician.full_name}.`;
      }

      toast({
        title: "Request Submitted",
        description: successMessage,
      });
      
      navigate("/services/submit-success");
    } catch (error: any) {
      console.error("Error submitting request:", error);
      setError(error.message || "There was an error submitting your request. Please try again.");
      
      toast({
        title: "Error",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProductType = form.watch("productType");
  const serviceType = form.watch("serviceType");

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Repair Request Form</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!userId && (
            <Alert className="mb-6">
              <AlertTitle>Login Required</AlertTitle>
              <AlertDescription>
                You need to be logged in to submit a repair request.
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an appliance type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APPLIANCE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedProductType === "Other" && (
                <FormField
                  control={form.control}
                  name="otherProductType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specify Other Product Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Please specify your appliance type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Service Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-4"
                      >
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="home" />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="font-medium">
                              Repair Service at Home
                            </FormLabel>
                            <FormDescription>
                              A technician will visit your location to diagnose and repair the appliance on-site.
                            </FormDescription>
                          </div>
                        </FormItem>
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="pickup" />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="font-medium">
                              Appliance Pickup
                            </FormLabel>
                            <FormDescription>
                              We will pick up your appliance, repair it at our service center, and return it to you once fixed.
                            </FormDescription>
                          </div>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription className="mt-4 p-4 bg-muted rounded-md">
                      Note: Home service may incur additional travel charges. Pickup service typically takes 3-5 business days for completion. Final costs will be determined after diagnosis.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product model name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {serviceType === "home" ? "Service Address" : "Pickup Address"}
                    </FormLabel>
                    
                    {loading ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading addresses...</span>
                      </div>
                    ) : userId && savedAddresses.length > 0 ? (
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleAddressChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a saved address" />
                          </SelectTrigger>
                          <SelectContent>
                            {savedAddresses.map((addr) => (
                              <SelectItem key={addr.id} value={addr.id}>
                                {addr.label || "Address"} {addr.is_primary ? "(Primary)" : ""} - {addr.flat_no_house_no}, {addr.city_town}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">Enter a different address</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    ) : (
                      <div className="text-sm text-muted-foreground mb-2">
                        No saved addresses found. Please add an address in your profile or enter one below.
                      </div>
                    )}
                    
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.value ? "Address Details" : "Enter Address"}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={
                          serviceType === "home"
                            ? "Enter your complete service address"
                            : "Enter the pickup location address"
                        }
                        {...field}
                        className={field.value && form.getValues("addressId") !== "custom" ? "bg-muted" : ""}
                        disabled={field.value !== "" && form.getValues("addressId") !== "custom"}
                      />
                    </FormControl>
                    {form.getValues("addressId") !== "custom" && field.value && (
                      <FormDescription>
                        To change this address, select "Enter a different address" from the dropdown above.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appliance Issue Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the issue with your appliance"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={submitting || loading || !userId}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SubmitRequest;
