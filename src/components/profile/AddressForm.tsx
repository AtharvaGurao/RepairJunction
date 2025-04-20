
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDIAN_STATES } from "@/constants/states";
import { getCityByPincode } from "@/utils/pincode";
import { Address } from "./AddressManager";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddressFormProps {
  initialData?: Address;
  onSubmit: (data: Partial<Address>) => void;
  onCancel: () => void;
}

export function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<Partial<Address>>(initialData || {
    flat_no_house_no: '',
    address: '',
    city_town: '',
    state: 'Maharashtra', // Default to Maharashtra as requested
    pincode: '',
    label: 'Home',
    is_primary: false,
  });
  const [isCityAutofilled, setIsCityAutofilled] = useState(false);
  
  useEffect(() => {
    if (initialData?.pincode && initialData.city_town) {
      setIsCityAutofilled(true);
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const validateCityTown = (value: string) => {
    return /^[a-zA-Z\s]*$/.test(value);
  };

  const handleCityTownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCityAutofilled && validateCityTown(e.target.value)) {
      handleChange(e);
    }
  };

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    
    const pincode = e.target.value;
    if (pincode && pincode.length === 6) {
      const city = await getCityByPincode(pincode);
      if (city) {
        setFormData(prev => ({
          ...prev,
          city_town: city
        }));
        setIsCityAutofilled(true);
      } else {
        setIsCityAutofilled(false);
      }
    } else {
      setIsCityAutofilled(false);
    }
  };

  const handleStateChange = (value: string) => {
    setFormData({
      ...formData,
      state: value,
    });
  };

  const handleLabelChange = (value: string) => {
    setFormData({
      ...formData,
      label: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="flat_no_house_no">Flat/House Number, Building *</Label>
            <Input
              id="flat_no_house_no"
              name="flat_no_house_no"
              value={formData.flat_no_house_no || ''}
              onChange={handleChange}
              required
              placeholder="Enter your flat/house number and building"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              required
              placeholder="Enter your street address"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              name="pincode"
              value={formData.pincode || ''}
              onChange={handlePincodeChange}
              required
              placeholder="Enter your pincode"
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground">
              Enter a 6-digit pincode to auto-fill city
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city_town">City/Town *</Label>
            <Input
              id="city_town"
              name="city_town"
              value={formData.city_town || ''}
              onChange={handleCityTownChange}
              required
              placeholder="Enter your city/town"
              className={isCityAutofilled ? "bg-gray-100" : ""}
              readOnly={isCityAutofilled}
            />
            {isCityAutofilled && (
              <p className="text-xs text-muted-foreground">
                Auto-filled based on pincode
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select 
              value={formData.state || 'Maharashtra'} 
              onValueChange={handleStateChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Address Label</Label>
          <RadioGroup
            value={formData.label || 'Home'}
            onValueChange={handleLabelChange}
            className="flex flex-row space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Home" id="home" />
              <Label htmlFor="home" className="cursor-pointer">Home</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Office" id="office" />
              <Label htmlFor="office" className="cursor-pointer">Office</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Other" id="other" />
              <Label htmlFor="other" className="cursor-pointer">Other</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Address
        </Button>
      </div>
    </form>
  );
}
