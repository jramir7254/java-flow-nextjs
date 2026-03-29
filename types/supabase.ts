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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string
          course_id: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          content: string
          course_id: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      answers: {
        Row: {
          content: string
          id: string
          question_id: string
          title: string | null
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          content: string
          id?: string
          question_id: string
          title?: string | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          content?: string
          id?: string
          question_id?: string
          title?: string | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_details"
            referencedColumns: ["id"]
          },
        ]
      }
      code_files: {
        Row: {
          file_name: string
          id: string
          initial_content: string
          is_editable: boolean | null
          is_hidden: boolean | null
          question_id: string
        }
        Insert: {
          file_name: string
          id?: string
          initial_content: string
          is_editable?: boolean | null
          is_hidden?: boolean | null
          question_id: string
        }
        Update: {
          file_name?: string
          id?: string
          initial_content?: string
          is_editable?: boolean | null
          is_hidden?: boolean | null
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_files_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_details"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          course_id: string
          id: string
          name: string
          order_index: number | null
          parent_id: string | null
          type: Database["public"]["Enums"]["content_type"]
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          course_id: string
          id?: string
          name: string
          order_index?: number | null
          parent_id?: string | null
          type: Database["public"]["Enums"]["content_type"]
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          course_id?: string
          id?: string
          name?: string
          order_index?: number | null
          parent_id?: string | null
          type?: Database["public"]["Enums"]["content_type"]
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          course_id: string
          enrolled_at: string
          role: string | null
          status: Database["public"]["Enums"]["enrollment_status"] | null
          user_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string
          role?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
          user_id?: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string
          role?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          author_id: string
          available_at: string | null
          course_code: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          author_id: string
          available_at?: string | null
          course_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          author_id?: string
          available_at?: string | null
          course_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      md_file_details: {
        Row: {
          id: string
          is_viewable: boolean | null
          markdown_content: string
        }
        Insert: {
          id: string
          is_viewable?: boolean | null
          markdown_content: string
        }
        Update: {
          id?: string
          is_viewable?: boolean | null
          markdown_content?: string
        }
        Relationships: [
          {
            foreignKeyName: "md_file_details_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      question_details: {
        Row: {
          ai_enabled: boolean | null
          id: string
          instructions: string
        }
        Insert: {
          ai_enabled?: boolean | null
          id: string
          instructions: string
        }
        Update: {
          ai_enabled?: boolean | null
          id?: string
          instructions?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_details_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          question_id: string
          status: Database["public"]["Enums"]["submission_status"]
          submission_files: Json
          test_cases_passed: number | null
          total_test_cases: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          question_id: string
          status: Database["public"]["Enums"]["submission_status"]
          submission_files: Json
          test_cases_passed?: number | null
          total_test_cases?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          question_id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          submission_files?: Json
          test_cases_passed?: number | null
          total_test_cases?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      telemetry_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          payload: Json | null
          session_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          session_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "telemetry_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      telemetry_sessions: {
        Row: {
          ai_prompt_count: number | null
          copy_count: number | null
          cut_count: number | null
          ended_at: string | null
          final_code: string | null
          id: string
          is_passed: boolean | null
          paste_count: number | null
          question_id: string
          started_at: string | null
          submission_attempts: number | null
          total_time_ms: number | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          ai_prompt_count?: number | null
          copy_count?: number | null
          cut_count?: number | null
          ended_at?: string | null
          final_code?: string | null
          id?: string
          is_passed?: boolean | null
          paste_count?: number | null
          question_id: string
          started_at?: string | null
          submission_attempts?: number | null
          total_time_ms?: number | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          ai_prompt_count?: number | null
          copy_count?: number | null
          cut_count?: number | null
          ended_at?: string | null
          final_code?: string | null
          id?: string
          is_passed?: boolean | null
          paste_count?: number | null
          question_id?: string
          started_at?: string | null
          submission_attempts?: number | null
          total_time_ms?: number | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_sessions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telemetry_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      test_cases: {
        Row: {
          entry_file_name: string
          expected_output: string | null
          id: string
          input: string | null
          is_example: boolean | null
          is_public: boolean | null
          question_id: string
        }
        Insert: {
          entry_file_name: string
          expected_output?: string | null
          id?: string
          input?: string | null
          is_example?: boolean | null
          is_public?: boolean | null
          question_id: string
        }
        Update: {
          entry_file_name?: string
          expected_output?: string | null
          id?: string
          input?: string | null
          is_example?: boolean | null
          is_public?: boolean | null
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_cases_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_details"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          school_id: string
          updated_at: string | null
        }
        Insert: {
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          school_id: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          school_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          course_id: string
          is_passed: boolean | null
          last_submission_id: string | null
          question_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          is_passed?: boolean | null
          last_submission_id?: string | null
          question_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          is_passed?: boolean | null
          last_submission_id?: string | null
          question_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_last_submission_id_fkey"
            columns: ["last_submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_registration_details: {
        Args: { check_school_id: string }
        Returns: boolean
      }
      is_student_enrolled: {
        Args: { target_course_id: string }
        Returns: boolean
      }
      is_teacher_of_enrollment: {
        Args: { target_course_id: string }
        Returns: boolean
      }
    }
    Enums: {
      content_type: "folder" | "file" | "question"
      enrollment_status:
        | "active"
        | "pending"
        | "rejected"
        | "dropped"
        | "archived"
        | "completed"
      event_type_enum:
        | "TEXT_EDIT"
        | "CLICK"
        | "COPY"
        | "CUT"
        | "PASTE"
        | "PROMPT"
        | "RESIZE"
        | "SUBMIT"
        | "FOCUS_IN"
        | "FOCUS_OUT"
      focus_target_enum: "TERMINAL" | "EDITOR" | "SIDE_PANEL" | "TAB" | "NONE"
      submission_status: "passed" | "failed" | "error"
      user_role: "student" | "teacher" | "admin" | "super"
      visibility_type:
        | "public"
        | "private"
        | "scheduled"
        | "unlisted"
        | "archived"
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
      content_type: ["folder", "file", "question"],
      enrollment_status: [
        "active",
        "pending",
        "rejected",
        "dropped",
        "archived",
        "completed",
      ],
      event_type_enum: [
        "TEXT_EDIT",
        "CLICK",
        "COPY",
        "CUT",
        "PASTE",
        "PROMPT",
        "RESIZE",
        "SUBMIT",
        "FOCUS_IN",
        "FOCUS_OUT",
      ],
      focus_target_enum: ["TERMINAL", "EDITOR", "SIDE_PANEL", "TAB", "NONE"],
      submission_status: ["passed", "failed", "error"],
      user_role: ["student", "teacher", "admin", "super"],
      visibility_type: [
        "public",
        "private",
        "scheduled",
        "unlisted",
        "archived",
      ],
    },
  },
} as const
