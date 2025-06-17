-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
DO $$ BEGIN
 CREATE TYPE "public"."subscription_tier" AS ENUM('TRIAL', 'BASIC', 'PRO');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('USER', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."call_status" AS ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'MISSED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."habit_frequency" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."consent_type" AS ENUM('NECESSARY', 'ANALYTICS', 'MARKETING', 'ALL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"email_verification_token" varchar(255),
	"email_verified_at" timestamp,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone" text NOT NULL,
	"phone_country_code" varchar(10) NOT NULL,
	"residence_country" varchar(2) NOT NULL,
	"timezone" varchar(50) NOT NULL,
	"language" varchar(10) DEFAULT 'en',
	"currency" varchar(3) DEFAULT 'EUR',
	"password_hash" text NOT NULL,
	"two_factor_enabled" boolean DEFAULT false,
	"two_factor_secret" text,
	"subscription_tier" "subscription_tier" DEFAULT 'TRIAL',
	"subscription_status" varchar(20) DEFAULT 'trialing',
	"trial_ends_at" timestamp DEFAULT NOW() + INTERVAL '24 hours',
	"subscription_ends_at" timestamp,
	"stripe_customer_id" varchar(255),
	"stripe_subscription_id" varchar(255),
	"roles" user_role[] DEFAULT ARRAY['USER']::user_role[],
	"preferences" jsonb DEFAULT '{"wake_time": "07:00", "notification_sound": true, "vibration": true, "theme": "system", "wake_challenge": "math", "snooze_limit": 3, "habit_reminder_time": "20:00"}'::jsonb,
	"consents" jsonb DEFAULT '{"necessary": true, "analytics": false, "marketing": false, "timestamp": null}'::jsonb,
	"last_login_at" timestamp,
	"last_active_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- User coins table
CREATE TABLE IF NOT EXISTS "user_coins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"current_balance" integer DEFAULT 0 NOT NULL,
	"total_earned" integer DEFAULT 0 NOT NULL,
	"total_spent" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1,
	"xp" integer DEFAULT 0,
	"xp_to_next_level" integer DEFAULT 100,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_coins_user_id_unique" UNIQUE("user_id")
);

-- Coin transactions table
CREATE TABLE IF NOT EXISTS "coin_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"transaction_type" varchar(50) NOT NULL,
	"source" varchar(50) NOT NULL,
	"source_id" uuid,
	"description" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Achievements table
CREATE TABLE IF NOT EXISTS "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(50) DEFAULT '🏆',
	"requirement_type" varchar(50) NOT NULL,
	"requirement_value" integer NOT NULL,
	"coin_reward" integer DEFAULT 0,
	"xp_reward" integer DEFAULT 0,
	"badge_color" varchar(7) DEFAULT '#FFD700',
	"tier" varchar(20) DEFAULT 'bronze',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "achievements_key_unique" UNIQUE("key")
);

-- User achievements table
CREATE TABLE IF NOT EXISTS "user_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"achievement_id" uuid NOT NULL,
	"unlocked_at" timestamp DEFAULT now() NOT NULL,
	"seen" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Wake calls table
CREATE TABLE IF NOT EXISTS "wake_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"enabled" boolean DEFAULT true,
	"wake_time" time NOT NULL,
	"days_of_week" integer[] DEFAULT ARRAY[1,2,3,4,5],
	"challenge_type" varchar(20) DEFAULT 'math',
	"challenge_difficulty" integer DEFAULT 1,
	"snooze_allowed" boolean DEFAULT true,
	"snooze_duration" integer DEFAULT 5,
	"max_snoozes" integer DEFAULT 3,
	"voice_speed" numeric(3,2) DEFAULT '1.0',
	"voice_variant" varchar(20) DEFAULT 'friendly',
	"custom_message" text,
	"total_calls" integer DEFAULT 0,
	"successful_calls" integer DEFAULT 0,
	"failed_calls" integer DEFAULT 0,
	"average_snoozes" numeric(3,2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Habits table
CREATE TABLE IF NOT EXISTS "habits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(50) DEFAULT '📌',
	"color" varchar(7) DEFAULT '#7c3aed',
	"frequency" "habit_frequency" DEFAULT 'DAILY' NOT NULL,
	"frequency_config" jsonb DEFAULT '{}'::jsonb,
	"start_date" date DEFAULT CURRENT_DATE NOT NULL,
	"end_date" date,
	"reminder_enabled" boolean DEFAULT false,
	"reminder_time" time,
	"reminder_message" text,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"total_completions" integer DEFAULT 0,
	"completion_rate" numeric(5,2) DEFAULT '0',
	"is_archived" boolean DEFAULT false,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Habit completions table
CREATE TABLE IF NOT EXISTS "habit_completions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"habit_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	"mood" integer,
	"energy_level" integer
);

