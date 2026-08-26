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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      availability_slots: {
        Row: {
          active: boolean
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          body: string | null
          category: string
          cover_image_alt: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          featured: boolean
          id: string
          published: boolean
          published_at: string | null
          reading_minutes: number
          slug: string
          title: string
          updated_at: string
          video_autoplay: boolean
          video_captions_url: string | null
          video_controls: boolean
          video_is_featured: boolean
          video_kind: string | null
          video_loop: boolean
          video_muted: boolean
          video_poster_url: string | null
          video_transcript: string | null
          video_url: string | null
        }
        Insert: {
          author?: string
          body?: string | null
          category?: string
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          published?: boolean
          published_at?: string | null
          reading_minutes?: number
          slug: string
          title: string
          updated_at?: string
          video_autoplay?: boolean
          video_captions_url?: string | null
          video_controls?: boolean
          video_is_featured?: boolean
          video_kind?: string | null
          video_loop?: boolean
          video_muted?: boolean
          video_poster_url?: string | null
          video_transcript?: string | null
          video_url?: string | null
        }
        Update: {
          author?: string
          body?: string | null
          category?: string
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          published?: boolean
          published_at?: string | null
          reading_minutes?: number
          slug?: string
          title?: string
          updated_at?: string
          video_autoplay?: boolean
          video_captions_url?: string | null
          video_controls?: boolean
          video_is_featured?: boolean
          video_kind?: string | null
          video_loop?: boolean
          video_muted?: boolean
          video_poster_url?: string | null
          video_transcript?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          admin_note: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          needs: string
          phone: string | null
          preferred_date: string
          preferred_time: string
          reference: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          needs: string
          phone?: string | null
          preferred_date: string
          preferred_time: string
          reference: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          needs?: string
          phone?: string | null
          preferred_date?: string
          preferred_time?: string
          reference?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          category: string
          challenge: string
          client_name: string
          cover_image_alt: string | null
          cover_image_url: string | null
          created_at: string
          gallery: Json
          id: string
          industry: string
          published: boolean
          result_summary: string
          results: Json
          slug: string
          solution: string
          sort_order: number
          testimonial_author: string | null
          testimonial_quote: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          challenge?: string
          client_name?: string
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          gallery?: Json
          id?: string
          industry?: string
          published?: boolean
          result_summary?: string
          results?: Json
          slug: string
          solution?: string
          sort_order?: number
          testimonial_author?: string | null
          testimonial_quote?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          challenge?: string
          client_name?: string
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          gallery?: Json
          id?: string
          industry?: string
          published?: boolean
          result_summary?: string
          results?: Json
          slug?: string
          solution?: string
          sort_order?: number
          testimonial_author?: string | null
          testimonial_quote?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      download_logs: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          order_id: string | null
          outcome: string
          product_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          order_id?: string | null
          outcome?: string
          product_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          order_id?: string | null
          outcome?: string
          product_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "download_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          admin_note: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          service: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          service?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          service?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      form_rate_limits: {
        Row: {
          bucket: string
          hits: number
          id: string
          window_start: string
        }
        Insert: {
          bucket: string
          hits?: number
          id?: string
          window_start?: string
        }
        Update: {
          bucket?: string
          hits?: number
          id?: string
          window_start?: string
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt_text: string
          created_at: string
          description: string | null
          id: string
          kind: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          alt_text?: string
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          title?: string
          updated_at?: string
          url: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_note: string | null
          amount: number
          buyer_email: string
          buyer_name: string | null
          created_at: string
          currency: string
          download_count: number
          download_limit: number
          download_token: string
          id: string
          ip_address: string | null
          kind: string
          product_id: string
          provider: string | null
          provider_reference: string | null
          reference: string
          status: string
          token_expires_at: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          amount?: number
          buyer_email: string
          buyer_name?: string | null
          created_at?: string
          currency?: string
          download_count?: number
          download_limit?: number
          download_token: string
          id?: string
          ip_address?: string | null
          kind?: string
          product_id: string
          provider?: string | null
          provider_reference?: string | null
          reference: string
          status?: string
          token_expires_at?: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          amount?: number
          buyer_email?: string
          buyer_name?: string | null
          created_at?: string
          currency?: string
          download_count?: number
          download_limit?: number
          download_token?: string
          id?: string
          ip_address?: string | null
          kind?: string
          product_id?: string
          provider?: string | null
          provider_reference?: string | null
          reference?: string
          status?: string
          token_expires_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          cover_image_alt: string | null
          cover_image_url: string | null
          created_at: string
          currency: string
          download_count: number
          download_limit: number | null
          external_url: string | null
          featured: boolean
          features: Json
          file_storage_path: string | null
          full_description: string
          gallery: Json
          id: string
          price: number
          product_type: string
          published: boolean
          purchase_count: number
          short_description: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          download_count?: number
          download_limit?: number | null
          external_url?: string | null
          featured?: boolean
          features?: Json
          file_storage_path?: string | null
          full_description?: string
          gallery?: Json
          id?: string
          price?: number
          product_type?: string
          published?: boolean
          purchase_count?: number
          short_description?: string
          slug: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          category?: string
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          currency?: string
          download_count?: number
          download_limit?: number | null
          external_url?: string | null
          featured?: boolean
          features?: Json
          file_storage_path?: string | null
          full_description?: string
          gallery?: Json
          id?: string
          price?: number
          product_type?: string
          published?: boolean
          purchase_count?: number
          short_description?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          admin_note: string | null
          budget_range: string
          company: string | null
          created_at: string
          email: string
          goals: string | null
          id: string
          name: string
          phone: string | null
          project_brief: string
          reference: string
          service: string
          status: string
          timeline: string | null
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          budget_range: string
          company?: string | null
          created_at?: string
          email: string
          goals?: string | null
          id?: string
          name: string
          phone?: string | null
          project_brief: string
          reference: string
          service: string
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          budget_range?: string
          company?: string | null
          created_at?: string
          email?: string
          goals?: string | null
          id?: string
          name?: string
          phone?: string | null
          project_brief?: string
          reference?: string
          service?: string
          status?: string
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          created_at: string
          id: string
          meta_description: string
          meta_title: string
          og_image_url: string | null
          path: string
          robots: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meta_description?: string
          meta_title?: string
          og_image_url?: string | null
          path: string
          robots?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meta_description?: string
          meta_title?: string
          og_image_url?: string | null
          path?: string
          robots?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          category: string | null
          created_at: string
          faqs: Json
          features: Json
          hero_image_alt: string | null
          hero_image_url: string | null
          id: string
          long_description: string
          name: string
          process: Json
          short_description: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string
          faqs?: Json
          features?: Json
          hero_image_alt?: string | null
          hero_image_url?: string | null
          id?: string
          long_description?: string
          name: string
          process?: Json
          short_description?: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string
          faqs?: Json
          features?: Json
          hero_image_alt?: string | null
          hero_image_url?: string | null
          id?: string
          long_description?: string
          name?: string
          process?: Json
          short_description?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      team_members: {
        Row: {
          active: boolean
          bio: string
          created_at: string
          designation: string
          id: string
          name: string
          photo_alt: string | null
          photo_url: string | null
          social_url: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          bio?: string
          created_at?: string
          designation?: string
          id?: string
          name?: string
          photo_alt?: string | null
          photo_url?: string | null
          social_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          bio?: string
          created_at?: string
          designation?: string
          id?: string
          name?: string
          photo_alt?: string | null
          photo_url?: string | null
          social_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
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
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
