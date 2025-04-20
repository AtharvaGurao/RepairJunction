
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Home, Briefcase } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { AddressForm } from "./AddressForm";
import { Badge } from "@/components/ui/badge";

export interface Address {
  id: string;
  user_id: string;
  is_primary: boolean;
  address: string;
  city_town: string;
  state: string;
  pincode: string;
  flat_no_house_no: string;
  label: string;
  created_at?: string;
  updated_at?: string;
}

interface AddressManagerProps {
  userId: string;
}

export function AddressManager({ userId }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false });

      if (error) throw error;

      setAddresses(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load addresses: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (address: Partial<Address>, isNew: boolean) => {
    try {
      if (isNew) {
        // If it's the first address, make it primary
        if (addresses.length === 0) {
          address.is_primary = true;
        }

        const { data, error } = await supabase
          .from('addresses')
          .insert({ ...address, user_id: userId })
          .select()
          .single();

        if (error) throw error;

        setAddresses([...addresses, data]);
        toast({
          title: "Address Added",
          description: "Your address has been added successfully.",
        });
      } else {
        const { data, error } = await supabase
          .from('addresses')
          .update(address)
          .eq('id', address.id)
          .select()
          .single();

        if (error) throw error;

        setAddresses(addresses.map(addr => addr.id === address.id ? data : addr));
        toast({
          title: "Address Updated",
          description: "Your address has been updated successfully.",
        });
      }

      setIsAddOpen(false);
      setIsEditOpen(false);
      setCurrentAddress(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save address: ${error.message}`,
      });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAddresses(addresses.filter(addr => addr.id !== id));
      toast({
        title: "Address Deleted",
        description: "Your address has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete address: ${error.message}`,
      });
    }
  };

  const setAsPrimary = async (id: string) => {
    try {
      // First, set all addresses to non-primary
      await supabase
        .from('addresses')
        .update({ is_primary: false })
        .eq('user_id', userId);

      // Then set the selected address as primary
      const { error } = await supabase
        .from('addresses')
        .update({ is_primary: true })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setAddresses(addresses.map(addr => ({
        ...addr,
        is_primary: addr.id === id
      })));

      toast({
        title: "Primary Address Set",
        description: "Your primary address has been updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to set primary address: ${error.message}`,
      });
    }
  };

  const getLabelIcon = (label: string) => {
    switch(label?.toLowerCase()) {
      case 'home':
        return <Home className="h-4 w-4 mr-1" />;
      case 'office':
        return <Briefcase className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Manage Addresses</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-1" /> Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressForm 
              onSubmit={(data) => handleAddressSubmit(data, true)} 
              onCancel={() => setIsAddOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No addresses saved yet</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setIsAddOpen(true)}
            >
              Add your first address
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div 
                key={address.id}
                className={`p-4 rounded-lg border relative ${
                  address.is_primary ? 'bg-muted/50 border-primary' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {address.flat_no_house_no}
                      </span>
                      {address.label && (
                        <Badge variant="outline" className="flex items-center">
                          {getLabelIcon(address.label)}
                          {address.label}
                        </Badge>
                      )}
                      {address.is_primary && (
                        <Badge className="bg-primary">Primary</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{address.address}</p>
                    <p className="text-sm">
                      {address.city_town}, {address.state} - {address.pincode}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog open={isEditOpen && currentAddress?.id === address.id} onOpenChange={(open) => {
                      setIsEditOpen(open);
                      if (!open) setCurrentAddress(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setCurrentAddress(address);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                          <DialogTitle>Edit Address</DialogTitle>
                        </DialogHeader>
                        {currentAddress && (
                          <AddressForm 
                            initialData={currentAddress}
                            onSubmit={(data) => handleAddressSubmit(data, false)} 
                            onCancel={() => {
                              setIsEditOpen(false);
                              setCurrentAddress(null);
                            }}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {!address.is_primary && (
                  <Button
                    variant="link" 
                    size="sm" 
                    className="mt-2 h-auto p-0 text-primary text-xs"
                    onClick={() => setAsPrimary(address.id)}
                  >
                    Set as primary
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
