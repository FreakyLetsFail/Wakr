# Wakr

# Claude.MD - Wakr.app Complete Implementation Guide

## 🎯 Project Overview

**Wakr.app** - Eine Progressive Web App für Wake-up Calls mit Habit Tracking. MVP-Launch in 4-6 Wochen mit Fokus auf EU-Markt.

### Quick Facts
- **Preise**: €9.99 (Basic) / €19.99 (Pro) pro Monat
- **Markt**: EU-only (Geoblocking für Non-EU)
- **Stack**: Next.js 15.3.3, Supabase, Vercel, Twilio
- **Timeline**: 4-6 Wochen MVP

## 📁 Complete File Structure

```
wakr/
├── .env.local                          # Environment variables
├── .env.production                     # Production env
├── .gitignore                          # Git ignore
├── next.config.ts                      # Next.js config
├── tsconfig.json                       # TypeScript config
├── package.json                        # Dependencies
├── tailwind.config.ts                  # Tailwind config
├── drizzle.config.ts                   # Drizzle ORM config
├── middleware.ts                       # Auth & geo-blocking
├── auth.ts                             # NextAuth.js v5
├── instrumentation.ts                  # Monitoring setup
│
├── public/
│   ├── icons/
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   ├── sw.js                           # Service Worker
│   └── sw-push.js                      # Push handler
│
├── app/
│   ├── layout.tsx                      # Root layout
│   ├── globals.css                     # Global styles
│   ├── manifest.ts                     # PWA manifest
│   ├── loading.tsx                     # Global loading
│   ├── error.tsx                       # Error boundary
│   ├── not-found.tsx                   # 404 page
│   ├── page.tsx                        # Landing page
│   │
│   ├── (marketing)/
│   │   ├── layout.tsx                  # Marketing layout
│   │   ├── pricing/page.tsx            # Pricing page
│   │   ├── features/page.tsx           # Features page
│   │   └── how-it-works/page.tsx       # How it works
│   │
│   ├── (auth)/
│   │   ├── layout.tsx                  # Auth layout
│   │   ├── login/page.tsx              # Login
│   │   ├── register/page.tsx           # Register
│   │   ├── verify-email/page.tsx       # Email verification
│   │   └── forgot-password/page.tsx    # Password reset
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Dashboard layout
│   │   ├── page.tsx                    # Dashboard home
│   │   ├── onboarding/
│   │   │   ├── page.tsx                # Onboarding flow
│   │   │   └── steps/
│   │   │       ├── welcome.tsx
│   │   │       ├── wake-time.tsx
│   │   │       ├── habits.tsx
│   │   │       └── complete.tsx
│   │   ├── wake-calls/
│   │   │   ├── page.tsx                # Wake calls config
│   │   │   └── test/page.tsx           # Test call
│   │   ├── habits/
│   │   │   ├── page.tsx                # Habits list
│   │   │   ├── new/page.tsx            # New habit
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Habit detail
│   │   │       └── edit/page.tsx       # Edit habit
│   │   ├── custom-calls/
│   │   │   ├── page.tsx                # Custom reminders
│   │   │   └── new/page.tsx            # New reminder
│   │   ├── analytics/
│   │   │   └── page.tsx                # User analytics
│   │   ├── settings/
│   │   │   ├── page.tsx                # Settings home
│   │   │   ├── profile/page.tsx        # Profile settings
│   │   │   ├── notifications/page.tsx  # Notifications
│   │   │   ├── billing/page.tsx        # Billing
│   │   │   ├── privacy/page.tsx        # Privacy settings
│   │   │   └── danger/page.tsx         # Account deletion
│   │   └── admin/                      # Admin panel
│   │       ├── page.tsx                # Admin dashboard
│   │       ├── users/page.tsx          # User management
│   │       ├── countries/page.tsx      # Country settings
│   │       └── system/page.tsx         # System health
│   │
│   ├── (legal)/
│   │   ├── layout.tsx                  # Legal layout
│   │   ├── impressum/page.tsx          # Impressum (required)
│   │   ├── datenschutz/page.tsx        # Privacy policy
│   │   ├── agb/page.tsx                # Terms of service
│   │   ├── cookies/page.tsx            # Cookie policy
│   │   └── widerruf/page.tsx           # Cancellation
│   │
│   └── api/
│       ├── trpc/
│       │   └── [trpc]/route.ts         # tRPC endpoint
│       ├── webhooks/
│       │   ├── twilio/
│       │   │   ├── voice/route.ts      # Voice webhook
│       │   │   └── status/route.ts     # Status webhook
│       │   └── stripe/
│       │       └── route.ts            # Stripe webhook
│       ├── push/
│       │   ├── subscribe/route.ts      # Push subscription
│       │   └── send/route.ts           # Send push
│       ├── cron/
│       │   ├── wake-calls/route.ts     # Schedule calls
│       │   ├── reminders/route.ts      # Habit reminders
│       │   └── cleanup/route.ts        # Data cleanup
│       └── health/route.ts             # Health check
│
├── components/
│   ├── ui/                             # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── [etc...]
│   │
│   ├── layouts/
│   │   ├── header.tsx                  # App header
│   │   ├── sidebar.tsx                 # Dashboard sidebar
│   │   ├── mobile-nav.tsx              # Mobile navigation
│   │   └── footer.tsx                  # App footer
│   │
│   ├── marketing/
│   │   ├── hero.tsx                    # Landing hero
│   │   ├── features-grid.tsx           # Features section
│   │   ├── pricing-cards.tsx           # Pricing cards
│   │   ├── testimonials.tsx            # Testimonials
│   │   └── cta-section.tsx             # Call to action
│   │
│   ├── auth/
│   │   ├── login-form.tsx              # Login form
│   │   ├── register-form.tsx           # Register form
│   │   ├── social-login.tsx            # OAuth buttons
│   │   └── auth-guard.tsx              # Auth protection
│   │
│   ├── wake-calls/
│   │   ├── time-picker.tsx             # Wake time picker
│   │   ├── weekday-selector.tsx        # Days selector
│   │   ├── challenge-config.tsx        # Challenge setup
│   │   ├── test-call-button.tsx        # Test call
│   │   └── call-history.tsx            # Call logs
│   │
│   ├── habits/
│   │   ├── habit-card.tsx              # Habit card
│   │   ├── habit-grid.tsx              # GitHub-style grid
│   │   ├── habit-form.tsx              # Create/edit form
│   │   ├── completion-modal.tsx        # Mark complete
│   │   └── streak-display.tsx          # Streak counter
│   │
│   ├── billing/
│   │   ├── subscription-card.tsx       # Current plan
│   │   ├── upgrade-modal.tsx           # Upgrade flow
│   │   ├── payment-form.tsx            # Stripe payment
│   │   └── invoice-list.tsx            # Invoice history
│   │
│   ├── privacy/
│   │   ├── cookie-banner.tsx           # Cookie consent
│   │   ├── consent-manager.tsx         # Consent settings
│   │   ├── data-export.tsx             # GDPR export
│   │   └── delete-account.tsx          # Account deletion
│   │
│   └── common/
│       ├── loading-spinner.tsx         # Loading state
│       ├── error-boundary.tsx          # Error handling
│       ├── empty-state.tsx             # Empty states
│       ├── confirmation-modal.tsx      # Confirmations
│       └── notification-bell.tsx       # Notifications
│
├── lib/
│   ├── constants.ts                    # App constants
│   ├── utils.ts                        # Utility functions
│   ├── crypto.ts                       # Encryption utils
│   ├── countries.ts                    # EU countries list
│   ├── validations.ts                  # Zod schemas
│   ├── twilio.ts                       # Twilio client
│   ├── stripe.ts                       # Stripe client
│   ├── supabase.ts                     # Supabase client
│   ├── push.ts                         # Push notifications
│   ├── analytics.ts                    # Analytics helpers
│   └── email.ts                        # Email templates
│
├── hooks/
│   ├── use-auth.ts                     # Auth hook
│   ├── use-subscription.ts             # Subscription state
│   ├── use-location.ts                 # Geolocation
│   ├── use-push.ts                     # Push notifications
│   ├── use-theme.ts                    # Theme toggle
│   └── use-media-query.ts              # Responsive
│
├── server/
│   ├── db/
│   │   ├── schema.ts                   # Complete schema
│   │   ├── index.ts                    # DB connection
│   │   └── migrations/                 # SQL migrations
│   │       ├── 0001_initial.sql
│   │       ├── 0002_add_analytics.sql
│   │       └── [etc...]
│   │
│   ├── api/
│   │   ├── trpc.ts                     # tRPC setup
│   │   ├── context.ts                  # tRPC context
│   │   └── routers/
│   │       ├── auth.ts                 # Auth procedures
│   │       ├── users.ts                # User management
│   │       ├── wake-calls.ts           # Wake calls
│   │       ├── habits.ts               # Habits
│   │       ├── billing.ts              # Subscriptions
│   │       ├── analytics.ts            # Analytics
│   │       └── admin.ts                # Admin
│   │
│   └── services/
│       ├── twilio/
│       │   ├── voice.ts                # Voice calls
│       │   ├── twiml.ts                # TwiML generation
│       │   └── challenges.ts           # Wake challenges
│       ├── stripe/
│       │   ├── subscriptions.ts        # Subscription logic
│       │   ├── webhooks.ts             # Webhook handlers
│       │   └── invoices.ts             # Invoice generation
│       ├── notifications/
│       │   ├── push.ts                 # Push service
│       │   ├── email.ts                # Email service
│       │   └── scheduler.ts            # Notification scheduler
│       └── analytics/
│           ├── events.ts               # Event tracking
│           ├── metrics.ts              # Metrics calculation
│           └── reports.ts              # Report generation
│
├── stores/
│   ├── auth.ts                         # Auth store (Zustand)
│   ├── user.ts                         # User preferences
│   ├── habits.ts                       # Habits cache
│   └── ui.ts                           # UI state
│
├── types/
│   ├── index.ts                        # Global types
│   ├── api.ts                          # API types
│   ├── database.ts                     # DB types
│   └── twilio.ts                       # Twilio types
│
├── scripts/
│   ├── setup.ts                        # Initial setup
│   ├── seed.ts                         # Seed database
│   └── generate-icons.ts               # Generate PWA icons
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## 🗄️ Complete Database Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE subscription_tier AS ENUM ('TRIAL', 'BASIC', 'PRO');
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE call_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'MISSED', 'CANCELLED');
CREATE TYPE habit_frequency AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM');
CREATE TYPE consent_type AS ENUM ('NECESSARY', 'ANALYTICS', 'MARKETING', 'ALL');

-- Coins table for gamification
CREATE TABLE user_coins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Balance
  current_balance INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  
  -- Level & Progress
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id),
  INDEX idx_coins_balance (current_balance DESC),
  INDEX idx_coins_level (level DESC)
);

-- Coin transactions log
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
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
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_coin_tx_user_date (user_id, created_at DESC),
  INDEX idx_coin_tx_type (transaction_type)
);

-- Achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
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
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  seen BOOLEAN DEFAULT false,
  
  UNIQUE(user_id, achievement_id),
  INDEX idx_user_achievements (user_id, unlocked_at DESC)
);

-- Rewards catalog (for future use)
CREATE TABLE rewards_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Reward info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- 'digital', 'feature', 'discount', 'nft'
  
  -- Cost & availability
  coin_cost INTEGER NOT NULL,
  available BOOLEAN DEFAULT true,
  limited_quantity INTEGER, -- NULL = unlimited
  quantity_remaining INTEGER,
  
  -- Restrictions
  min_level INTEGER DEFAULT 1,
  subscription_tier_required subscription_tier,
  
  -- Metadata for different reward types
  metadata JSONB DEFAULT '{}', -- NFT data, feature flags, etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  INDEX idx_rewards_available (available, coin_cost)
);

-- User rewards (redeemed items)
CREATE TABLE user_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards_catalog(id),
  
  -- Redemption details
  coins_spent INTEGER NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, used, expired
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- Reward-specific data
  reward_data JSONB DEFAULT '{}', -- NFT token ID, download link, etc.
  
  INDEX idx_user_rewards (user_id, status)
);

-- Leaderboard view
CREATE VIEW leaderboard AS
SELECT 
  u.id,
  u.first_name,
  u.last_name,
  uc.current_balance,
  uc.level,
  uc.total_earned,
  COUNT(DISTINCT ua.achievement_id) as achievements_count,
  RANK() OVER (ORDER BY uc.level DESC, uc.total_earned DESC) as global_rank
FROM users u
JOIN user_coins uc ON u.id = uc.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.first_name, u.last_name, uc.current_balance, uc.level, uc.total_earned;

-- Initial achievements data
INSERT INTO achievements (key, name, description, icon, requirement_type, requirement_value, coin_reward, xp_reward, tier) VALUES
  -- Wake-up achievements
  ('first_wake', 'Early Bird', 'Complete your first wake-up challenge', '🌅', 'wake_challenges', 1, 50, 50, 'bronze'),
  ('wake_week', 'Week Warrior', 'Complete wake-up challenges for 7 days', '💪', 'wake_challenges', 7, 100, 100, 'silver'),
  ('wake_month', 'Morning Master', 'Complete wake-up challenges for 30 days', '👑', 'wake_challenges', 30, 500, 500, 'gold'),
  
  -- Habit achievements
  ('first_habit', 'Habit Starter', 'Complete your first habit', '✅', 'total_habits', 1, 25, 25, 'bronze'),
  ('habit_streak_7', 'Consistent', '7-day habit streak', '🔥', 'streak', 7, 75, 75, 'bronze'),
  ('habit_streak_30', 'Unstoppable', '30-day habit streak', '⚡', 'streak', 30, 300, 300, 'silver'),
  ('habit_streak_100', 'Legendary', '100-day habit streak', '💎', 'streak', 100, 1000, 1000, 'platinum'),
  
  -- Level achievements
  ('level_5', 'Rising Star', 'Reach level 5', '⭐', 'level', 5, 100, 0, 'bronze'),
  ('level_10', 'Dedicated', 'Reach level 10', '🌟', 'level', 10, 250, 0, 'silver'),
  ('level_25', 'Elite', 'Reach level 25', '✨', 'level', 25, 1000, 0, 'gold'),
  
  -- Special achievements
  ('no_snooze_week', 'No Snooze', 'Week without using snooze', '⏰', 'no_snooze', 7, 200, 200, 'silver'),
  ('perfect_week', 'Perfect Week', 'Complete all habits for a week', '💯', 'perfect_week', 1, 150, 150, 'silver');

-- Coin reward configuration
INSERT INTO system_config (key, value, description) VALUES
  ('coin_rewards', '{
    "wake_challenge_completed": 10,
    "wake_challenge_no_snooze": 15,
    "habit_completed": 5,
    "habit_streak_3": 20,
    "habit_streak_7": 50,
    "habit_streak_30": 200,
    "daily_login": 5,
    "perfect_day": 25,
    "level_up_multiplier": 50
  }', 'Coin rewards for different actions'),
  ('xp_requirements', '[100, 250, 500, 1000, 1500, 2500, 4000, 6000, 9000, 15000]', 'XP required for each level');

-- Level benefits configuration
INSERT INTO system_config (key, value, description) VALUES
  ('level_benefits', '{
    "5": {"title": "Rising Star", "perks": ["Custom badge color", "5% mehr Coins"]},
    "10": {"title": "Dedicated", "perks": ["Exclusive themes", "10% mehr Coins"]},
    "15": {"title": "Champion", "perks": ["Beta features", "15% mehr Coins"]},
    "20": {"title": "Master", "perks": ["VIP support", "20% mehr Coins"]},
    "25": {"title": "Legend", "perks": ["Lifetime recognition", "25% mehr Coins"]}
  }', 'Benefits for reaching certain levels');
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255),
  email_verified_at TIMESTAMPTZ,
  
  -- Personal data (encrypted where necessary)
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone TEXT NOT NULL, -- Encrypted
  phone_country_code VARCHAR(10) NOT NULL,
  
  -- Location & preferences
  residence_country VARCHAR(2) NOT NULL,
  timezone VARCHAR(50) NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  currency VARCHAR(3) DEFAULT 'EUR',
  
  -- Authentication
  password_hash TEXT NOT NULL,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT, -- Encrypted
  
  -- Subscription
  subscription_tier subscription_tier DEFAULT 'TRIAL',
  subscription_status VARCHAR(20) DEFAULT 'trialing',
  trial_ends_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
  subscription_ends_at TIMESTAMPTZ,
  
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
  }'::jsonb,
  
  -- GDPR consent tracking
  consents JSONB DEFAULT '{
    "necessary": true,
    "analytics": false,
    "marketing": false,
    "timestamp": null
  }'::jsonb,
  
  -- Metadata
  last_login_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ, -- Soft delete for GDPR
  
  -- Indexes
  INDEX idx_users_email (email),
  INDEX idx_users_stripe_customer (stripe_customer_id),
  INDEX idx_users_country (residence_country),
  INDEX idx_users_deleted (deleted_at)
);

-- Wake calls configuration
CREATE TABLE wake_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Schedule
  enabled BOOLEAN DEFAULT true,
  wake_time TIME NOT NULL,
  days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5], -- Mon-Fri
  
  -- Challenge configuration
  challenge_type VARCHAR(20) DEFAULT 'math', -- math, repeat, none
  challenge_difficulty INTEGER DEFAULT 1, -- 1-5
  snooze_allowed BOOLEAN DEFAULT true,
  snooze_duration INTEGER DEFAULT 5, -- minutes
  max_snoozes INTEGER DEFAULT 3,
  
  -- Voice settings
  voice_speed DECIMAL(3,2) DEFAULT 1.0, -- 0.5-2.0
  voice_variant VARCHAR(20) DEFAULT 'friendly', -- friendly, energetic, calm
  custom_message TEXT,
  
  -- Analytics
  total_calls INTEGER DEFAULT 0,
  successful_calls INTEGER DEFAULT 0,
  failed_calls INTEGER DEFAULT 0,
  average_snoozes DECIMAL(3,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_wake_calls_user (user_id),
  INDEX idx_wake_calls_enabled (enabled)
);

-- Call logs for analytics
CREATE TABLE call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wake_call_id UUID REFERENCES wake_calls(id) ON DELETE SET NULL,
  
  -- Call details
  scheduled_time TIMESTAMPTZ NOT NULL,
  initiated_at TIMESTAMPTZ,
  answered_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  
  -- Status
  status call_status NOT NULL DEFAULT 'SCHEDULED',
  duration_seconds INTEGER,
  
  -- Challenge results
  challenge_presented BOOLEAN DEFAULT false,
  challenge_completed BOOLEAN DEFAULT false,
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
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_call_logs_user_date (user_id, scheduled_time DESC),
  INDEX idx_call_logs_status (status)
);

-- Habits table
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT '📌',
  color VARCHAR(7) DEFAULT '#7c3aed',
  
  -- Schedule
  frequency habit_frequency NOT NULL DEFAULT 'DAILY',
  frequency_config JSONB DEFAULT '{}', -- For custom frequencies
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE, -- NULL = no end
  
  -- Reminders
  reminder_enabled BOOLEAN DEFAULT false,
  reminder_time TIME,
  reminder_message TEXT,
  
  -- Tracking
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0, -- Percentage
  
  -- Settings
  is_archived BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false, -- For future social features
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_habits_user (user_id),
  INDEX idx_habits_archived (is_archived)
);

-- Habit completions
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  
  -- Optional metadata
  mood INTEGER, -- 1-5 scale
  energy_level INTEGER, -- 1-5 scale
  
  INDEX idx_completions_habit_date (habit_id, completed_at DESC),
  INDEX idx_completions_user_date (user_id, completed_at DESC)
);

-- Custom reminders/calls
CREATE TABLE custom_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Schedule
  scheduled_at TIMESTAMPTZ NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Configuration
  requires_confirmation BOOLEAN DEFAULT false,
  repeat_count INTEGER DEFAULT 1,
  repeat_interval INTEGER DEFAULT 5, -- minutes
  
  -- Status
  status call_status DEFAULT 'SCHEDULED',
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_custom_calls_user (user_id),
  INDEX idx_custom_calls_scheduled (scheduled_at)
);

-- Push subscriptions
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Web Push API fields
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  
  -- Metadata
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, endpoint),
  INDEX idx_push_user (user_id)
);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  has_analytics_consent BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_analytics_user_event (user_id, event_name, created_at DESC),
  INDEX idx_analytics_session (session_id)
);

-- Billing events
CREATE TABLE billing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Event info
  event_type VARCHAR(50) NOT NULL, -- subscription_created, payment_succeeded, etc
  stripe_event_id VARCHAR(255) UNIQUE,
  
  -- Amount
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_billing_user (user_id),
  INDEX idx_billing_stripe (stripe_event_id)
);

-- Admin audit log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id),
  
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
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_audit_admin (admin_id),
  INDEX idx_audit_resource (resource_type, resource_id)
);

-- GDPR data processing log
CREATE TABLE data_processing_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Processing details
  processor VARCHAR(100) NOT NULL, -- system, admin_id, third_party
  purpose VARCHAR(100) NOT NULL, -- wake_call, analytics, support, etc
  legal_basis VARCHAR(50) NOT NULL, -- consent, contract, legitimate_interest
  
  -- Data categories
  data_categories TEXT[] NOT NULL, -- phone, location, habits, etc
  
  -- Third party sharing
  shared_with VARCHAR(100), -- twilio, stripe, etc
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_processing_user (user_id)
);

-- System configuration (for admin panel)
CREATE TABLE system_config (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial system config
INSERT INTO system_config (key, value, description) VALUES
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('allowed_countries', '["DE", "AT", "CH", "FR", "IT", "ES", "NL", "BE", "LU", "DK", "SE", "FI", "IE", "PT", "GR", "PL", "CZ", "HU", "RO", "BG", "HR", "SI", "SK", "EE", "LV", "LT", "MT", "CY"]', 'EU countries allowed for registration'),
  ('twilio_webhook_url', '"https://wakr.app/api/webhooks/twilio"', 'Twilio webhook URL'),
  ('max_habits_basic', '10', 'Maximum habits for basic tier'),
  ('max_custom_calls_basic', '5', 'Maximum custom calls per month for basic tier'),
  ('max_custom_calls_pro', '20', 'Maximum custom calls per month for pro tier'),
  ('trial_duration_hours', '24', 'Trial duration in hours');

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_wake_calls_updated_at BEFORE UPDATE ON wake_calls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for performance
CREATE INDEX idx_users_subscription ON users(subscription_tier, subscription_status);
CREATE INDEX idx_call_logs_wake_time ON call_logs(scheduled_time);
CREATE INDEX idx_habits_reminder ON habits(reminder_enabled, reminder_time) WHERE reminder_enabled = true;
CREATE INDEX idx_custom_calls_pending ON custom_calls(scheduled_at) WHERE status = 'SCHEDULED';
```

