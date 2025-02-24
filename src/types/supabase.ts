export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      words: {
        Row: {
          id: string
          user_id: string
          word: string
          translation: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          word: string
          translation: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          word?: string
          translation?: string
          created_at?: string
        }
      }
      attempts: {
        Row: {
          id: string
          word_id: string
          score: number
          spoken_word: string | null
          created_at: string
        }
        Insert: {
          id?: string
          word_id: string
          score: number
          spoken_word?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          word_id?: string
          score?: number
          spoken_word?: string | null
          created_at?: string
        }
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
  }
}