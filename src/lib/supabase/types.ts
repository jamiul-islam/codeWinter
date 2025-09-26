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
      user_settings: {
        Row: {
          user_id: string
          gemini_api_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          gemini_api_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          gemini_api_key?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          graph: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          graph?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          graph?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      features: {
        Row: {
          id: string
          project_id: string
          title: string
          notes: string | null
          position: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          notes?: string | null
          position?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          notes?: string | null
          position?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      feature_links: {
        Row: {
          id: string
          project_id: string
          source_feature_id: string
          target_feature_id: string
        }
        Insert: {
          id?: string
          project_id: string
          source_feature_id: string
          target_feature_id: string
        }
        Update: {
          id?: string
          project_id?: string
          source_feature_id?: string
          target_feature_id?: string
        }
      }
      feature_prds: {
        Row: {
          id: string
          feature_id: string
          status: 'idle' | 'generating' | 'ready' | 'error'
          prd_md: string | null
          model_used: string | null
          tokens: number | null
          error: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          feature_id: string
          status?: 'idle' | 'generating' | 'ready' | 'error'
          prd_md?: string | null
          model_used?: string | null
          tokens?: number | null
          error?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          feature_id?: string
          status?: 'idle' | 'generating' | 'ready' | 'error'
          prd_md?: string | null
          model_used?: string | null
          tokens?: number | null
          error?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: number
          user_id: string | null
          action: string
          payload: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          action: string
          payload?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          action?: string
          payload?: Json | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type SupabaseRow<Table extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][Table]['Row']