## 🔧 Configuration Files

### package.json
```json
{
  "name": "wakr",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit migrate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "stripe:listen": "stripe listen --forward-to localhost:3000/api/webhooks/stripe",
    "ngrok": "ngrok http 3000"
  },
  "dependencies": {
    "next": "15.3.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@auth/drizzle-adapter": "^1.0.0",
    "next-auth": "^5.0.0-beta.20",
    "drizzle-orm": "^0.33.0",
    "postgres": "^3.4.4",
    "@supabase/supabase-js": "^2.39.0",
    "@trpc/client": "^11.0.0-rc.446",
    "@trpc/react-query": "^11.0.0-rc.446",
    "@trpc/server": "^11.0.0-rc.446",
    "@tanstack/react-query": "^5.51.23",
    "twilio": "^5.2.0",
    "stripe": "^16.0.0",
    "@stripe/stripe-js": "^4.1.0",
    "zod": "^3.23.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.9.0",
    "date-fns": "^3.6.0",
    "date-fns-tz": "^3.1.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "web-push": "^3.6.7",
    "sonner": "^1.5.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0",
    "lucide-react": "^0.417.0",
    "framer-motion": "^11.3.0",
    "libphonenumber-js": "^1.11.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/web-push": "^3.6.3",
    "typescript": "^5.5.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "drizzle-kit": "^0.24.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "15.3.3",
    "@typescript-eslint/parser": "^7.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0"
  }
}
```

