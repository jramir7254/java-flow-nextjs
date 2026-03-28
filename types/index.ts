import { Database } from "./supabase"

export type Course = Database['public']['Tables']['courses']['Row']
export type ContentItem = Database['public']['Tables']['content_items']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
