import { pgTable, pgEnum, uuid, varchar, text, timestamp, boolean, integer, decimal, time, date, jsonb, index, uniqueIndex, primaryKey, inet } from 'drizzle-orm/pg-core';
import { relations, SQL, sql } from 'drizzle-orm';

// Enums
export const subscriptionTierEnum = pgEnum('subscription_tier', ['TRIAL', 'BASIC', 'PRO']);
export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);
export const callStatusEnum = pgEnum('call_status', ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'MISSED', 'CANCELLED']);
export const habitFrequencyEnum = pgEnum('habit_frequency', ['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM']);
export const consentTypeEnum = pgEnum('consent_type', ['NECESSARY', 'ANALYTICS', 'MARKETING', 'ALL']);

// User coins for gamification
export const userCoins = pgTable('user_coins', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  
  // Balance
  currentBalance: integer('current_balance').notNull().default(0),
  totalEarned: integer('total_earned').notNull().default(0),
  totalSpent: integer('total_spent').notNull().default(0),
  
  // Level & Progress
  level: integer('level').default(1),
  xp: integer('xp').default(0),
  xpToNextLevel: integer('xp_to_next_level').default(100),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    balanceIdx: index('idx_coins_balance').on(table.currentBalance),
    levelIdx: index('idx_coins_level').on(table.level),
  };
});

// Coin transactions log
export const coinTransactions = pgTable('coin_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Transaction details
  amount: integer('amount').notNull(), // positive for earned, negative for spent
  balanceAfter: integer('balance_after').notNull(),
  transactionType: varchar('transaction_type', { length: 50 }).notNull(), // 'earned', 'spent', 'bonus'
  
  // Source of coins
  source: varchar('source', { length: 50 }).notNull(), // 'wake_challenge', 'habit_complete', 'streak_bonus', etc.
  sourceId: uuid('source_id'), // Reference to specific challenge/habit/etc
  
  // Metadata
  description: text('description'),
  metadata: jsonb('metadata').default({}),
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    userDateIdx: index('idx_coin_tx_user_date').on(table.userId, table.createdAt),
    typeIdx: index('idx_coin_tx_type').on(table.transactionType),
  };
});

// Achievements table
export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Achievement info
  key: varchar('key', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }).default('🏆'),
  
  // Requirements
  requirementType: varchar('requirement_type', { length: 50 }).notNull(), // 'streak', 'total_habits', 'wake_challenges', etc.
  requirementValue: integer('requirement_value').notNull(),
  
  // Rewards
  coinReward: integer('coin_reward').default(0),
  xpReward: integer('xp_reward').default(0),
  badgeColor: varchar('badge_color', { length: 7 }).default('#FFD700'),
  
  // Tier
  tier: varchar('tier', { length: 20 }).default('bronze'), // bronze, silver, gold, platinum
  
  createdAt: timestamp('created_at').defaultNow(),
});

// User achievements
export const userAchievements = pgTable('user_achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  achievementId: uuid('achievement_id').references(() => achievements.id).notNull(),
  
  unlockedAt: timestamp('unlocked_at').defaultNow(),
  seen: boolean('seen').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    userAchievementIdx: uniqueIndex('idx_user_achievement').on(table.userId, table.achievementId),
    userUnlockedIdx: index('idx_user_achievements').on(table.userId, table.unlockedAt),
  };
});

// Rewards catalog (for future use)
export const rewardsCatalog = pgTable('rewards_catalog', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Reward info
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(), // 'digital', 'feature', 'discount', 'nft'
  
  // Cost & availability
  coinCost: integer('coin_cost').notNull(),
  available: boolean('available').default(true),
  limitedQuantity: integer('limited_quantity'), // NULL = unlimited
  quantityRemaining: integer('quantity_remaining'),
  
  // Restrictions
  minLevel: integer('min_level').default(1),
  subscriptionTierRequired: subscriptionTierEnum('subscription_tier_required'),
  
  // Metadata for different reward types
  metadata: jsonb('metadata').default({}), // NFT data, feature flags, etc.
  
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
}, (table) => {
  return {
    availableIdx: index('idx_rewards_available').on(table.available, table.coinCost),
  };
});