### next.config.ts
```typescript
import type { NextConfig } from 'next'

const config: NextConfig = {
  experimental: {
    ppr: true, // Partial Prerendering
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // PWA headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
    ]
  },
  
  // Redirect non-EU traffic
  async redirects() {
    return [
      {
        source: '/app/:path*',
        has: [
          {
            type: 'header',
            key: 'x-vercel-ip-country',
            value: '(?!AT|BE|BG|HR|CY|CZ|DK|EE|FI|FR|DE|GR|HU|IE|IT|LV|LT|LU|MT|NL|PL|PT|RO|SK|SI|ES|SE).*',
          },
        ],
        destination: '/not-available',
        permanent: false,
      },
    ]
  },
  
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
}

export default config
```

### .env.local
```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-KEY]"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[GENERATE-WITH-OPENSSL]"

# Encryption
ENCRYPTION_KEY="[32-BYTE-HEX-KEY]"

# Twilio (Free trial first)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"

# Stripe (Test mode)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_BASIC_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."

# Web Push
NEXT_PUBLIC_VAPID_PUBLIC_KEY="[GENERATE]"
VAPID_PRIVATE_KEY="[GENERATE]"
VAPID_SUBJECT="mailto:support@wakr.app"

# Email (optional for MVP)
RESEND_API_KEY="re_..."

# Admin
ADMIN_EMAILS="your-email@example.com"

# Feature Flags
NEXT_PUBLIC_MAINTENANCE_MODE="false"
```

