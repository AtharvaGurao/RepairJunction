export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          address: string
          city_town: string
          created_at: string
          flat_no_house_no: string
          id: string
          is_primary: boolean | null
          label: string | null
          pincode: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          city_town: string
          created_at?: string
          flat_no_house_no: string
          id?: string
          is_primary?: boolean | null
          label?: string | null
          pincode: string
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          city_town?: string
          created_at?: string
          flat_no_house_no?: string
          id?: string
          is_primary?: boolean | null
          label?: string | null
          pincode?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_request_count: number | null
          address: string | null
          can_receive_requests: boolean | null
          certifications: Json | null
          city_town: string | null
          created_at: string
          flat_no_house_no: string | null
          full_name: string | null
          id: string
          is_profile_complete: boolean | null
          is_technician: boolean | null
          phone_number: string | null
          pincode: string | null
          role: string
          skills: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          active_request_count?: number | null
          address?: string | null
          can_receive_requests?: boolean | null
          certifications?: Json | null
          city_town?: string | null
          created_at?: string
          flat_no_house_no?: string | null
          full_name?: string | null
          id: string
          is_profile_complete?: boolean | null
          is_technician?: boolean | null
          phone_number?: string | null
          pincode?: string | null
          role: string
          skills?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          active_request_count?: number | null
          address?: string | null
          can_receive_requests?: boolean | null
          certifications?: Json | null
          city_town?: string | null
          created_at?: string
          flat_no_house_no?: string | null
          full_name?: string | null
          id?: string
          is_profile_complete?: boolean | null
          is_technician?: boolean | null
          phone_number?: string | null
          pincode?: string | null
          role?: string
          skills?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quotations: {
        Row: {
          additional_charges: number | null
          created_at: string
          diagnosis_fee: number
          id: string
          part_cost: number | null
          part_name: string | null
          repair_cost: number
          repair_notes: string
          request_id: number
          status: string
          technician_id: string | null
          updated_at: string
        }
        Insert: {
          additional_charges?: number | null
          created_at?: string
          diagnosis_fee: number
          id?: string
          part_cost?: number | null
          part_name?: string | null
          repair_cost: number
          repair_notes: string
          request_id: number
          status?: string
          technician_id?: string | null
          updated_at?: string
        }
        Update: {
          additional_charges?: number | null
          created_at?: string
          diagnosis_fee?: number
          id?: string
          part_cost?: number | null
          part_name?: string | null
          repair_cost?: number
          repair_notes?: string
          request_id?: number
          status?: string
          technician_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "repair_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_requests: {
        Row: {
          address: string | null
          address_id: string | null
          appliance_type: string
          completion_date: string | null
          created_at: string
          customer_name: string
          description: string | null
          id: number
          model_name: string | null
          purchase_date: string | null
          repair_status: Database["public"]["Enums"]["repair_status"]
          scheduled_pickup_datetime: string | null
          serial_number: string | null
          service_type: string | null
          status: string
          technician_id: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          address_id?: string | null
          appliance_type: string
          completion_date?: string | null
          created_at?: string
          customer_name: string
          description?: string | null
          id?: number
          model_name?: string | null
          purchase_date?: string | null
          repair_status?: Database["public"]["Enums"]["repair_status"]
          scheduled_pickup_datetime?: string | null
          serial_number?: string | null
          service_type?: string | null
          status: string
          technician_id?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          address_id?: string | null
          appliance_type?: string
          completion_date?: string | null
          created_at?: string
          customer_name?: string
          description?: string | null
          id?: number
          model_name?: string | null
          purchase_date?: string | null
          repair_status?: Database["public"]["Enums"]["repair_status"]
          scheduled_pickup_datetime?: string | null
          serial_number?: string | null
          service_type?: string | null
          status?: string
          technician_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repair_requests_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          repair_request_id: number
          status: Database["public"]["Enums"]["repair_status"]
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          repair_request_id: number
          status: Database["public"]["Enums"]["repair_status"]
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          repair_request_id?: number
          status?: Database["public"]["Enums"]["repair_status"]
        }
        Relationships: [
          {
            foreignKeyName: "repair_status_history_repair_request_id_fkey"
            columns: ["repair_request_id"]
            isOneToOne: false
            referencedRelation: "repair_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians: {
        Row: {
          active_request_count: number | null
          address: string | null
          can_receive_requests: boolean | null
          certifications: Json | null
          city_town: string | null
          created_at: string | null
          email: string | null
          flat_no_house_no: string | null
          full_name: string | null
          id: string
          is_profile_complete: boolean | null
          phone_number: string | null
          pincode: string | null
          skills: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          active_request_count?: number | null
          address?: string | null
          can_receive_requests?: boolean | null
          certifications?: Json | null
          city_town?: string | null
          created_at?: string | null
          email?: string | null
          flat_no_house_no?: string | null
          full_name?: string | null
          id: string
          is_profile_complete?: boolean | null
          phone_number?: string | null
          pincode?: string | null
          skills?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          active_request_count?: number | null
          address?: string | null
          can_receive_requests?: boolean | null
          certifications?: Json | null
          city_town?: string | null
          created_at?: string | null
          email?: string | null
          flat_no_house_no?: string | null
          full_name?: string | null
          id?: string
          is_profile_complete?: boolean | null
          phone_number?: string | null
          pincode?: string | null
          skills?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          city_town: string | null
          created_at: string | null
          email: string | null
          flat_no_house_no: string | null
          full_name: string | null
          id: string
          is_profile_complete: boolean | null
          phone_number: string | null
          pincode: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city_town?: string | null
          created_at?: string | null
          email?: string | null
          flat_no_house_no?: string | null
          full_name?: string | null
          id: string
          is_profile_complete?: boolean | null
          phone_number?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city_town?: string | null
          created_at?: string | null
          email?: string | null
          flat_no_house_no?: string | null
          full_name?: string | null
          id?: string
          is_profile_complete?: boolean | null
          phone_number?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_request_transaction: {
        Args: {
          p_request_id: number
          p_technician_id: string
          p_current_count: number
        }
        Returns: Json
      }
      is_technician: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      repair_status:
        | "request_submitted"
        | "request_accepted"
        | "pickup_scheduled"
        | "diagnosis_inspection"
        | "quotation_shared"
        | "quotation_accepted"
        | "repair_in_progress"
        | "quality_check"
        | "ready_for_delivery"
        | "delivered"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      repair_status: [
        "request_submitted",
        "request_accepted",
        "pickup_scheduled",
        "diagnosis_inspection",
        "quotation_shared",
        "quotation_accepted",
        "repair_in_progress",
        "quality_check",
        "ready_for_delivery",
        "delivered",
      ],
    },
  },
} as const
