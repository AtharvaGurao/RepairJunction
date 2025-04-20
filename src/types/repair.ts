export interface RepairRequest {
  id: number;
  status: string;
  repair_status: string;
  customer_name: string;
  created_at: string;
  appliance_type: string;
  address: string;
  model_name?: string;    // Added as optional property
  service_type?: string;  // Added as optional property
  description?: string;   // Added this field
}

export interface Quotation {
  id: string;
  request_id: number;
  diagnosis_fee: number;
  repair_cost: number;
  part_name?: string;
  part_cost?: number;
  additional_charges?: number;
  repair_notes: string;
  status: string;
  technician_id: string;
  created_at: string;
  appliance_type: string;
}
