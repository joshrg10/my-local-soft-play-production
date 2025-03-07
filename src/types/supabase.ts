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
      playgrounds: {
        Row: {
          id: number
          created_at: string
          name: string
          description: string
          address: string
          city: string
          postcode: string
          phone: string
          email: string
          website: string
          google_rating: number
          google_reviews_count: number
          latitude: number
          longitude: number
          features: string[]
          opening_hours: Json
          image_url: string
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          description: string
          address: string
          city: string
          postcode: string
          phone?: string
          email?: string
          website?: string
          google_rating?: number
          google_reviews_count?: number
          latitude?: number
          longitude?: number
          features?: string[]
          opening_hours?: Json
          image_url?: string
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          description?: string
          address?: string
          city?: string
          postcode?: string
          phone?: string
          email?: string
          website?: string
          google_rating?: number
          google_reviews_count?: number
          latitude?: number
          longitude?: number
          features?: string[]
          opening_hours?: Json
          image_url?: string
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