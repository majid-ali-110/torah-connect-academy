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
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_actions_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_approvals: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          notes: string | null
          teacher_id: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          notes?: string | null
          teacher_id: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_approvals_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_approvals_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          meeting_data: Json | null
          message_type: Database["public"]["Enums"]["message_type"]
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          meeting_data?: Json | null
          message_type?: Database["public"]["Enums"]["message_type"]
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          meeting_data?: Json | null
          message_type?: Database["public"]["Enums"]["message_type"]
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      class_enrollments: {
        Row: {
          class_id: string
          enrolled_at: string
          id: string
          student_id: string
        }
        Insert: {
          class_id: string
          enrolled_at?: string
          id?: string
          student_id: string
        }
        Update: {
          class_id?: string
          enrolled_at?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "live_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          student_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          student_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          student_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          course_id: string | null
          enrolled_at: string
          id: string
          payment_id: string | null
          student_id: string | null
        }
        Insert: {
          course_id?: string | null
          enrolled_at?: string
          id?: string
          payment_id?: string | null
          student_id?: string | null
        }
        Update: {
          course_id?: string | null
          enrolled_at?: string
          id?: string
          payment_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_sessions: {
        Row: {
          course_id: string | null
          created_at: string | null
          duration_minutes: number
          id: string
          meeting_link: string | null
          notes: string | null
          session_date: string
          session_type: string
          status: string
          student_id: string | null
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          notes?: string | null
          session_date: string
          session_type?: string
          status?: string
          student_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          meeting_link?: string | null
          notes?: string | null
          session_date?: string
          session_type?: string
          status?: string
          student_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          age_range: string | null
          audience: string
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_trial_available: boolean | null
          max_students: number | null
          price: number
          session_duration_minutes: number | null
          subject: string
          teacher_id: string
          title: string
          total_sessions: number | null
          updated_at: string | null
        }
        Insert: {
          age_range?: string | null
          audience: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_trial_available?: boolean | null
          max_students?: number | null
          price: number
          session_duration_minutes?: number | null
          subject: string
          teacher_id: string
          title: string
          total_sessions?: number | null
          updated_at?: string | null
        }
        Update: {
          age_range?: string | null
          audience?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_trial_available?: boolean | null
          max_students?: number | null
          price?: number
          session_duration_minutes?: number | null
          subject?: string
          teacher_id?: string
          title?: string
          total_sessions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_forums: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          replies_count: number | null
          subject_id: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          replies_count?: number | null
          subject_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          replies_count?: number | null
          subject_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussion_forums_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          courses_sponsored: number | null
          created_at: string | null
          donation_type: string
          donor_id: string | null
          id: string
          message: string | null
          status: string
          stripe_payment_intent_id: string | null
          tax_receipt_issued: boolean | null
          tax_receipt_number: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          courses_sponsored?: number | null
          created_at?: string | null
          donation_type: string
          donor_id?: string | null
          id?: string
          message?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          tax_receipt_issued?: boolean | null
          tax_receipt_number?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          courses_sponsored?: number | null
          created_at?: string | null
          donation_type?: string
          donor_id?: string | null
          id?: string
          message?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          tax_receipt_issued?: boolean | null
          tax_receipt_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          forum_id: string | null
          id: string
          parent_reply_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          forum_id?: string | null
          id?: string
          parent_reply_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          forum_id?: string | null
          id?: string
          parent_reply_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "discussion_forums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_bookings: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          id: string
          lesson_date: string
          lesson_time: string
          notes: string | null
          payment_amount: number | null
          payment_status: string | null
          status: Database["public"]["Enums"]["session_status"] | null
          student_id: string
          subject: string | null
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          lesson_date: string
          lesson_time: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
          student_id: string
          subject?: string | null
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          lesson_date?: string
          lesson_time?: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          status?: Database["public"]["Enums"]["session_status"] | null
          student_id?: string
          subject?: string | null
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_bookings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_bookings_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_class_enrollments: {
        Row: {
          id: string
          joined_at: string
          live_class_id: string | null
          payment_id: string | null
          student_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string
          live_class_id?: string | null
          payment_id?: string | null
          student_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string
          live_class_id?: string | null
          payment_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_class_enrollments_live_class_id_fkey"
            columns: ["live_class_id"]
            isOneToOne: false
            referencedRelation: "live_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_class_enrollments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_class_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_classes: {
        Row: {
          course_key: string
          created_at: string
          description: string | null
          duration_minutes: number
          enrolled_count: number | null
          id: string
          is_free: boolean | null
          max_participants: number
          meeting_link: string
          price: number | null
          scheduled_at: string
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          course_key: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          enrolled_count?: number | null
          id?: string
          is_free?: boolean | null
          max_participants?: number
          meeting_link: string
          price?: number | null
          scheduled_at: string
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          course_key?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          enrolled_count?: number | null
          id?: string
          is_free?: boolean | null
          max_participants?: number
          meeting_link?: string
          price?: number | null
          scheduled_at?: string
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: []
      }
      monthly_teacher_payments: {
        Row: {
          admin_amount: number
          created_at: string | null
          gross_amount: number
          hourly_rate: number
          id: string
          month_year: string
          processed_at: string | null
          processed_by: string | null
          status: string | null
          teacher_amount: number
          teacher_id: string | null
          total_hours: number
        }
        Insert: {
          admin_amount: number
          created_at?: string | null
          gross_amount: number
          hourly_rate: number
          id?: string
          month_year: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          teacher_amount: number
          teacher_id?: string | null
          total_hours: number
        }
        Update: {
          admin_amount?: number
          created_at?: string | null
          gross_amount?: number
          hourly_rate?: number
          id?: string
          month_year?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          teacher_amount?: number
          teacher_id?: string | null
          total_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_teacher_payments_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_teacher_payments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          brand: string | null
          created_at: string
          id: string
          is_default: boolean | null
          last_four: string | null
          stripe_payment_method_id: string | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          stripe_payment_method_id?: string | null
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          stripe_payment_method_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          amount: number
          course_id: string | null
          created_at: string | null
          currency: string | null
          email_sent_at: string | null
          expires_at: string | null
          id: string
          status: string | null
          stripe_session_id: string | null
          student_id: string | null
        }
        Insert: {
          amount: number
          course_id?: string | null
          created_at?: string | null
          currency?: string | null
          email_sent_at?: string | null
          expires_at?: string | null
          id?: string
          status?: string | null
          stripe_session_id?: string | null
          student_id?: string | null
        }
        Update: {
          amount?: number
          course_id?: string | null
          created_at?: string | null
          currency?: string | null
          email_sent_at?: string | null
          expires_at?: string | null
          id?: string
          status?: string | null
          stripe_session_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          course_id: string | null
          created_at: string
          currency: string | null
          id: string
          status: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          course_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          course_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_group: string | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          audiences: string[] | null
          availability_status: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          education: string[] | null
          email: string
          experience: string | null
          first_name: string | null
          gender: string | null
          hourly_rate: number | null
          id: string
          is_fallback: boolean | null
          languages: string[] | null
          last_name: string | null
          learning_level: string | null
          location: string | null
          max_trial_lessons: number | null
          phone: string | null
          preferred_language: string | null
          role: Database["public"]["Enums"]["user_role"]
          subjects: string[] | null
          time_zone: string | null
          trial_lessons_used: number | null
          updated_at: string
        }
        Insert: {
          age_group?: string | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          audiences?: string[] | null
          availability_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          education?: string[] | null
          email: string
          experience?: string | null
          first_name?: string | null
          gender?: string | null
          hourly_rate?: number | null
          id: string
          is_fallback?: boolean | null
          languages?: string[] | null
          last_name?: string | null
          learning_level?: string | null
          location?: string | null
          max_trial_lessons?: number | null
          phone?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subjects?: string[] | null
          time_zone?: string | null
          trial_lessons_used?: number | null
          updated_at?: string
        }
        Update: {
          age_group?: string | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          audiences?: string[] | null
          availability_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          education?: string[] | null
          email?: string
          experience?: string | null
          first_name?: string | null
          gender?: string | null
          hourly_rate?: number | null
          id?: string
          is_fallback?: boolean | null
          languages?: string[] | null
          last_name?: string | null
          learning_level?: string | null
          location?: string | null
          max_trial_lessons?: number | null
          phone?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subjects?: string[] | null
          time_zone?: string | null
          trial_lessons_used?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rabbis: {
        Row: {
          bio: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          experience_years: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string | null
          name: string
          specialties: string[] | null
          title: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          experience_years?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          name: string
          specialties?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          experience_years?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          name?: string
          specialties?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number | null
          session_id: string | null
          student_id: string | null
          teacher_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          session_id?: string | null
          student_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          session_id?: string | null
          student_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsored_courses: {
        Row: {
          beneficiary_id: string | null
          course_id: string | null
          created_at: string | null
          donation_id: string | null
          id: string
          used_at: string | null
        }
        Insert: {
          beneficiary_id?: string | null
          course_id?: string | null
          created_at?: string | null
          donation_id?: string | null
          id?: string
          used_at?: string | null
        }
        Update: {
          beneficiary_id?: string | null
          course_id?: string | null
          created_at?: string | null
          donation_id?: string | null
          id?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsored_courses_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsored_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsored_courses_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      study_group_members: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          member_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          member_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      study_groups: {
        Row: {
          created_at: string | null
          current_participants: number | null
          description: string | null
          facilitator_id: string | null
          id: string
          is_active: boolean | null
          max_participants: number | null
          name: string
          schedule: Json | null
          subject_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          facilitator_id?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name: string
          schedule?: Json | null
          subject_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          facilitator_id?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name?: string
          schedule?: Json | null
          subject_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_groups_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          id: string
          meeting_url: string | null
          notes: string | null
          price: number | null
          scheduled_at: string | null
          session_type: string | null
          status: string | null
          student_id: string | null
          subject_id: string | null
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_url?: string | null
          notes?: string | null
          price?: number | null
          scheduled_at?: string | null
          session_type?: string | null
          status?: string | null
          student_id?: string | null
          subject_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meeting_url?: string | null
          notes?: string | null
          price?: number | null
          scheduled_at?: string | null
          session_type?: string | null
          status?: string | null
          student_id?: string | null
          subject_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          hebrew_name: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          hebrew_name?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          hebrew_name?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          email: string
          id: string
          priority: string | null
          status: string | null
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          email: string
          id?: string
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          email?: string
          id?: string
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_earnings: {
        Row: {
          admin_set_rate: number | null
          amount: number
          course_id: string | null
          created_at: string
          id: string
          payment_id: string | null
          status: string | null
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          admin_set_rate?: number | null
          amount: number
          course_id?: string | null
          created_at?: string
          id?: string
          payment_id?: string | null
          status?: string | null
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_set_rate?: number | null
          amount?: number
          course_id?: string | null
          created_at?: string
          id?: string
          payment_id?: string | null
          status?: string | null
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_earnings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_earnings_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_earnings_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_hours: {
        Row: {
          created_at: string | null
          date_taught: string
          hours_taught: number
          id: string
          session_id: string | null
          teacher_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_taught: string
          hours_taught: number
          id?: string
          session_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_taught?: string
          hours_taught?: number
          id?: string
          session_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_hours_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "course_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_hours_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_salary_settings: {
        Row: {
          admin_percentage: number | null
          created_at: string | null
          id: string
          teacher_percentage: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          admin_percentage?: number | null
          created_at?: string | null
          id?: string
          teacher_percentage?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          admin_percentage?: number | null
          created_at?: string | null
          id?: string
          teacher_percentage?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_salary_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_subjects: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          subject: string
          teacher_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          subject: string
          teacher_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          subject?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_subjects_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          availability: Json | null
          certifications: string[] | null
          created_at: string | null
          experience_years: number | null
          hourly_rate: number | null
          id: string
          is_verified: boolean | null
          profile_id: string | null
          rating: number | null
          specializations: string[] | null
          teaching_languages: string[] | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          availability?: Json | null
          certifications?: string[] | null
          created_at?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean | null
          profile_id?: string | null
          rating?: number | null
          specializations?: string[] | null
          teaching_languages?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          availability?: Json | null
          certifications?: string[] | null
          created_at?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean | null
          profile_id?: string | null
          rating?: number | null
          specializations?: string[] | null
          teaching_languages?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trial_sessions: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          session_date: string | null
          status: string | null
          student_id: string | null
          subject: string
          teacher_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          session_date?: string | null
          status?: string | null
          student_id?: string | null
          subject: string
          teacher_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          session_date?: string | null
          status?: string | null
          student_id?: string | null
          subject?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trial_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          admin_approved_at: string | null
          admin_approved_by: string | null
          amount: number
          bank_account: string | null
          created_at: string
          id: string
          status: string | null
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          amount: number
          bank_account?: string | null
          created_at?: string
          id?: string
          status?: string | null
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_approved_at?: string | null
          admin_approved_by?: string | null
          amount?: number
          bank_account?: string | null
          created_at?: string
          id?: string
          status?: string | null
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_admin_approved_by_fkey"
            columns: ["admin_approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "withdrawals_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_sponsored_course: {
        Args: { user_id: string; course_id: string }
        Returns: boolean
      }
      calculate_monthly_teacher_payment: {
        Args: { teacher_id_param: string; month_year_param: string }
        Returns: Json
      }
      get_available_sponsored_courses: {
        Args: { user_id: string }
        Returns: number
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_trial_for_subject: {
        Args: { user_id: string; subject_name: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      is_teacher: {
        Args: { user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      message_type: "text" | "meeting_request" | "meeting_confirmation"
      session_status: "scheduled" | "active" | "completed" | "cancelled"
      user_role: "student" | "teacher" | "admin"
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
    Enums: {
      message_type: ["text", "meeting_request", "meeting_confirmation"],
      session_status: ["scheduled", "active", "completed", "cancelled"],
      user_role: ["student", "teacher", "admin"],
    },
  },
} as const
