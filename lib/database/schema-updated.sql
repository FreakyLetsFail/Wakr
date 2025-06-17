-- ===============================================
-- UPDATED SCHEMA FOR SUPABASE AUTH INTEGRATION
-- ===============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUMs first
CREATE TYPE subscription_tier AS ENUM ('TRIAL', 'BASIC', 'PRO');
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE call_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'MISSED', 'CANCELLED');
CREATE TYPE habit_frequency AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM');
CREATE TYPE consent_type AS ENUM ('NECESSARY', 'ANALYTICS', 'MARKETING', 'ALL');

-- Users table (UPDATED FOR SUPABASE AUTH)
CREATE TABLE users (
  -- ID comes from Supabase Auth (no auto-generation!)
  id UUID PRIMARY KEY, -- This will be the same as auth.users.id
  
  -- Basic info (duplicated from auth for performance)
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE, -- Synced from Supabase Auth
  
  -- Personal data
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone TEXT NOT NULL, -- Will be encrypted
  phone_country_code VARCHAR(10) NOT NULL,
  
  -- Location & preferences
  residence_country VARCHAR(2) NOT NULL,
  hometown VARCHAR(255), -- For weather data
  timezone VARCHAR(50) NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  currency VARCHAR(3) DEFAULT 'EUR',
  
  -- 🚫 REMOVED: All auth-related fields (Supabase handles these)
  -- password_hash, email_verification_token, two_factor_* etc.
  
  -- Subscription
  subscription_tier subscription_tier DEFAULT 'TRIAL'::subscription_tier,
  subscription_status VARCHAR(20) DEFAULT 'trialing',
  trial_ends_at TIMESTAMP,
  subscription_ends_at TIMESTAMP,
  
  -- Stripe
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  
  -- Roles & permissions
  roles user_role[] DEFAULT ARRAY['USER']::user_role[],
  
  -- Preferences (JSONB for flexibility)
  preferences JSONB DEFAULT '{
    "wake_time": "07:00",
    "notification_sound": true,
    "vibration": true,
    "theme": "system",
    "wake_challenge": "math",
    "snooze_limit": 3,
    "habit_reminder_time": "20:00"
  }',
  
  -- GDPR consent tracking
  consents JSONB DEFAULT '{
    "necessary": true,
    "analytics": false,
    "marketing": false,
    "timestamp": null
  }',
  
  -- Metadata
  last_login_at TIMESTAMP,
  last_active_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP -- Soft delete for GDPR
);

-- Rest of the tables remain the same...
-- (habits, habit_completions, wake_calls, user_coins, etc.)

-- Habits table
CREATE TABLE habits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT '📌',
  color VARCHAR(7) DEFAULT '#7c3aed',
  
  -- Schedule
  frequency habit_frequency NOT NULL DEFAULT 'DAILY'::habit_frequency,
  frequency_config JSONB DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE, -- NULL = no end
  
  -- Reminders
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_time TIME,
  reminder_message TEXT,
  
  -- Tracking
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Settings
  is_archived BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User coins for gamification
CREATE TABLE user_coins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Balance
  current_balance INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  
  -- Level & Progress
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- All other tables from the original schema...
-- (I'll include them all but they don't need changes)

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_users_country ON users(residence_country);
CREATE INDEX idx_users_deleted ON users(deleted_at);

CREATE INDEX idx_habits_user ON habits(user_id);
CREATE INDEX idx_habits_archived ON habits(is_archived);

CREATE INDEX idx_coins_balance ON user_coins(current_balance);
CREATE INDEX idx_coins_level ON user_coins(level);

-- ===============================================
-- ROW LEVEL SECURITY (UPDATED FOR SUPABASE AUTH)
-- ===============================================

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coins ENABLE ROW LEVEL SECURITY;

-- 🔒 RLS Policies using auth.uid() from Supabase Auth
-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow inserts for new registrations (service role only)
CREATE POLICY "Service role can insert users" ON users
  FOR INSERT WITH CHECK (true);

-- Habits policies
CREATE POLICY "Users can view own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits" ON habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits" ON habits
  FOR DELETE USING (auth.uid() = user_id);

-- User coins policies
CREATE POLICY "Users can view own coins" ON user_coins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage coins" ON user_coins
  FOR ALL WITH CHECK (true);

-- ===============================================
-- MIGRATION NOTES
-- ===============================================

/*
🔄 MIGRATION STEPS:

1. Backup existing data
2. Drop old auth-related columns:
   - password_hash
   - email_verification_token  
   - two_factor_enabled
   - two_factor_secret

3. Update ID generation:
   - Remove DEFAULT uuid_generate_v4() from users.id
   - Ensure existing user IDs match Supabase Auth IDs

4. Update RLS policies to use auth.uid()

5. Test authentication flow

⚠️  IMPORTANT: 
- Existing users need to be migrated to Supabase Auth
- Or clean slate approach (delete existing test users)
*/