-- Custom calls table
CREATE TABLE IF NOT EXISTS "custom_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"requires_confirmation" boolean DEFAULT false,
	"repeat_count" integer DEFAULT 1,
	"repeat_interval" integer DEFAULT 5,
	"status" "call_status" DEFAULT 'SCHEDULED',
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Call logs table
CREATE TABLE IF NOT EXISTS "call_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"wake_call_id" uuid,
	"scheduled_time" timestamp NOT NULL,
	"initiated_at" timestamp,
	"answered_at" timestamp,
	"ended_at" timestamp,
	"status" "call_status" DEFAULT 'SCHEDULED' NOT NULL,
	"duration_seconds" integer,
	"challenge_presented" boolean DEFAULT false,
	"challenge_completed" boolean DEFAULT false,
	"challenge_attempts" integer DEFAULT 0,
	"snooze_count" integer DEFAULT 0,
	"twilio_call_sid" varchar(255),
	"twilio_status" varchar(50),
	"twilio_price" numeric(10,4),
	"twilio_price_unit" varchar(3) DEFAULT 'EUR',
	"audio_quality" integer,
	"connection_quality" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Push subscriptions table
CREATE TABLE IF NOT EXISTS "push_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp DEFAULT now() NOT NULL
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"event_name" varchar(100) NOT NULL,
	"event_category" varchar(50),
	"event_properties" jsonb DEFAULT '{}'::jsonb,
	"session_id" varchar(100),
	"ip_address" inet,
	"user_agent" text,
	"referrer" text,
	"has_analytics_consent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Billing events table
CREATE TABLE IF NOT EXISTS "billing_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"stripe_event_id" varchar(255),
	"amount" numeric(10,2),
	"currency" varchar(3) DEFAULT 'EUR',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "billing_events_stripe_event_id_unique" UNIQUE("stripe_event_id")
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"action" varchar(100) NOT NULL,
	"resource_type" varchar(50),
	"resource_id" uuid,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" inet,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Data processing logs table
CREATE TABLE IF NOT EXISTS "data_processing_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"processor" varchar(100) NOT NULL,
	"purpose" varchar(100) NOT NULL,
	"legal_basis" varchar(50) NOT NULL,
	"data_categories" text[] NOT NULL,
	"shared_with" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- System config table
CREATE TABLE IF NOT EXISTS "system_config" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Rewards catalog table
CREATE TABLE IF NOT EXISTS "rewards_catalog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"coin_cost" integer NOT NULL,
	"available" boolean DEFAULT true,
	"limited_quantity" integer,
	"quantity_remaining" integer,
	"min_level" integer DEFAULT 1,
	"subscription_tier_required" "subscription_tier",
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp
);

-- User rewards table
CREATE TABLE IF NOT EXISTS "user_rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"reward_id" uuid NOT NULL,
	"coins_spent" integer NOT NULL,
	"redeemed_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"activated_at" timestamp,
	"expires_at" timestamp,
	"reward_data" jsonb DEFAULT '{}'::jsonb
);

-- Audio cache table (simplified)
CREATE TABLE IF NOT EXISTS "audio_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cache_key" varchar(255) NOT NULL,
	"language" varchar(10) NOT NULL,
	"audio_type" varchar(50) NOT NULL,
	"time" varchar(5),
	"variant" varchar(50),
	"audio_url" text NOT NULL,
	"duration_seconds" integer,
	"text_content" text,
	"usage_count" integer DEFAULT 0,
	"last_used_at" timestamp,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "audio_cache_cache_key_unique" UNIQUE("cache_key")
);

-- Add foreign key constraints
DO $$ BEGIN
	ALTER TABLE "user_coins" ADD CONSTRAINT "user_coins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "coin_transactions" ADD CONSTRAINT "coin_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "wake_calls" ADD CONSTRAINT "wake_calls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "habits" ADD CONSTRAINT "habits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "habit_completions" ADD CONSTRAINT "habit_completions_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "habit_completions" ADD CONSTRAINT "habit_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "custom_calls" ADD CONSTRAINT "custom_calls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "call_logs" ADD CONSTRAINT "call_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "call_logs" ADD CONSTRAINT "call_logs_wake_call_id_wake_calls_id_fk" FOREIGN KEY ("wake_call_id") REFERENCES "public"."wake_calls"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "billing_events" ADD CONSTRAINT "billing_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "data_processing_logs" ADD CONSTRAINT "data_processing_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "system_config" ADD CONSTRAINT "system_config_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
	ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_reward_id_rewards_catalog_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards_catalog"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" USING btree ("email");
