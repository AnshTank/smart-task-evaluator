import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          code: string | null
          status: 'pending' | 'evaluating' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          code?: string | null
          status?: 'pending' | 'evaluating' | 'completed' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          code?: string | null
          status?: 'pending' | 'evaluating' | 'completed' | 'failed'
          updated_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          task_id: string
          score: number
          strengths: string[]
          weaknesses: string[]
          improvements: string[]
          full_report: string | null
          is_paid: boolean
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          score: number
          strengths: string[]
          weaknesses: string[]
          improvements: string[]
          full_report?: string | null
          is_paid?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          score?: number
          strengths?: string[]
          weaknesses?: string[]
          improvements?: string[]
          full_report?: string | null
          is_paid?: boolean
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          evaluation_id: string
          stripe_payment_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          evaluation_id: string
          stripe_payment_id: string
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          evaluation_id?: string
          stripe_payment_id?: string
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
        }
      }
    }
  }
}