### middleware.ts
```typescript
import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// EU country codes
const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
]

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check country for registration
  if (pathname === '/register') {
    const country = request.headers.get('x-vercel-ip-country') || 
                   request.headers.get('cf-ipcountry') || 
                   'unknown'
    
    if (!EU_COUNTRIES.includes(country) && country !== 'unknown') {
      return NextResponse.redirect(new URL('/not-available', request.url))
    }
  }
  
  // Auth protection
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    const session = await auth()
    
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Admin protection
    if (pathname.startsWith('/admin') && !session.user.roles?.includes('ADMIN')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  // Add security headers
  const response = NextResponse.next()
  
  // GDPR Cookie consent check
  const hasConsent = request.cookies.get('cookie-consent')
  if (!hasConsent && !pathname.startsWith('/legal')) {
    response.headers.set('X-Show-Cookie-Banner', 'true')
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icons).*)',
  ],
}
```

## 🚀 Implementation Timeline (4-6 Weeks)

### Week 1: Foundation & Auth
- [ ] Day 1-2: Project setup, database, environment
- [ ] Day 3-4: Auth system (NextAuth.js, registration, login)
- [ ] Day 5-6: Dashboard layout, basic UI components
- [ ] Day 7: Testing & deployment to Vercel

### Week 2: Core Features
- [ ] Day 8-9: Wake calls configuration UI
- [ ] Day 10-11: Twilio integration & webhooks
- [ ] Day 12-13: Habits system (CRUD, completions)
- [ ] Day 14: GitHub-style habit grid