// User rewards (redeemed items)
export const userRewards = pgTable('user_rewards', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  rewardId: uuid('reward_id').references(() => rewardsCatalog.id).notNull(),
  
  // Redemption details
  coinsSpent: integer('coins_spent').notNull(),
  redeemedAt: timestamp('redeemed_at').defaultNow(),
  
  // Status
  status: varchar('status', { length: 20 }).default('pending'), // pending, active, used, expired
  activatedAt: timestamp('activated_at'),
  expiresAt: timestamp('expires_at'),
  
  // Reward-specific data
  rewardData: jsonb('reward_data').default({}), // NFT token ID, download link, etc.
}, (table) => {
  return {
    userStatusIdx: index('idx_user_rewards').on(table.userId, table.status),
  };
});

// Audio cache for cost-effective TTS
export const audioCache = pgTable('audio_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  cacheKey: varchar('cache_key', { length: 255 }).unique().notNull(),
  
  language: varchar('language', { length: 10 }).notNull(),
  audioType: varchar('audio_type', { length: 50 }).notNull(),
  time: varchar('time', { length: 5 }),
  variant: varchar('variant', { length: 50 }),
  
  audioUrl: text('audio_url').notNull(),
  durationSeconds: integer('duration_seconds'),
  textContent: text('text_content'),
  
  usageCount: integer('usage_count').default(0),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    cacheKeyIdx: index('idx_audio_cache_key').on(table.cacheKey),
    usageIdx: index('idx_audio_cache_usage').on(table.usageCount),
  };
});

// Users table with GDPR compliance
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  emailVerifiedAt: timestamp('email_verified_at'),
  
  // Personal data (encrypted where necessary)
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: text('phone').notNull(), // Encrypted
  phoneCountryCode: varchar('phone_country_code', { length: 10 }).notNull(),
  
  // Location & preferences
  residenceCountry: varchar('residence_country', { length: 2 }).notNull(),
  hometown: varchar('hometown', { length: 255 }), // For weather data
  timezone: varchar('timezone', { length: 50 }).notNull(),
  language: varchar('language', { length: 10 }).default('en'),
  currency: varchar('currency', { length: 3 }).default('EUR'),
  
  // Authentication
  passwordHash: text('password_hash').notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  twoFactorSecret: text('two_factor_secret'), // Encrypted
  
  // Subscription
  subscriptionTier: subscriptionTierEnum('subscription_tier').default('TRIAL'),
  subscriptionStatus: varchar('subscription_status', { length: 20 }).default('trialing'),
  trialEndsAt: timestamp('trial_ends_at'),
  subscriptionEndsAt: timestamp('subscription_ends_at'),
  
  // Stripe
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  
  // Roles & permissions
  roles: userRoleEnum('roles').array().default(sql`ARRAY['USER']::user_role[]`),
  
  // Preferences (JSONB for flexibility)
  preferences: jsonb('preferences').default({
    wake_time: "07:00",
    notification_sound: true,
    vibration: true,
    theme: "system",
    wake_challenge: "math",
    snooze_limit: 3,
    habit_reminder_time: "20:00"
  }),
  
  // GDPR consent tracking
  consents: jsonb('consents').default({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: null
  }),
  
  // Metadata
  lastLoginAt: timestamp('last_login_at'),
  lastActiveAt: timestamp('last_active_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'), // Soft delete for GDPR
}, (table) => {
  return {
    emailIdx: index('idx_users_email').on(table.email),
    stripeCustomerIdx: index('idx_users_stripe_customer').on(table.stripeCustomerId),
    countryIdx: index('idx_users_country').on(table.residenceCountry),
    deletedIdx: index('idx_users_deleted').on(table.deletedAt),
  };
});

