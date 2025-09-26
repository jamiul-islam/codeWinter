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
        Relationships: []
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: 'features_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      feature_edges: {
        Row: {
          id: string
          project_id: string
          source_feature_id: string
          target_feature_id: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          source_feature_id: string
          target_feature_id: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          source_feature_id?: string
          target_feature_id?: string
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'feature_edges_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'feature_edges_source_feature_id_fkey'
            columns: ['source_feature_id']
            referencedRelation: 'features'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'feature_edges_target_feature_id_fkey'
            columns: ['target_feature_id']
            referencedRelation: 'features'
            referencedColumns: ['id']
          },
        ]
      }
      feature_prds: {
        Row: {
          id: string
          feature_id: string
          status: Database['public']['Enums']['prd_status']
          summary: string | null
          prd_md: string | null
          prd_json: Json | null
          model_used: string | null
          token_count: number | null
          error: string | null
          generated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          feature_id: string
          status?: Database['public']['Enums']['prd_status']
          summary?: string | null
          prd_md?: string | null
          prd_json?: Json | null
          model_used?: string | null
          token_count?: number | null
          error?: string | null
          generated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          feature_id?: string
          status?: Database['public']['Enums']['prd_status']
          summary?: string | null
          prd_md?: string | null
          prd_json?: Json | null
          model_used?: string | null
          token_count?: number | null
          error?: string | null
          generated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'feature_prds_feature_id_fkey'
            columns: ['feature_id']
            referencedRelation: 'features'
            referencedColumns: ['id']
          },
        ]
      }
      feature_prd_versions: {
        Row: {
          id: number
          feature_id: string
          prd_id: string
          summary: string | null
          prd_md: string | null
          prd_json: Json | null
          model_used: string | null
          token_count: number | null
          status: Database['public']['Enums']['prd_status']
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: number
          feature_id: string
          prd_id: string
          summary?: string | null
          prd_md?: string | null
          prd_json?: Json | null
          model_used?: string | null
          token_count?: number | null
          status: Database['public']['Enums']['prd_status']
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: number
          feature_id?: string
          prd_id?: string
          summary?: string | null
          prd_md?: string | null
          prd_json?: Json | null
          model_used?: string | null
          token_count?: number | null
          status?: Database['public']['Enums']['prd_status']
          created_at?: string
          expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'feature_prd_versions_feature_id_fkey'
            columns: ['feature_id']
            referencedRelation: 'features'
            referencedColumns: ['id']
          },
        ]
      }
      audit_logs: {
        Row: {
          id: number
          user_id: string
          project_id: string | null
          feature_id: string | null
          action: string
          payload: Json
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          project_id?: string | null
          feature_id?: string | null
          action: string
          payload?: Json
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          project_id?: string | null
          feature_id?: string | null
          action?: string
          payload?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'audit_logs_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'audit_logs_feature_id_fkey'
            columns: ['feature_id']
            referencedRelation: 'features'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      prd_status: 'idle' | 'generating' | 'ready' | 'error'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