### Week 3: Subscriptions & Billing
- [ ] Day 15-16: Stripe integration
- [ ] Day 17-18: Subscription management
- [ ] Day 19-20: Trial logic & limits
- [ ] Day 21: Invoice generation

### Week 4: Polish & Compliance
- [ ] Day 22-23: PWA setup & push notifications
- [ ] Day 24-25: GDPR compliance (cookie banner, privacy)
- [ ] Day 26-27: Analytics & admin panel
- [ ] Day 28: Final testing

### Week 5-6: Launch Prep
- [ ] Legal documents (Impressum, AGB, Datenschutz)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Beta testing
- [ ] Marketing website
- [ ] Launch! 🚀

## 💰 Cost Estimation (Free Tiers)

### Monthly Costs (0-100 Users)
- **Vercel**: €0 (Hobby plan)
- **Supabase**: €0 (Free tier: 500MB, 50k requests)
- **Twilio**: €20-50 (depends on usage)
- **Stripe**: 2.9% + €0.25 per transaction
- **Domain**: €1/month
- **Total**: ~€30-60/month

### When to Upgrade
- Vercel Pro: At 100+ daily users (€20/month)
- Supabase Pro: At 500MB database or 100k requests (€25/month)
- Consider AWS/GCP at 1000+ users

## 🔒 Security Checklist

- [x] Environment variables properly configured
- [x] Database connections use SSL
- [x] Passwords hashed with bcrypt
- [x] Phone numbers encrypted at rest
- [x] HTTPS only (Vercel handles this)
- [x] SQL injection protection (Drizzle ORM)
- [x] XSS protection (React)
- [x] CSRF protection (NextAuth)
- [x] Rate limiting (Vercel)
- [x] Input validation (Zod)
- [x] Secure headers (middleware)
- [x] Admin audit logging
- [x] GDPR compliance

## 📱 PWA Implementation

### manifest.ts
```typescript
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wakr - Wake Up to Success',
    short_name: 'Wakr',
    description: 'Personalized wake-up calls and habit tracking',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#7c3aed',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      }
    ],
    shortcuts: [
      {
        name: 'Wake Calls',
        short_name: 'Wake',
        description: 'Configure wake-up calls',
        url: '/dashboard/wake-calls',
        icons: [{ src: '/icons/wake-96.png', sizes: '96x96' }]
      },
      {
        name: 'Habits',
        short_name: 'Habits',
        description: 'Track your habits',
        url: '/dashboard/habits',
        icons: [{ src: '/icons/habits-96.png', sizes: '96x96' }]
      }
    ],
    categories: ['productivity', 'lifestyle'],
  }
}
```

### Service Worker (public/sw.js)
```javascript
const CACHE_NAME = 'wakr-v1';
const urlsToCache = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        return caches.match('/offline');
      })
  );
});

// Push event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Zeit für deine Gewohnheit!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1',
      url: data.url || '/'
    },
    actions: [
      {
        action: 'complete',
        title: '✓ Erledigt',
        icon: '/icons/check.png'
      },
      {
        action: 'snooze',
        title: '⏰ Später',
        icon: '/icons/snooze.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Wakr', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'complete') {
    // Mark habit as complete
    fetch('/api/habits/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: event.notification.data.primaryKey })
    });
  } else if (event.action === 'snooze') {
    // Snooze for 10 minutes
    setTimeout(() => {
      self.registration.showNotification('Erinnerung', {
        body: 'Zeit für deine Gewohnheit!',
        icon: '/icons/icon-192x192.png'
      });
    }, 10 * 60 * 1000);
  } else {
    // Open app
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
```

## 🎨 UI Components Examples