// Wake calls configuration
export const wakeCalls = pgTable('wake_calls', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Schedule
  enabled: boolean('enabled').default(true),
  wakeTime: time('wake_time').notNull(),
  daysOfWeek: integer('days_of_week').array(), // Mon-Fri
  
  // Challenge configuration
  challengeType: varchar('challenge_type', { length: 20 }).default('math'), // math, repeat, none
  challengeDifficulty: integer('challenge_difficulty').default(1), // 1-5
  snoozeAllowed: boolean('snooze_allowed').default(true),
  snoozeDuration: integer('snooze_duration').default(5), // minutes
  maxSnoozes: integer('max_snoozes').default(3),
  
  // Voice settings
  voiceSpeed: decimal('voice_speed', { precision: 3, scale: 2 }).default('1.0'), // 0.5-2.0
  voiceVariant: varchar('voice_variant', { length: 20 }).default('friendly'), // friendly, energetic, calm
  customMessage: text('custom_message'),
  
  // Analytics
  totalCalls: integer('total_calls').default(0),
  successfulCalls: integer('successful_calls').default(0),
  failedCalls: integer('failed_calls').default(0),
  averageSnoozes: decimal('average_snoozes', { precision: 3, scale: 2 }).default('0'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    userIdx: index('idx_wake_calls_user').on(table.userId),
    enabledIdx: index('idx_wake_calls_enabled').on(table.enabled),
  };
});

// Custom reminders/calls
export const customCalls = pgTable('custom_calls', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Schedule
  scheduledAt: timestamp('scheduled_at').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  
  // Configuration
  requiresConfirmation: boolean('requires_confirmation').default(false),
  repeatCount: integer('repeat_count').default(1),
  repeatInterval: integer('repeat_interval').default(5), // minutes
  
  // Status
  status: callStatusEnum('status').default('SCHEDULED'),
  completedAt: timestamp('completed_at'),
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    userIdx: index('idx_custom_calls_user').on(table.userId),
    scheduledIdx: index('idx_custom_calls_scheduled').on(table.scheduledAt),
  };
});

// Call logs for analytics
export const callLogs = pgTable('call_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  wakeCallId: uuid('wake_call_id').references(() => wakeCalls.id, { onDelete: 'set null' }),
  
  // Call details
  scheduledTime: timestamp('scheduled_time').notNull(),
  initiatedAt: timestamp('initiated_at'),
  answeredAt: timestamp('answered_at'),
  endedAt: timestamp('ended_at'),
  
  // Status
  status: callStatusEnum('status').notNull().default('SCHEDULED'),
  durationSeconds: integer('duration_seconds'),
  
  // Challenge results
  challengePresented: boolean('challenge_presented').default(false),
  challengeCompleted: boolean('challenge_completed').default(false),
  challengeAttempts: integer('challenge_attempts').default(0),
  snoozeCount: integer('snooze_count').default(0),
  
  // Twilio data
  twilioCallSid: varchar('twilio_call_sid', { length: 255 }),
  twilioStatus: varchar('twilio_status', { length: 50 }),
  twilioPrice: decimal('twilio_price', { precision: 10, scale: 4 }),
  twilioPriceUnit: varchar('twilio_price_unit', { length: 3 }).default('EUR'),
  
  // Call quality
  audioQuality: integer('audio_quality'), // 1-5 rating
  connectionQuality: integer('connection_quality'), // 1-5 rating
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    userDateIdx: index('idx_call_logs_user_date').on(table.userId, table.scheduledTime),
    statusIdx: index('idx_call_logs_status').on(table.status),
  };
});

