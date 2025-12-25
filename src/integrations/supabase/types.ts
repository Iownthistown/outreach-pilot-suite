export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      account_analyses: {
        Row: {
          analysis_data: Json | null
          confidence_score: number | null
          content_patterns: string | null
          created_at: string | null
          engagement_style: string | null
          id: string
          key_topics: string | null
          model_used: string | null
          niche: string | null
          short_summary: string | null
          tone: string | null
          twitter_handle: string
          updated_at: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          analysis_data?: Json | null
          confidence_score?: number | null
          content_patterns?: string | null
          created_at?: string | null
          engagement_style?: string | null
          id?: string
          key_topics?: string | null
          model_used?: string | null
          niche?: string | null
          short_summary?: string | null
          tone?: string | null
          twitter_handle: string
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_data?: Json | null
          confidence_score?: number | null
          content_patterns?: string | null
          created_at?: string | null
          engagement_style?: string | null
          id?: string
          key_topics?: string | null
          model_used?: string | null
          niche?: string | null
          short_summary?: string | null
          tone?: string | null
          twitter_handle?: string
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      account_prompts: {
        Row: {
          account_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          niche: string | null
          prompt_content: string
          prompt_type: string
          twitter_handle: string | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          niche?: string | null
          prompt_content: string
          prompt_type: string
          twitter_handle?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          niche?: string | null
          prompt_content?: string
          prompt_type?: string
          twitter_handle?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_prompts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "account_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_history: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          id: string
          status: string | null
          stripe_invoice_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string | null
          stripe_invoice_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string | null
          stripe_invoice_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      extension_sessions: {
        Row: {
          browser_info: string | null
          created_at: string
          extension_version: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_activity: string
          session_token: string
          user_id: string
        }
        Insert: {
          browser_info?: string | null
          created_at?: string
          extension_version?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity?: string
          session_token: string
          user_id: string
        }
        Update: {
          browser_info?: string | null
          created_at?: string
          extension_version?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity?: string
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          status: string
          stripe_invoice_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          status: string
          stripe_invoice_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string
          stripe_invoice_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_price_id: string
          stripe_subscription_id: string
          trial_end: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type: string
          status: string
          stripe_price_id: string
          stripe_subscription_id: string
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_price_id?: string
          stripe_subscription_id?: string
          trial_end?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding_progress: {
        Row: {
          account_analyzed: boolean | null
          completion_percentage: number | null
          current_step: string | null
          extension_installed: boolean | null
          id: string
          last_updated: string | null
          plan_selected: boolean | null
          twitter_connected: boolean | null
          user_id: string | null
          welcome_completed: boolean | null
        }
        Insert: {
          account_analyzed?: boolean | null
          completion_percentage?: number | null
          current_step?: string | null
          extension_installed?: boolean | null
          id?: string
          last_updated?: string | null
          plan_selected?: boolean | null
          twitter_connected?: boolean | null
          user_id?: string | null
          welcome_completed?: boolean | null
        }
        Update: {
          account_analyzed?: boolean | null
          completion_percentage?: number | null
          current_step?: string | null
          extension_installed?: boolean | null
          id?: string
          last_updated?: string | null
          plan_selected?: boolean | null
          twitter_connected?: boolean | null
          user_id?: string | null
          welcome_completed?: boolean | null
        }
        Relationships: []
      }
      users: {
        Row: {
          auto_login_enabled: boolean | null
          connection_method: string | null
          created_at: string | null
          email: string
          email_preferences: Json | null
          extension_connected: boolean | null
          extension_last_connected: string | null
          extension_version: string | null
          id: string
          payment_method_brand: string | null
          payment_method_id: string | null
          payment_method_last4: string | null
          session_origin: string | null
          stripe_customer_id: string | null
          twitter_auth_token: string | null
          twitter_connected_at: string | null
          twitter_ct0_token: string | null
          twitter_display_name: string | null
          twitter_handle: string | null
          twitter_last_sync: string | null
          twitter_profile_image_url: string | null
          updated_at: string | null
        }
        Insert: {
          auto_login_enabled?: boolean | null
          connection_method?: string | null
          created_at?: string | null
          email: string
          email_preferences?: Json | null
          extension_connected?: boolean | null
          extension_last_connected?: string | null
          extension_version?: string | null
          id?: string
          payment_method_brand?: string | null
          payment_method_id?: string | null
          payment_method_last4?: string | null
          session_origin?: string | null
          stripe_customer_id?: string | null
          twitter_auth_token?: string | null
          twitter_connected_at?: string | null
          twitter_ct0_token?: string | null
          twitter_display_name?: string | null
          twitter_handle?: string | null
          twitter_last_sync?: string | null
          twitter_profile_image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_login_enabled?: boolean | null
          connection_method?: string | null
          created_at?: string | null
          email?: string
          email_preferences?: Json | null
          extension_connected?: boolean | null
          extension_last_connected?: string | null
          extension_version?: string | null
          id?: string
          payment_method_brand?: string | null
          payment_method_id?: string | null
          payment_method_last4?: string | null
          session_origin?: string | null
          stripe_customer_id?: string | null
          twitter_auth_token?: string | null
          twitter_connected_at?: string | null
          twitter_ct0_token?: string | null
          twitter_display_name?: string | null
          twitter_handle?: string | null
          twitter_last_sync?: string | null
          twitter_profile_image_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      disconnect_extension: { Args: { p_user_id: string }; Returns: Json }
      update_extension_status: {
        Args: {
          p_browser_info?: string
          p_extension_version?: string
          p_session_token?: string
          p_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
