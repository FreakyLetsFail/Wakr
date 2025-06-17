-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUMs first
CREATE TYPE subscription_tier AS ENUM ('TRIAL', 'BASIC', 'PRO');
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE call_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'MISSED', 'CANCELLED');
CREATE TYPE habit_frequency AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM');
CREATE TYPE consent_type AS ENUM ('NECESSARY', 'ANALYTICS', 'MARKETING', 'ALL');

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verified_at TIMESTAMP,
  
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
  
  -- Authentication
  password_hash TEXT NOT NULL,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT, -- Encrypted
  
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

-- Habit completions
CREATE TABLE habit_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  completed_at TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  
  -- Optional metadata
  mood INTEGER, -- 1-5 scale
  energy_level INTEGER -- 1-5 scale
);

-- Wake calls configuration
CREATE TABLE wake_calls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Schedule
  enabled BOOLEAN DEFAULT TRUE,
  wake_time TIME NOT NULL,
  days_of_week INTEGER[], -- [1,2,3,4,5] for Mon-Fri
  
  -- Challenge configuration
  challenge_type VARCHAR(20) DEFAULT 'math',
  challenge_difficulty INTEGER DEFAULT 1,
  snooze_allowed BOOLEAN DEFAULT TRUE,
  snooze_duration INTEGER DEFAULT 5,
  max_snoozes INTEGER DEFAULT 3,
  
  -- Voice settings
  voice_speed DECIMAL(3,2) DEFAULT 1.0,
  voice_variant VARCHAR(20) DEFAULT 'friendly',
  custom_message TEXT,
  
  -- Analytics
  total_calls INTEGER DEFAULT 0,
  successful_calls INTEGER DEFAULT 0,
  failed_calls INTEGER DEFAULT 0,
  average_snoozes DECIMAL(3,2) DEFAULT 0,
  
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

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_users_country ON users(residence_country);
CREATE INDEX idx_users_deleted ON users(deleted_at);

CREATE INDEX idx_habits_user ON habits(user_id);
CREATE INDEX idx_habits_archived ON habits(is_archived);

CREATE INDEX idx_completions_habit_date ON habit_completions(habit_id, completed_at);
CREATE INDEX idx_completions_user_date ON habit_completions(user_id, completed_at);

CREATE INDEX idx_wake_calls_user ON wake_calls(user_id);
CREATE INDEX idx_wake_calls_enabled ON wake_calls(enabled);

CREATE INDEX idx_coins_balance ON user_coins(current_balance);
CREATE INDEX idx_coins_level ON user_coins(level);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wake_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Habits policies
CREATE POLICY "Users can view own habits" ON habits
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own habits" ON habits
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own habits" ON habits
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own habits" ON habits
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Habit completions policies
CREATE POLICY "Users can view own completions" ON habit_completions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own completions" ON habit_completions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Wake calls policies
CREATE POLICY "Users can manage own wake calls" ON wake_calls
  FOR ALL USING (auth.uid()::text = user_id::text);

-- User coins policies
CREATE POLICY "Users can view own coins" ON user_coins
  FOR ALL USING (auth.uid()::text = user_id::text);

-- ===============================================
-- ADDITIONAL TABLES FROM DRIZZLE SCHEMA
-- ===============================================

-- Coin transactions log
CREATE TABLE coin_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Transaction details
  amount INTEGER NOT NULL, -- positive for earned, negative for spent
  balance_after INTEGER NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'earned', 'spent', 'bonus'
  
  -- Source of coins
  source VARCHAR(50) NOT NULL, -- 'wake_challenge', 'habit_complete', 'streak_bonus', etc.
  source_id UUID, -- Reference to specific challenge/habit/etc
  
  -- Metadata
  description TEXT,
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Achievement info
  key VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT '🏆',
  
  -- Requirements
  requirement_type VARCHAR(50) NOT NULL, -- 'streak', 'total_habits', 'wake_challenges', etc.
  requirement_value INTEGER NOT NULL,
  
  -- Rewards
  coin_reward INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 0,
  badge_color VARCHAR(7) DEFAULT '#FFD700',
  
  -- Tier
  tier VARCHAR(20) DEFAULT 'bronze', -- bronze, silver, gold, platinum
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) NOT NULL,
  
  unlocked_at TIMESTAMP DEFAULT NOW(),
  seen BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Rewards catalog (for future use)
CREATE TABLE rewards_catalog (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Reward info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- 'digital', 'feature', 'discount', 'nft'
  
  -- Cost & availability
  coin_cost INTEGER NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  limited_quantity INTEGER, -- NULL = unlimited
  quantity_remaining INTEGER,
  
  -- Restrictions
  min_level INTEGER DEFAULT 1,
  subscription_tier_required subscription_tier DEFAULT NULL,
  
  -- Metadata for different reward types
  metadata JSONB DEFAULT '{}', -- NFT data, feature flags, etc.
  
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- User rewards (redeemed items)
CREATE TABLE user_rewards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES rewards_catalog(id) NOT NULL,
  
  -- Redemption details
  coins_spent INTEGER NOT NULL,
  redeemed_at TIMESTAMP DEFAULT NOW(),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, used, expired
  activated_at TIMESTAMP,
  expires_at TIMESTAMP,
  
  -- Reward-specific data
  reward_data JSONB DEFAULT '{}' -- NFT token ID, download link, etc.
);

