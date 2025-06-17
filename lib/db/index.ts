import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection string (can be PostgreSQL or Supabase)
const connectionString = process.env.DATABASE_URL!;

// Create postgres connection
const sql = postgres(connectionString, { 
  prepare: false,
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  max: 1, // Serverless-friendly
});

// Create drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export schema for easy access
export * from './schema';

// Type exports for better DX
export type User = typeof schema.users.$inferSelect;
export type NewUser = typeof schema.users.$inferInsert;
export type Habit = typeof schema.habits.$inferSelect;
export type NewHabit = typeof schema.habits.$inferInsert;
export type WakeCall = typeof schema.wakeCalls.$inferSelect;
export type NewWakeCall = typeof schema.wakeCalls.$inferInsert;
export type CallLog = typeof schema.callLogs.$inferSelect;
export type NewCallLog = typeof schema.callLogs.$inferInsert;
export type HabitCompletion = typeof schema.habitCompletions.$inferSelect;
export type NewHabitCompletion = typeof schema.habitCompletions.$inferInsert;
export type CustomCall = typeof schema.customCalls.$inferSelect;
export type NewCustomCall = typeof schema.customCalls.$inferInsert;
export type PushSubscription = typeof schema.pushSubscriptions.$inferSelect;
export type NewPushSubscription = typeof schema.pushSubscriptions.$inferInsert;
export type UserCoins = typeof schema.userCoins.$inferSelect;
export type NewUserCoins = typeof schema.userCoins.$inferInsert;
export type CoinTransaction = typeof schema.coinTransactions.$inferSelect;
export type NewCoinTransaction = typeof schema.coinTransactions.$inferInsert;
export type Achievement = typeof schema.achievements.$inferSelect;
export type NewAchievement = typeof schema.achievements.$inferInsert;
export type UserAchievement = typeof schema.userAchievements.$inferSelect;
export type NewUserAchievement = typeof schema.userAchievements.$inferInsert;
export type RewardCatalog = typeof schema.rewardsCatalog.$inferSelect;
export type NewRewardCatalog = typeof schema.rewardsCatalog.$inferInsert;
export type UserReward = typeof schema.userRewards.$inferSelect;
export type NewUserReward = typeof schema.userRewards.$inferInsert;
export type AnalyticsEvent = typeof schema.analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof schema.analyticsEvents.$inferInsert;
export type BillingEvent = typeof schema.billingEvents.$inferSelect;
export type NewBillingEvent = typeof schema.billingEvents.$inferInsert;
export type AuditLog = typeof schema.auditLogs.$inferSelect;
export type NewAuditLog = typeof schema.auditLogs.$inferInsert;
export type DataProcessingLog = typeof schema.dataProcessingLogs.$inferSelect;
export type NewDataProcessingLog = typeof schema.dataProcessingLogs.$inferInsert;
export type SystemConfig = typeof schema.systemConfig.$inferSelect;
export type NewSystemConfig = typeof schema.systemConfig.$inferInsert;