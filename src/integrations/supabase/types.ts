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
      education_progress: {
        Row: {
          completed: boolean | null
          content_id: string
          created_at: string | null
          id: string
          next_available_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          content_id: string
          created_at?: string | null
          id?: string
          next_available_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          content_id?: string
          created_at?: string | null
          id?: string
          next_available_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      guardian_share_settings: {
        Row: {
          consent_verified: boolean | null
          created_at: string | null
          enabled: boolean | null
          guardian_email: string | null
          id: string
          last_export_at: string | null
          passcode: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          consent_verified?: boolean | null
          created_at?: string | null
          enabled?: boolean | null
          guardian_email?: string | null
          id?: string
          last_export_at?: string | null
          passcode?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          consent_verified?: boolean | null
          created_at?: string | null
          enabled?: boolean | null
          guardian_email?: string | null
          id?: string
          last_export_at?: string | null
          passcode?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_app_connections: {
        Row: {
          app_type: string
          created_at: string | null
          enabled: boolean | null
          id: string
          last_sync_at: string | null
          sync_settings: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          app_type: string
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_sync_at?: string | null
          sync_settings?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          app_type?: string
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_sync_at?: string | null
          sync_settings?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_data_records: {
        Row: {
          data_type: string
          id: string
          recorded_at: string
          source: string
          synced_at: string | null
          user_id: string
          value: Json
        }
        Insert: {
          data_type: string
          id?: string
          recorded_at: string
          source: string
          synced_at?: string | null
          user_id: string
          value: Json
        }
        Update: {
          data_type?: string
          id?: string
          recorded_at?: string
          source?: string
          synced_at?: string | null
          user_id?: string
          value?: Json
        }
        Relationships: []
      }
      nurse_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_from_user: boolean
          message: string
          read_at: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_from_user: boolean
          message: string
          read_at?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_from_user?: boolean
          message?: string
          read_at?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      nurse_chat_sessions: {
        Row: {
          closed_at: string | null
          created_at: string | null
          id: string
          message_count: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string | null
          id?: string
          message_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string | null
          id?: string
          message_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