-- Audio cache for cost-effective TTS
CREATE TABLE audio_cache (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cache_key VARCHAR(255) UNIQUE NOT NULL,
  
  language VARCHAR(10) NOT NULL,
  audio_type VARCHAR(50) NOT NULL,
  time VARCHAR(5),
  variant VARCHAR(50),
  
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER,
  text_content TEXT,
  
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Call logs for analytics
CREATE TABLE call_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  wake_call_id UUID REFERENCES wake_calls(id) ON DELETE SET NULL,
  
  -- Call details
  scheduled_time TIMESTAMP NOT NULL,
  initiated_at TIMESTAMP,
  answered_at TIMESTAMP,
  ended_at TIMESTAMP,
  
  -- Status
  status call_status NOT NULL DEFAULT 'SCHEDULED'::call_status,
  duration_seconds INTEGER,
  
  -- Challenge results
  challenge_presented BOOLEAN DEFAULT FALSE,
  challenge_completed BOOLEAN DEFAULT FALSE,
  challenge_attempts INTEGER DEFAULT 0,
  snooze_count INTEGER DEFAULT 0,
  
  -- Twilio data
  twilio_call_sid VARCHAR(255),
  twilio_status VARCHAR(50),
  twilio_price DECIMAL(10,4),
  twilio_price_unit VARCHAR(3) DEFAULT 'EUR',
  
  -- Call quality
  audio_quality INTEGER, -- 1-5 rating
  connection_quality INTEGER, -- 1-5 rating
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Custom reminders/calls
CREATE TABLE custom_calls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Schedule
  scheduled_at TIMESTAMP NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Configuration
  requires_confirmation BOOLEAN DEFAULT FALSE,
  repeat_count INTEGER DEFAULT 1,
  repeat_interval INTEGER DEFAULT 5, -- minutes
  
  -- Status
  status call_status DEFAULT 'SCHEDULED'::call_status,
  completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Push subscriptions
CREATE TABLE push_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Web Push API fields
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  
  -- Metadata
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Event data
  event_name VARCHAR(100) NOT NULL,
  event_category VARCHAR(50),
  event_properties JSONB DEFAULT '{}',
  
  -- Context
  session_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  
  -- Consent check
  has_analytics_consent BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Billing events
CREATE TABLE billing_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Event info
  event_type VARCHAR(50) NOT NULL, -- subscription_created, payment_succeeded, etc
  stripe_event_id VARCHAR(255) UNIQUE,
  
  -- Amount
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin audit log
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES users(id) NOT NULL,
  
  -- Action details
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- GDPR data processing log
CREATE TABLE data_processing_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Processing details
  processor VARCHAR(100) NOT NULL, -- system, admin_id, third_party
  purpose VARCHAR(100) NOT NULL, -- wake_call, analytics, support, etc
  legal_basis VARCHAR(50) NOT NULL, -- consent, contract, legitimate_interest
  
  -- Data categories
  data_categories TEXT[] NOT NULL, -- phone, location, habits, etc
  
  -- Third party sharing
  shared_with VARCHAR(100), -- twilio, stripe, etc
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- System configuration (for admin panel)
CREATE TABLE system_config (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===============================================
-- ADDITIONAL INDEXES
-- ===============================================

CREATE INDEX idx_coin_tx_user_date ON coin_transactions(user_id, created_at);
CREATE INDEX idx_coin_tx_type ON coin_transactions(transaction_type);

CREATE INDEX idx_user_achievements ON user_achievements(user_id, unlocked_at);

CREATE INDEX idx_rewards_available ON rewards_catalog(available, coin_cost);
CREATE INDEX idx_user_rewards ON user_rewards(user_id, status);

CREATE INDEX idx_audio_cache_key ON audio_cache(cache_key);
CREATE INDEX idx_audio_cache_usage ON audio_cache(usage_count);

CREATE INDEX idx_call_logs_user_date ON call_logs(user_id, scheduled_time);
CREATE INDEX idx_call_logs_status ON call_logs(status);

CREATE INDEX idx_custom_calls_user ON custom_calls(user_id);
CREATE INDEX idx_custom_calls_scheduled ON custom_calls(scheduled_at);

CREATE INDEX idx_push_user ON push_subscriptions(user_id);

CREATE INDEX idx_analytics_user_event ON analytics_events(user_id, event_name, created_at);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);

CREATE INDEX idx_billing_user ON billing_events(user_id);
CREATE INDEX idx_billing_stripe ON billing_events(stripe_event_id);

CREATE INDEX idx_audit_admin ON audit_logs(admin_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);

CREATE INDEX idx_processing_user ON data_processing_logs(user_id);