CREATE INDEX IF NOT EXISTS "idx_users_stripe_customer" ON "users" USING btree ("stripe_customer_id");
CREATE INDEX IF NOT EXISTS "idx_users_country" ON "users" USING btree ("residence_country");
CREATE INDEX IF NOT EXISTS "idx_users_deleted" ON "users" USING btree ("deleted_at");

CREATE INDEX IF NOT EXISTS "idx_coins_balance" ON "user_coins" USING btree ("current_balance");
CREATE INDEX IF NOT EXISTS "idx_coins_level" ON "user_coins" USING btree ("level");

CREATE INDEX IF NOT EXISTS "idx_coin_tx_user_date" ON "coin_transactions" USING btree ("user_id","created_at");
CREATE INDEX IF NOT EXISTS "idx_coin_tx_type" ON "coin_transactions" USING btree ("transaction_type");

CREATE UNIQUE INDEX IF NOT EXISTS "idx_user_achievement" ON "user_achievements" USING btree ("user_id","achievement_id");
CREATE INDEX IF NOT EXISTS "idx_user_achievements" ON "user_achievements" USING btree ("user_id","unlocked_at");

CREATE INDEX IF NOT EXISTS "idx_wake_calls_user" ON "wake_calls" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "idx_wake_calls_enabled" ON "wake_calls" USING btree ("enabled");

CREATE INDEX IF NOT EXISTS "idx_habits_user" ON "habits" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "idx_habits_archived" ON "habits" USING btree ("is_archived");

CREATE INDEX IF NOT EXISTS "idx_completions_habit_date" ON "habit_completions" USING btree ("habit_id","completed_at");
CREATE INDEX IF NOT EXISTS "idx_completions_user_date" ON "habit_completions" USING btree ("user_id","completed_at");

CREATE INDEX IF NOT EXISTS "idx_custom_calls_user" ON "custom_calls" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "idx_custom_calls_scheduled" ON "custom_calls" USING btree ("scheduled_at");

CREATE INDEX IF NOT EXISTS "idx_call_logs_user_date" ON "call_logs" USING btree ("user_id","scheduled_time");
CREATE INDEX IF NOT EXISTS "idx_call_logs_status" ON "call_logs" USING btree ("status");

CREATE UNIQUE INDEX IF NOT EXISTS "idx_push_user_endpoint" ON "push_subscriptions" USING btree ("user_id","endpoint");
CREATE INDEX IF NOT EXISTS "idx_push_user" ON "push_subscriptions" USING btree ("user_id");

CREATE INDEX IF NOT EXISTS "idx_analytics_user_event" ON "analytics_events" USING btree ("user_id","event_name","created_at");
CREATE INDEX IF NOT EXISTS "idx_analytics_session" ON "analytics_events" USING btree ("session_id");

CREATE INDEX IF NOT EXISTS "idx_billing_user" ON "billing_events" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "idx_billing_stripe" ON "billing_events" USING btree ("stripe_event_id");

CREATE INDEX IF NOT EXISTS "idx_audit_admin" ON "audit_logs" USING btree ("admin_id");
CREATE INDEX IF NOT EXISTS "idx_audit_resource" ON "audit_logs" USING btree ("resource_type","resource_id");

CREATE INDEX IF NOT EXISTS "idx_processing_user" ON "data_processing_logs" USING btree ("user_id");

CREATE INDEX IF NOT EXISTS "idx_rewards_available" ON "rewards_catalog" USING btree ("available","coin_cost");
CREATE INDEX IF NOT EXISTS "idx_user_rewards" ON "user_rewards" USING btree ("user_id","status");

CREATE INDEX IF NOT EXISTS "idx_audio_cache_key" ON "audio_cache" USING btree ("cache_key");
CREATE INDEX IF NOT EXISTS "idx_audio_cache_usage" ON "audio_cache" USING btree ("usage_count");

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_wake_calls_updated_at ON wake_calls;
CREATE TRIGGER update_wake_calls_updated_at BEFORE UPDATE ON wake_calls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_user_coins_updated_at ON user_coins;
CREATE TRIGGER update_user_coins_updated_at BEFORE UPDATE ON user_coins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();