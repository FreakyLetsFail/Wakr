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
      achievements: {
        Row: {
          id: string
          key: string
          name: string
          description: string | null
          icon: string
          requirement_type: string
          requirement_value: number
          coin_reward: number
          xp_reward: number
          badge_color: string
          tier: string
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          name: string
          description?: string | null
          icon?: string
          requirement_type: string
          requirement_value: number
          coin_reward?: number
          xp_reward?: number
          badge_color?: string
          tier?: string
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          name?: string
          description?: string | null
          icon?: string
          requirement_type?: string
          requirement_value?: number
          coin_reward?: number
          xp_reward?: number
          badge_color?: string
          tier?: string
          created_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          event_name: string
          event_category: string | null
          event_properties: Json
          session_id: string | null
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          has_analytics_consent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_name: string
          event_category?: string | null
          event_properties?: Json
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          has_analytics_consent?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_name?: string
          event_category?: string | null
          event_properties?: Json
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          has_analytics_consent?: boolean
          created_at?: string
        }
      }
      audio_cache: {
        Row: {
          id: string
          cache_key: string
          language: string
          audio_type: string
          time: string | null
          variant: string | null
          audio_url: string
          duration_seconds: number | null
          text_content: string | null
          usage_count: number
          last_used_at: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          cache_key: string
          language: string
          audio_type: string
          time?: string | null
          variant?: string | null
          audio_url: string
          duration_seconds?: number | null
          text_content?: string | null
          usage_count?: number
          last_used_at?: string | null
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          cache_key?: string
          language?: string
          audio_type?: string
          time?: string | null
          variant?: string | null
          audio_url?: string
          duration_seconds?: number | null
          text_content?: string | null
          usage_count?: number
          last_used_at?: string | null
          expires_at?: string
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          resource_type: string | null
          resource_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          resource_type?: string | null
          resource_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          resource_type?: string | null
          resource_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      billing_events: {
        Row: {
          id: string
          user_id: string
          event_type: string
          stripe_event_id: string | null
          amount: number | null
          currency: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: string
          stripe_event_id?: string | null
          amount?: number | null
          currency?: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: string
          stripe_event_id?: string | null
          amount?: number | null
          currency?: string
          metadata?: Json
          created_at?: string
        }
      }
      call_logs: {
        Row: {
          id: string
          user_id: string
          wake_call_id: string | null
          scheduled_time: string
          initiated_at: string | null
          answered_at: string | null
          ended_at: string | null
          status: Database["public"]["Enums"]["call_status"]
          duration_seconds: number | null
          challenge_presented: boolean
          challenge_completed: boolean
          challenge_attempts: number
          snooze_count: number
          twilio_call_sid: string | null
          twilio_status: string | null
          twilio_price: number | null
          twilio_price_unit: string
          audio_quality: number | null
          connection_quality: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          wake_call_id?: string | null
          scheduled_time: string
          initiated_at?: string | null
          answered_at?: string | null
          ended_at?: string | null
          status?: Database["public"]["Enums"]["call_status"]
          duration_seconds?: number | null
          challenge_presented?: boolean
          challenge_completed?: boolean
          challenge_attempts?: number
          snooze_count?: number
          twilio_call_sid?: string | null
          twilio_status?: string | null
          twilio_price?: number | null
          twilio_price_unit?: string
          audio_quality?: number | null
          connection_quality?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          wake_call_id?: string | null
          scheduled_time?: string
          initiated_at?: string | null
          answered_at?: string | null
          ended_at?: string | null
          status?: Database["public"]["Enums"]["call_status"]
          duration_seconds?: number | null
          challenge_presented?: boolean
          challenge_completed?: boolean
          challenge_attempts?: number
          snooze_count?: number
          twilio_call_sid?: string | null
          twilio_status?: string | null
          twilio_price?: number | null
          twilio_price_unit?: string
          audio_quality?: number | null
          connection_quality?: number | null
          created_at?: string
        }
      }
      coin_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          balance_after: number
          transaction_type: string
          source: string
          source_id: string | null
          description: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          balance_after: number
          transaction_type: string
          source: string
          source_id?: string | null
          description?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          balance_after?: number
          transaction_type?: string
          source?: string
          source_id?: string | null
          description?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      custom_calls: {
        Row: {
          id: string
          user_id: string
          scheduled_at: string
          title: string
          message: string
          requires_confirmation: boolean
          repeat_count: number
          repeat_interval: number
          status: Database["public"]["Enums"]["call_status"]
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scheduled_at: string
          title: string
          message: string
          requires_confirmation?: boolean
          repeat_count?: number
          repeat_interval?: number
          status?: Database["public"]["Enums"]["call_status"]
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          scheduled_at?: string
          title?: string
          message?: string
          requires_confirmation?: boolean
          repeat_count?: number
          repeat_interval?: number
          status?: Database["public"]["Enums"]["call_status"]
          completed_at?: string | null
          created_at?: string
        }
      }
      data_processing_logs: {
        Row: {
          id: string
          user_id: string | null
          processor: string
          purpose: string
          legal_basis: string
          data_categories: string[]
          shared_with: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          processor: string
          purpose: string
          legal_basis: string
          data_categories: string[]
          shared_with?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          processor?: string
          purpose?: string
          legal_basis?: string
          data_categories?: string[]
          shared_with?: string | null
          created_at?: string
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          completed_at: string
          notes: string | null
          mood: number | null
          energy_level: number | null
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          completed_at?: string
          notes?: string | null
          mood?: number | null
          energy_level?: number | null
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          completed_at?: string
          notes?: string | null
          mood?: number | null
          energy_level?: number | null
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          icon: string
          color: string
          frequency: Database["public"]["Enums"]["habit_frequency"]
          frequency_config: Json
          start_date: string
          end_date: string | null
          reminder_enabled: boolean
          reminder_time: string | null
          reminder_message: string | null
          current_streak: number
          longest_streak: number
          total_completions: number
          completion_rate: number
          is_archived: boolean
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          icon?: string
          color?: string
          frequency?: Database["public"]["Enums"]["habit_frequency"]
          frequency_config?: Json
          start_date: string
          end_date?: string | null
          reminder_enabled?: boolean
          reminder_time?: string | null
          reminder_message?: string | null
          current_streak?: number
          longest_streak?: number
          total_completions?: number
          completion_rate?: number
          is_archived?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          icon?: string
          color?: string
          frequency?: Database["public"]["Enums"]["habit_frequency"]
          frequency_config?: Json
          start_date?: string
          end_date?: string | null
          reminder_enabled?: boolean
          reminder_time?: string | null
          reminder_message?: string | null
          current_streak?: number
          longest_streak?: number
          total_completions?: number
          completion_rate?: number
          is_archived?: boolean
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      push_subscriptions: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          user_agent: string | null
          created_at: string
          last_used_at: string
        }
        Insert: {
          id?: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          user_agent?: string | null
          created_at?: string
          last_used_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          endpoint?: string
          p256dh?: string
          auth?: string
          user_agent?: string | null
          created_at?: string
          last_used_at?: string
        }
      }
      rewards_catalog: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          coin_cost: number
          available: boolean
          limited_quantity: number | null
          quantity_remaining: number | null
          min_level: number
          subscription_tier_required: Database["public"]["Enums"]["subscription_tier"] | null
          metadata: Json
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          coin_cost: number
          available?: boolean
          limited_quantity?: number | null
          quantity_remaining?: number | null
          min_level?: number
          subscription_tier_required?: Database["public"]["Enums"]["subscription_tier"] | null
          metadata?: Json
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          coin_cost?: number
          available?: boolean
          limited_quantity?: number | null
          quantity_remaining?: number | null
          min_level?: number
          subscription_tier_required?: Database["public"]["Enums"]["subscription_tier"] | null
          metadata?: Json
          created_at?: string
          expires_at?: string | null
        }
      }
      system_config: {
        Row: {
          key: string
          value: Json
          description: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
          seen: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
          seen?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
          seen?: boolean
          created_at?: string
        }
      }
      user_coins: {
        Row: {
          id: string
          user_id: string
          current_balance: number
          total_earned: number
          total_spent: number
          level: number | null
          xp: number | null
          xp_to_next_level: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_balance?: number
          total_earned?: number
          total_spent?: number
          level?: number | null
          xp?: number | null
          xp_to_next_level?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_balance?: number
          total_earned?: number
          total_spent?: number
          level?: number | null
          xp?: number | null
          xp_to_next_level?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_rewards: {
        Row: {
          id: string
          user_id: string
          reward_id: string
          coins_spent: number
          redeemed_at: string
          status: string
          activated_at: string | null
          expires_at: string | null
          reward_data: Json
        }
        Insert: {
          id?: string
          user_id: string
          reward_id: string
          coins_spent: number
          redeemed_at?: string
          status?: string
          activated_at?: string | null
          expires_at?: string | null
          reward_data?: Json
        }
        Update: {
          id?: string
          user_id?: string
          reward_id?: string
          coins_spent?: number
          redeemed_at?: string
          status?: string
          activated_at?: string | null
          expires_at?: string | null
          reward_data?: Json
        }
      }
      users: {
        Row: {
          id: string
          email: string
          email_verified: boolean
          email_verified_at: string | null
          first_name: string
          last_name: string
          phone: string
          phone_country_code: string
          residence_country: string
          hometown: string | null
          timezone: string
          language: string
          currency: string
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          subscription_status: string
          trial_ends_at: string | null
          subscription_ends_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          roles: Database["public"]["Enums"]["user_role"][]
          preferences: Json
          consents: Json
          last_login_at: string | null
          last_active_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          email: string
          email_verified?: boolean
          email_verified_at?: string | null
          first_name: string
          last_name: string
          phone: string
          phone_country_code: string
          residence_country: string
          hometown?: string | null
          timezone: string
          language?: string
          currency?: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          subscription_status?: string
          trial_ends_at?: string | null
          subscription_ends_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          roles?: Database["public"]["Enums"]["user_role"][]
          preferences?: Json
          consents?: Json
          last_login_at?: string | null
          last_active_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          email_verified?: boolean
          email_verified_at?: string | null
          first_name?: string
          last_name?: string
          phone?: string
          phone_country_code?: string
          residence_country?: string
          hometown?: string | null
          timezone?: string
          language?: string
          currency?: string
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          subscription_status?: string
          trial_ends_at?: string | null
          subscription_ends_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          roles?: Database["public"]["Enums"]["user_role"][]
          preferences?: Json
          consents?: Json
          last_login_at?: string | null
          last_active_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      wake_calls: {
        Row: {
          id: string
          user_id: string
          enabled: boolean
          wake_time: string
          days_of_week: number[] | null
          challenge_type: string
          challenge_difficulty: number
          snooze_allowed: boolean
          snooze_duration: number
          max_snoozes: number
          voice_speed: number
          voice_variant: string
          custom_message: string | null
          total_calls: number
          successful_calls: number
          failed_calls: number
          average_snoozes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          enabled?: boolean
          wake_time: string
          days_of_week?: number[] | null
          challenge_type?: string
          challenge_difficulty?: number
          snooze_allowed?: boolean
          snooze_duration?: number
          max_snoozes?: number
          voice_speed?: number
          voice_variant?: string
          custom_message?: string | null
          total_calls?: number
          successful_calls?: number
          failed_calls?: number
          average_snoozes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          enabled?: boolean
          wake_time?: string
          days_of_week?: number[] | null
          challenge_type?: string
          challenge_difficulty?: number
          snooze_allowed?: boolean
          snooze_duration?: number
          max_snoozes?: number
          voice_speed?: number
          voice_variant?: string
          custom_message?: string | null
          total_calls?: number
          successful_calls?: number
          failed_calls?: number
          average_snoozes?: number
          created_at?: string
          updated_at?: string
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
      call_status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "MISSED" | "CANCELLED"
      consent_type: "NECESSARY" | "ANALYTICS" | "MARKETING" | "ALL"
      habit_frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM"
      subscription_tier: "TRIAL" | "BASIC" | "PRO"
      user_role: "USER" | "ADMIN"
    }
  }
}