// Habits table
export const habits = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Basic info
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }).default('📌'),
  color: varchar('color', { length: 7 }).default('#7c3aed'),
  
  // Schedule
  frequency: habitFrequencyEnum('frequency').notNull().default('DAILY'),
  frequencyConfig: jsonb('frequency_config').default({}), // For custom frequencies
  startDate: date('start_date').notNull(),
  endDate: date('end_date'), // NULL = no end
  
  // Reminders
  reminderEnabled: boolean('reminder_enabled').default(false),
  reminderTime: time('reminder_time'),
  reminderMessage: text('reminder_message'),
  
  // Tracking
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  totalCompletions: integer('total_completions').default(0),
  completionRate: decimal('completion_rate', { precision: 5, scale: 2 }).default('0'), // Percentage
  
  // Settings
  isArchived: boolean('is_archived').default(false),
  isPublic: boolean('is_public').default(false), // For future social features
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    userIdx: index('idx_habits_user').on(table.userId),
    archivedIdx: index('idx_habits_archived').on(table.isArchived),
  };
});

// Habit completions
export const habitCompletions = pgTable('habit_completions', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id').references(() => habits.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  completedAt: timestamp('completed_at').defaultNow(),
  notes: text('notes'),
  
  // Optional metadata
  mood: integer('mood'), // 1-5 scale
  energyLevel: integer('energy_level'), // 1-5 scale
}, (table) => {
  return {
    habitDateIdx: index('idx_completions_habit_date').on(table.habitId, table.completedAt),
    userDateIdx: index('idx_completions_user_date').on(table.userId, table.completedAt),
  };
});

// Push subscriptions
export const pushSubscriptions = pgTable('push_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Web Push API fields
  endpoint: text('endpoint').notNull(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  
  // Metadata
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
  lastUsedAt: timestamp('last_used_at').defaultNow(),
}, (table) => {
  return {
    userEndpointIdx: uniqueIndex('idx_push_user_endpoint').on(table.userId, table.endpoint),
    userIdx: index('idx_push_user').on(table.userId),
  };
});

// Analytics events
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  
  // Event data
  eventName: varchar('event_name', { length: 100 }).notNull(),
  eventCategory: varchar('event_category', { length: 50 }),
  eventProperties: jsonb('event_properties').default({}),
  
  // Context
  sessionId: varchar('session_id', { length: 100 }),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  
  // Consent check
  hasAnalyticsConsent: boolean('has_analytics_consent').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    userEventIdx: index('idx_analytics_user_event').on(table.userId, table.eventName, table.createdAt),
    sessionIdx: index('idx_analytics_session').on(table.sessionId),
  };
});

// Billing events
export const billingEvents = pgTable('billing_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Event info
  eventType: varchar('event_type', { length: 50 }).notNull(), // subscription_created, payment_succeeded, etc
  stripeEventId: varchar('stripe_event_id', { length: 255 }).unique(),
  
  // Amount
  amount: decimal('amount', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('EUR'),
  
  // Metadata
  metadata: jsonb('metadata').default({}),
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    userIdx: index('idx_billing_user').on(table.userId),
    stripeIdx: index('idx_billing_stripe').on(table.stripeEventId),
  };
});

// Admin audit log
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: uuid('admin_id').references(() => users.id).notNull(),
  
  // Action details
  action: varchar('action', { length: 100 }).notNull(),
  resourceType: varchar('resource_type', { length: 50 }),
  resourceId: uuid('resource_id'),
  
  // Changes
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  
  // Context
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    adminIdx: index('idx_audit_admin').on(table.adminId),
    resourceIdx: index('idx_audit_resource').on(table.resourceType, table.resourceId),
  };
});

// GDPR data processing log
export const dataProcessingLogs = pgTable('data_processing_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  
  // Processing details
  processor: varchar('processor', { length: 100 }).notNull(), // system, admin_id, third_party
  purpose: varchar('purpose', { length: 100 }).notNull(), // wake_call, analytics, support, etc
  legalBasis: varchar('legal_basis', { length: 50 }).notNull(), // consent, contract, legitimate_interest
  
  // Data categories
  dataCategories: text('data_categories').array().notNull(), // phone, location, habits, etc
  
  // Third party sharing
  sharedWith: varchar('shared_with', { length: 100 }), // twilio, stripe, etc
  
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    userIdx: index('idx_processing_user').on(table.userId),
  };
});