### Cookie Banner (components/privacy/cookie-banner.tsx)
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { X, Cookie, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (state: ConsentState) => {
    localStorage.setItem('cookie-consent', JSON.stringify(state));
    document.cookie = `cookie-consent=${JSON.stringify(state)}; path=/; max-age=31536000`;
    
    // Initialize analytics if consented
    if (state.analytics) {
      // Initialize Google Analytics, Plausible, etc.
    }
    
    setIsVisible(false);
  };

  const acceptAll = () => {
    const fullConsent = { necessary: true, analytics: true, marketing: true };
    setConsent(fullConsent);
    saveConsent(fullConsent);
  };

  const acceptSelected = () => {
    saveConsent(consent);
  };

  const rejectAll = () => {
    const minimalConsent = { necessary: true, analytics: false, marketing: false };
    saveConsent(minimalConsent);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <Card className="max-w-5xl mx-auto p-6 shadow-2xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Cookie className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Cookie-Einstellungen</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-muted-foreground mb-6">
            Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und unseren Service zu optimieren. 
            Sie können Ihre Präferenzen unten anpassen.
          </p>

          {showDetails ? (
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Notwendige Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Erforderlich für die Grundfunktionen der Website
                  </p>
                </div>
                <Switch checked disabled />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Analyse-Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Helfen uns zu verstehen, wie Sie die App nutzen
                  </p>
                </div>
                <Switch
                  checked={consent.analytics}
                  onCheckedChange={(checked) => 
                    setConsent({ ...consent, analytics: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Marketing-Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Für personalisierte Angebote und Newsletter
                  </p>
                </div>
                <Switch
                  checked={consent.marketing}
                  onCheckedChange={(checked) => 
                    setConsent({ ...consent, marketing: checked })
                  }
                />
              </div>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={acceptAll}
              className="flex-1"
            >
              Alle akzeptieren
            </Button>
            
            {showDetails ? (
              <Button
                variant="outline"
                onClick={acceptSelected}
                className="flex-1"
              >
                Auswahl speichern
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowDetails(true)}
                className="flex-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                Einstellungen
              </Button>
            )}
            
            <Button
              variant="ghost"
              onClick={rejectAll}
              className="flex-1"
            >
              Nur notwendige
            </Button>
          </div>

          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <a href="/datenschutz" className="hover:underline">
              Datenschutzerklärung
            </a>
            <a href="/cookies" className="hover:underline">
              Cookie-Richtlinie
            </a>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
```

### Wake Call Challenge (components/wake-calls/challenge-config.tsx)
```typescript
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Brain, Calculator, Mic, QrCode } from 'lucide-react';

interface ChallengeConfig {
  type: 'math' | 'repeat' | 'qr' | 'shake';
  difficulty: number;
  snoozeAllowed: boolean;
  maxSnoozes: number;
}

export function ChallengeConfiguration({
  config,
  onChange,
  tier
}: {
  config: ChallengeConfig;
  onChange: (config: ChallengeConfig) => void;
  tier: 'BASIC' | 'PRO';
}) {
  const challenges = [
    {
      id: 'math',
      name: 'Mathe-Aufgabe',
      description: 'Löse eine Rechenaufgabe',
      icon: Calculator,
      available: true
    },
    {
      id: 'repeat',
      name: 'Satz wiederholen',
      description: 'Sprich einen Satz nach',
      icon: Mic,
      available: tier === 'PRO'
    },
    {
      id: 'qr',
      name: 'QR-Code scannen',
      description: 'Scanne einen QR-Code im Bad',
      icon: QrCode,
      available: tier === 'PRO'
    },
    {
      id: 'shake',
      name: 'Schütteln',
      description: 'Schüttle dein Handy 30x',
      icon: Brain,
      available: tier === 'PRO'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wake-Up Challenge</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base mb-3 block">Challenge-Typ</Label>
          <RadioGroup
            value={config.type}
            onValueChange={(value) => 
              onChange({ ...config, type: value as any })
            }
          >
            <div className="grid gap-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border ${
                    !challenge.available ? 'opacity-50' : ''
                  }`}
                >
                  <RadioGroupItem
                    value={challenge.id}
                    id={challenge.id}
                    disabled={!challenge.available}
                  />
                  <Label
                    htmlFor={challenge.id}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <challenge.icon className="h-5 w-5" />
                      <div>
                        <div className="font-medium">{challenge.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {challenge.description}
                        </div>
                      </div>
                      {!challenge.available && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          PRO
                        </span>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {config.type === 'math' && (
          <div>
            <Label className="text-base mb-3 block">
              Schwierigkeit: {config.difficulty}
            </Label>
            <Slider
              value={[config.difficulty]}
              onValueChange={([value]) => 
                onChange({ ...config, difficulty: value })
              }
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Einfach (7+5)</span>
              <span>Schwer (47×13)</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="snooze" className="text-base">
              Snooze erlauben
            </Label>
            <Switch
              id="snooze"
              checked={config.snoozeAllowed}
              onCheckedChange={(checked) => 
                onChange({ ...config, snoozeAllowed: checked })
              }
            />
          </div>

          {config.snoozeAllowed && (
            <div>
              <Label className="text-base mb-3 block">
                Maximale Snoozes: {config.maxSnoozes}
              </Label>
              <Slider
                value={[config.maxSnoozes]}
                onValueChange={([value]) => 
                  onChange({ ...config, maxSnoozes: value })
                }
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🚨 Critical MVP Features

### 1. Twilio Voice Webhook Handler with WebApp Challenge
```typescript
// app/api/webhooks/twilio/voice/route.ts
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { db } from '@/server/db';
import { callLogs, wakeCalls, users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { PushNotificationService } from '@/server/services/notifications/push';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const callSid = formData.get('CallSid') as string;
  const from = formData.get('From') as string;
  const to = formData.get('To') as string;
  
  // Verify webhook signature
  const signature = request.headers.get('X-Twilio-Signature');
  const url = `${process.env.NEXTAUTH_URL}/api/webhooks/twilio/voice`;
  const params = Object.fromEntries(formData);
  
  if (!twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    signature!,
    url,
    params
  )) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  // Get user and wake call config
  const user = await db.query.users.findFirst({
    where: eq(users.phone, to)
  });
  
  if (!user) {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Invalid number', { language: 'en-US' });
    twiml.hangup();
    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' }
    });
  }
  
  const wakeCall = await db.query.wakeCalls.findFirst({
    where: eq(wakeCalls.userId, user.id)
  });
  
  // Create TwiML response
  const twiml = new twilio.twiml.VoiceResponse();
  
  // Greeting in user's language
  const greetings = {
    en: `Good morning ${user.firstName}! Time to wake up.`,
    de: `Guten Morgen ${user.firstName}! Zeit aufzustehen.`,
    fr: `Bonjour ${user.firstName}! Il est temps de se réveiller.`,
    es: `Buenos días ${user.firstName}! Es hora de levantarse.`,
    it: `Buongiorno ${user.firstName}! È ora di alzarsi.`,
    // Add all EU languages...
  };
  
  twiml.say(
    greetings[user.language] || greetings.en,
    { 
      language: user.language === 'de' ? 'de-DE' : 
                user.language === 'fr' ? 'fr-FR' :
                user.language === 'es' ? 'es-ES' :
                user.language === 'it' ? 'it-IT' : 'en-US',
      voice: 'Google'
    }
  );
  
  // For PRO users with phone challenge enabled
  if (user.subscriptionTier === 'PRO' && wakeCall?.challengeType === 'phone_habits') {
    // Get recent habits
    const recentHabits = await getRecentCompletedHabits(user.id, 3);
    
    twiml.say(
      'To complete your wake-up challenge, please tell me which habits you completed in the last 3 days.',
      { language: user.language }
    );
    
    const gather = twiml.gather({
      input: 'speech',
      action: '/api/webhooks/twilio/voice/verify-habits',
      method: 'POST',
      timeout: 10,
      language: user.language
    });
    
    gather.say('Start speaking after the beep.');
  } else {
    // For BASIC users or PRO with webapp challenge
    twiml.say(
      user.language === 'de' ? 
        'Ihre Wake-Up Challenge wartet in der App auf Sie.' :
        'Your wake-up challenge is waiting for you in the app.',
      { language: user.language }
    );
    
    // Schedule push notification for webapp challenge
    if (wakeCall?.challengeEnabled) {
      setTimeout(() => {
        PushNotificationService.sendWakeUpChallenge(user.id, callSid);
      }, 5000); // Send 5 seconds after call ends
    }
  }
  
  // End message based on snooze availability
  const maxSnoozes = user.subscriptionTier === 'BASIC' ? 1 : 5;
  if (wakeCall?.snoozeAllowed) {
    twiml.say(
      `You can snooze up to ${maxSnoozes} times today.`,
      { language: user.language }
    );
  }
  
  twiml.say('Have a great day!', { language: user.language });
  
  // Log call
  await db.insert(callLogs).values({
    userId: user.id,
    wakeCallId: wakeCall?.id,
    scheduledTime: new Date(),
    initiatedAt: new Date(),
    status: 'IN_PROGRESS',
    twilioCallSid: callSid,
    challengePresented: wakeCall?.challengeEnabled || false
  });
  
  return new NextResponse(twiml.toString(), {
    headers: { 'Content-Type': 'text/xml' }
  });
}

// Test call during onboarding
export async function generateTestCall(phoneNumber: string, code: string) {
  const twiml = new twilio.twiml.VoiceResponse();
  
  twiml.say(
    'Welcome to Wakr! This is your test call.',
    { language: 'en-US' }
  );
  
  const gather = twiml.gather({
    numDigits: code.length,
    action: '/api/webhooks/twilio/voice/verify-test',
    method: 'POST',
    timeout: 10
  });
  
  gather.say(
    `Please enter the following code on your keypad: ${code.split('').join(' ')}`,
    { language: 'en-US' }
  );
  
  return twiml.toString();
}
```

### 2. WebApp Wake-Up Challenge Component
```typescript
// components/challenges/wake-up-challenge.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import confetti from 'canvas-confetti';

interface Challenge {
  id: string;
  type: 'math' | 'memory' | 'typing' | 'puzzle' | 'reaction';
  question: string;
  answer: string | number;
  options?: string[];
  timeLimit?: number;
}

export function WakeUpChallengeModal({ 
  isOpen, 
  onClose,
  callId 
}: { 
  isOpen: boolean;
  onClose: () => void;
  callId: string;
}) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  
  const generateChallenge = trpc.challenges.generate.useMutation();
  const verifyChallenge = trpc.challenges.verify.useMutation();
  
  useEffect(() => {
    if (isOpen) {
      loadChallenge();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (challenge?.timeLimit && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft, challenge]);
  
  const loadChallenge = async () => {
    setIsLoading(true);
    try {
      const result = await generateChallenge.mutateAsync({
        userId: 'current',
        difficulty: attempts + 1 // Increases with failed attempts
      });
      setChallenge(result);
      setTimeLeft(result.timeLimit || 30);
    } catch (error) {
      console.error('Failed to load challenge:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!challenge) return;
    
    const result = await verifyChallenge.mutateAsync({
      challengeId: challenge.id,
      answer: userAnswer,
      callId
    });
    
    if (result.correct) {
      // Success!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      // Wrong answer
      setAttempts(attempts + 1);
      setUserAnswer('');
      
      if (attempts >= 2) {
        // After 3 attempts, generate easier challenge
        loadChallenge();
      }
    }
  };
  
  const handleTimeout = () => {
    setAttempts(attempts + 1);
    loadChallenge();
  };
  
  const renderChallenge = () => {
    if (!challenge) return null;
    
    switch (challenge.type) {
      case 'math':
        return (
          <div className="space-y-4">
            <p className="text-2xl font-mono text-center">
              {challenge.question}
            </p>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full text-center text-3xl p-4 border rounded-lg"
              placeholder="?"
              autoFocus
            />
          </div>
        );
        
      case 'memory':
        return <MemoryChallenge challenge={challenge} onAnswer={setUserAnswer} />;
        
      case 'typing':
        return <TypingChallenge challenge={challenge} onAnswer={setUserAnswer} />;
        
      case 'puzzle':
        return <PuzzleChallenge challenge={challenge} onAnswer={setUserAnswer} />;
        
      default:
        return null;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md"
        >
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Wake-Up Challenge
                </span>
                {challenge?.timeLimit && (
                  <span className={`text-sm ${timeLeft < 10 ? 'text-red-500' : ''}`}>
                    {timeLeft}s
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  {attempts > 0 && (
                    <p className="text-sm text-red-500 text-center">
                      Try again! Attempt {attempts + 1}/3
                    </p>
                  )}
                  
                  {renderChallenge()}
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSubmit}
                      disabled={!userAnswer}
                      className="flex-1"
                    >
                      Submit
                    </Button>
                    
                    {attempts < 2 && (
                      <Button
                        variant="outline"
                        onClick={loadChallenge}
                      >
                        Skip (−1 attempt)
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Memory Challenge Component
function MemoryChallenge({ 
  challenge, 
  onAnswer 
}: { 
  challenge: Challenge;
  onAnswer: (answer: string) => void;
}) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(true);
  
  useEffect(() => {
    // Parse sequence from challenge question
    const seq = challenge.question.split(',').map(Number);
    setSequence(seq);
    
    // Show sequence for 3 seconds
    setTimeout(() => {
      setShowingSequence(false);
    }, 3000);
  }, [challenge]);
  
  const handleClick = (num: number) => {
    const newSeq = [...userSequence, num];
    setUserSequence(newSeq);
    
    if (newSeq.length === sequence.length) {
      onAnswer(newSeq.join(','));
    }
  };
  
  return (
    <div className="space-y-4">
      <p className="text-center">
        {showingSequence ? 'Memorize this sequence:' : 'Repeat the sequence:'}
      </p>
      
      {showingSequence ? (
        <div className="flex justify-center gap-2">
          {sequence.map((num, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center text-xl font-bold"
            >
              {num}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant={userSequence.includes(num) ? 'default' : 'outline'}
              onClick={() => handleClick(num)}
              className="h-16 text-xl"
            >
              {num}
            </Button>
          ))}
        </div>
      )}
      
      {!showingSequence && userSequence.length > 0 && (
        <div className="flex justify-center gap-2">
          {userSequence.map((num, i) => (
            <div
              key={i}
              className="w-10 h-10 bg-secondary text-white rounded flex items-center justify-center"
            >
              {num}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3. Challenge Generation Service with Claude 3.5
```typescript
// server/services/challenges/generator.ts
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export class ChallengeGenerator {
  static async generateChallenge(
    userId: string,
    difficulty: number = 1
  ): Promise<Challenge> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        habits: {
          with: {
            completions: {
              limit: 10,
              orderBy: (completions, { desc }) => [desc(completions.completedAt)]
            }
          }
        }
      }
    });
    
    // For PRO users, use Claude to generate personalized challenges
    if (user?.subscriptionTier === 'PRO') {
      const prompt = `Generate a wake-up challenge for ${user.firstName}.
        Difficulty: ${difficulty}/5
        User habits: ${user.habits.map(h => h.name).join(', ')}
        Language: ${user.language}
        
        Create ONE challenge that is:
        - Engaging and requires focus
        - Solvable in 30-60 seconds
        - Related to their habits or interests when possible
        - Type can be: math, memory, typing, puzzle, or reaction
        
        Return as JSON: { type, question, answer, options?, timeLimit }`;
      
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });
      
      const challenge = JSON.parse(response.content[0].text);
      return {
        id: crypto.randomUUID(),
        ...challenge
      };
    }
    
    // For BASIC users, use predefined challenges
    return this.getRandomChallenge(difficulty);
  }
  
  static getRandomChallenge(difficulty: number): Challenge {
    const challenges = {
      1: [
        { type: 'math', question: '15 + 27', answer: 42 },
        { type: 'math', question: '8 × 7', answer: 56 },
        { type: 'memory', question: '3,7,2,9', answer: '3,7,2,9' },
        { type: 'typing', question: 'Good morning sunshine', answer: 'Good morning sunshine' }
      ],
      2: [
        { type: 'math', question: '47 + 38', answer: 85 },
        { type: 'math', question: '13 × 9', answer: 117 },
        { type: 'memory', question: '4,1,8,3,6', answer: '4,1,8,3,6' },
        { type: 'typing', question: 'Today is going to be amazing', answer: 'Today is going to be amazing' }
      ],
      3: [
        { type: 'math', question: '124 + 89', answer: 213 },
        { type: 'math', question: '17 × 13', answer: 221 },
        { type: 'memory', question: '7,2,9,4,1,8', answer: '7,2,9,4,1,8' },
        { type: 'puzzle', question: 'What comes next: 2, 4, 8, 16, ?', answer: '32' }
      ]
    };
    
    const levelChallenges = challenges[Math.min(difficulty, 3)];
    const challenge = levelChallenges[Math.floor(Math.random() * levelChallenges.length)];
    
    return {
      id: crypto.randomUUID(),
      ...challenge,
      timeLimit: difficulty === 1 ? 60 : difficulty === 2 ? 45 : 30
    };
  }
}
```

### 4. PayPal Integration
```typescript
// server/services/paypal/client.ts
import { PayPalHttpClient, PayPalEnvironment } from '@paypal/checkout-server-sdk';

const environment = process.env.NODE_ENV === 'production'
  ? new PayPalEnvironment.LiveEnvironment(
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_CLIENT_SECRET!
    )
  : new PayPalEnvironment.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_CLIENT_SECRET!
    );

export const paypalClient = new PayPalHttpClient(environment);

// Subscription plans with annual discount
export const SUBSCRIPTION_PLANS = {
  basic_monthly: {
    id: 'basic_monthly',
    name: 'Basic Monthly',
    price: 9.99,
    currency: 'EUR',
    interval: 'month'
  },
  basic_annual: {
    id: 'basic_annual', 
    name: 'Basic Annual',
    price: 107.89, // 10% off
    currency: 'EUR',
    interval: 'year',
    savings: 11.99
  },
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: 19.99,
    currency: 'EUR',
    interval: 'month'
  },
  pro_annual: {
    id: 'pro_annual',
    name: 'Pro Annual', 
    price: 215.89, // 10% off
    currency: 'EUR',
    interval: 'year',
    savings: 23.99
  }
};
```

### 5. Updated Package.json
```json
{
  "name": "wakr",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit migrate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio",
    "stripe:listen": "stripe listen --forward-to localhost:3000/api/webhooks/stripe",
    "ngrok": "ngrok http 3000"
  },
  "dependencies": {
    "next": "15.3.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@auth/drizzle-adapter": "^1.0.0",
    "next-auth": "^5.0.0-beta.20",
    "drizzle-orm": "^0.33.0",
    "postgres": "^3.4.4",
    "@supabase/supabase-js": "^2.39.0",
    "@trpc/client": "^11.0.0-rc.446",
    "@trpc/react-query": "^11.0.0-rc.446",
    "@trpc/server": "^11.0.0-rc.446",
    "@tanstack/react-query": "^5.51.23",
    "twilio": "^5.2.0",
    "stripe": "^16.0.0",
    "@stripe/stripe-js": "^4.1.0",
    "@paypal/checkout-server-sdk": "^1.0.3",
    "@paypal/react-paypal-js": "^8.1.3",
    "@anthropic-ai/sdk": "^0.25.0",
    "zod": "^3.23.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.9.0",
    "date-fns": "^3.6.0",
    "date-fns-tz": "^3.1.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "web-push": "^3.6.7",
    "sonner": "^1.5.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0",
    "lucide-react": "^0.417.0",
    "framer-motion": "^11.3.0",
    "libphonenumber-js": "^1.11.0",
    "canvas-confetti": "^1.9.3"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/web-push": "^3.6.3",
    "@types/canvas-confetti": "^1.6.4",
    "typescript": "^5.5.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "drizzle-kit": "^0.24.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "15.3.3",
    "@typescript-eslint/parser": "^7.0.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0"
  }
}
```

### 6. Language Configuration
```typescript
// lib/languages.ts
export const EU_LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧', twilio: 'en-US' },
  de: { name: 'Deutsch', flag: '🇩🇪', twilio: 'de-DE' },
  fr: { name: 'Français', flag: '🇫🇷', twilio: 'fr-FR' },
  es: { name: 'Español', flag: '🇪🇸', twilio: 'es-ES' },
  it: { name: 'Italiano', flag: '🇮🇹', twilio: 'it-IT' },
  pt: { name: 'Português', flag: '🇵🇹', twilio: 'pt-PT' },
  nl: { name: 'Nederlands', flag: '🇳🇱', twilio: 'nl-NL' },
  pl: { name: 'Polski', flag: '🇵🇱', twilio: 'pl-PL' },
  sv: { name: 'Svenska', flag: '🇸🇪', twilio: 'sv-SE' },
  da: { name: 'Dansk', flag: '🇩🇰', twilio: 'da-DK' },
  fi: { name: 'Suomi', flag: '🇫🇮', twilio: 'fi-FI' },
  el: { name: 'Ελληνικά', flag: '🇬🇷', twilio: 'el-GR' },
  cs: { name: 'Čeština', flag: '🇨🇿', twilio: 'cs-CZ' },
  hu: { name: 'Magyar', flag: '🇭🇺', twilio: 'hu-HU' },
  ro: { name: 'Română', flag: '🇷🇴', twilio: 'ro-RO' },
  bg: { name: 'Български', flag: '🇧🇬', twilio: 'bg-BG' },
  hr: { name: 'Hrvatski', flag: '🇭🇷', twilio: 'hr-HR' },
  sk: { name: 'Slovenčina', flag: '🇸🇰', twilio: 'sk-SK' },
  sl: { name: 'Slovenščina', flag: '🇸🇮', twilio: 'sl-SI' },
  et: { name: 'Eesti', flag: '🇪🇪', twilio: 'et-EE' },
  lv: { name: 'Latviešu', flag: '🇱🇻', twilio: 'lv-LV' },
  lt: { name: 'Lietuvių', flag: '🇱🇹', twilio: 'lt-LT' },
  mt: { name: 'Malti', flag: '🇲🇹', twilio: 'en-US' }, // Fallback
  ga: { name: 'Gaeilge', flag: '🇮🇪', twilio: 'en-US' } // Fallback
} as const;

export type LanguageCode = keyof typeof EU_LANGUAGES;

// Translations for common phrases
export const translations = {
  wakeUpGreeting: {
    en: "Good morning {name}! Time to wake up.",
    de: "Guten Morgen {name}! Zeit aufzustehen.",
    fr: "Bonjour {name}! Il est temps de se réveiller.",
    es: "Buenos días {name}! Es hora de levantarse.",
    it: "Buongiorno {name}! È ora di alzarsi.",
    // ... add all languages
  },
  challengePrompt: {
    en: "Your wake-up challenge is waiting in the app.",
    de: "Ihre Wake-Up Challenge wartet in der App auf Sie.",
    fr: "Votre défi de réveil vous attend dans l'application.",
    es: "Tu desafío de despertar te espera en la aplicación.",
    it: "La tua sfida di risveglio ti aspetta nell'app.",
    // ... add all languages
  }
};
```