// System configuration (for admin panel)
export const systemConfig = pgTable('system_config', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: jsonb('value').notNull(),
  description: text('description'),
  updatedBy: uuid('updated_by').references(() => users.id),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Removed daily plans - replaced with push subscriptions and other tables above

// Keep the rest of the existing tables as they are but remove duplicates

// Removed weather data - not in Claude.MD spec

// Removed audioMessageParts - simplified for MVP

// Removed userIntegrations - not in MVP

// Removed userLocationSettings - not in MVP

// Removed twilioNumbers - simplified for MVP

// Removed callCosts - simplified for MVP

// Removed adminActivities - now using auditLogs

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  userCoins: one(userCoins, {
    fields: [users.id],
    references: [userCoins.userId],
  }),
  wakeCalls: many(wakeCalls),
  customCalls: many(customCalls),
  callLogs: many(callLogs),
  habits: many(habits),
  habitCompletions: many(habitCompletions),
  pushSubscriptions: many(pushSubscriptions),
  coinTransactions: many(coinTransactions),
  userAchievements: many(userAchievements),
  userRewards: many(userRewards),
  analyticsEvents: many(analyticsEvents),
  billingEvents: many(billingEvents),
  auditLogs: many(auditLogs),
  dataProcessingLogs: many(dataProcessingLogs),
}));

export const wakeCallsRelations = relations(wakeCalls, ({ one }) => ({
  user: one(users, {
    fields: [wakeCalls.userId],
    references: [users.id],
  }),
}));

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  completions: many(habitCompletions),
}));

export const habitCompletionsRelations = relations(habitCompletions, ({ one }) => ({
  habit: one(habits, {
    fields: [habitCompletions.habitId],
    references: [habits.id],
  }),
  user: one(users, {
    fields: [habitCompletions.userId],
    references: [users.id],
  }),
}));

export const callLogsRelations = relations(callLogs, ({ one }) => ({
  user: one(users, {
    fields: [callLogs.userId],
    references: [users.id],
  }),
  wakeCall: one(wakeCalls, {
    fields: [callLogs.wakeCallId],
    references: [wakeCalls.id],
  }),
}));

export const customCallsRelations = relations(customCalls, ({ one }) => ({
  user: one(users, {
    fields: [customCalls.userId],
    references: [users.id],
  }),
}));

export const userCoinsRelations = relations(userCoins, ({ one, many }) => ({
  user: one(users, {
    fields: [userCoins.userId],
    references: [users.id],
  }),
  transactions: many(coinTransactions),
}));

export const coinTransactionsRelations = relations(coinTransactions, ({ one }) => ({
  user: one(users, {
    fields: [coinTransactions.userId],
    references: [users.id],
  }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const rewardsCatalogRelations = relations(rewardsCatalog, ({ many }) => ({
  userRewards: many(userRewards),
}));

export const userRewardsRelations = relations(userRewards, ({ one }) => ({
  user: one(users, {
    fields: [userRewards.userId],
    references: [users.id],
  }),
  reward: one(rewardsCatalog, {
    fields: [userRewards.rewardId],
    references: [rewardsCatalog.id],
  }),
}));

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  user: one(users, {
    fields: [pushSubscriptions.userId],
    references: [users.id],
  }),
}));

export const analyticsEventsRelations = relations(analyticsEvents, ({ one }) => ({
  user: one(users, {
    fields: [analyticsEvents.userId],
    references: [users.id],
  }),
}));

export const billingEventsRelations = relations(billingEvents, ({ one }) => ({
  user: one(users, {
    fields: [billingEvents.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(users, {
    fields: [auditLogs.adminId],
    references: [users.id],
  }),
}));

export const dataProcessingLogsRelations = relations(dataProcessingLogs, ({ one }) => ({
  user: one(users, {
    fields: [dataProcessingLogs.userId],
    references: [users.id],
  }),
}));