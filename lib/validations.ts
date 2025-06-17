import { z } from 'zod';
import { EU_COUNTRIES, EU_LANGUAGES } from './constants';

// User registration validation
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().min(10, 'Valid phone number required'),
  phoneCountryCode: z.string().min(1, 'Country code required'),
  residenceCountry: z.enum(EU_COUNTRIES, {
    errorMap: () => ({ message: 'Service only available in EU countries' })
  }),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.enum(Object.keys(EU_LANGUAGES) as [keyof typeof EU_LANGUAGES, ...Array<keyof typeof EU_LANGUAGES>]).optional().default('en'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  agreeToPrivacy: z.boolean().refine(val => val === true, 'You must agree to the privacy policy'),
  consents: z.object({
    necessary: z.boolean().default(true),
    analytics: z.boolean().default(false),
    marketing: z.boolean().default(false)
  })
});

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Wake call configuration
export const wakeCallSchema = z.object({
  enabled: z.boolean().default(true),
  wakeTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  daysOfWeek: z.array(z.number().min(0).max(6)).min(1, 'Select at least one day'),
  challengeType: z.enum(['none', 'math', 'memory', 'typing', 'qr', 'shake']).default('math'),
  challengeDifficulty: z.number().min(1).max(5).default(1),
  snoozeAllowed: z.boolean().default(true),
  snoozeDuration: z.number().min(1).max(30).default(5),
  maxSnoozes: z.number().min(1).max(10).default(3),
  voiceSpeed: z.number().min(0.5).max(2.0).default(1.0),
  voiceVariant: z.enum(['friendly', 'energetic', 'calm']).default('friendly'),
  customMessage: z.string().max(500).optional()
});

// Habit creation/editing
export const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required').max(255),
  description: z.string().max(1000).optional(),
  icon: z.string().max(50).default('📌'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').default('#7c3aed'),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM']).default('DAILY'),
  frequencyConfig: z.object({
    days: z.array(z.number().min(0).max(6)).optional(),
    interval: z.number().positive().optional(),
    specificDates: z.array(z.string()).optional()
  }).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  reminderEnabled: z.boolean().default(false),
  reminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  reminderMessage: z.string().max(500).optional()
});

// Habit completion
export const habitCompletionSchema = z.object({
  habitId: z.string().uuid(),
  notes: z.string().max(1000).optional(),
  mood: z.number().min(1).max(5).optional(),
  energyLevel: z.number().min(1).max(5).optional(),
  completedAt: z.string().datetime().optional()
});

// Custom call/reminder
export const customCallSchema = z.object({
  scheduledAt: z.string().datetime(),
  title: z.string().min(1).max(255),
  message: z.string().min(1).max(1000),
  requiresConfirmation: z.boolean().default(false),
  repeatCount: z.number().min(1).max(10).default(1),
  repeatInterval: z.number().min(1).max(60).default(5)
});

// User preferences update
export const preferencesSchema = z.object({
  wake_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  notification_sound: z.boolean().optional(),
  vibration: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  wake_challenge: z.enum(['none', 'math', 'memory', 'typing', 'qr', 'shake']).optional(),
  snooze_limit: z.number().min(1).max(10).optional(),
  habit_reminder_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  language: z.enum(Object.keys(EU_LANGUAGES) as [keyof typeof EU_LANGUAGES, ...Array<keyof typeof EU_LANGUAGES>]).optional()
});

// GDPR consent update
export const consentSchema = z.object({
  necessary: z.boolean().default(true),
  analytics: z.boolean().default(false),
  marketing: z.boolean().default(false)
});

// Profile update
export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().min(10).optional(),
  phoneCountryCode: z.string().min(1).optional(),
  timezone: z.string().min(1).optional(),
  language: z.enum(Object.keys(EU_LANGUAGES) as [keyof typeof EU_LANGUAGES, ...Array<keyof typeof EU_LANGUAGES>]).optional()
});

// Push subscription
export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string()
  })
});

// Analytics event
export const analyticsEventSchema = z.object({
  eventName: z.string().min(1).max(100),
  eventCategory: z.string().max(50).optional(),
  eventProperties: z.record(z.any()).optional(),
  sessionId: z.string().max(100).optional()
});

// Admin schemas
export const systemConfigSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.any(),
  description: z.string().max(1000).optional()
});

export const userUpdateSchema = z.object({
  subscriptionTier: z.enum(['TRIAL', 'BASIC', 'PRO']).optional(),
  subscriptionStatus: z.string().max(20).optional(),
  roles: z.array(z.enum(['USER', 'ADMIN'])).optional(),
  deletedAt: z.string().datetime().optional().nullable()
});

// Challenge verification
export const challengeVerificationSchema = z.object({
  challengeId: z.string().uuid(),
  answer: z.union([z.string(), z.number()]),
  timeSpent: z.number().positive().optional(),
  attempts: z.number().positive().default(1)
});

// Twilio webhook validation
export const twilioWebhookSchema = z.object({
  CallSid: z.string(),
  From: z.string(),
  To: z.string(),
  CallStatus: z.enum(['ringing', 'in-progress', 'completed', 'busy', 'failed', 'no-answer']).optional(),
  Duration: z.string().optional(),
  RecordingUrl: z.string().url().optional()
});

// Stripe webhook validation
export const stripeWebhookSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.any()
  }),
  created: z.number()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type WakeCallInput = z.infer<typeof wakeCallSchema>;
export type HabitInput = z.infer<typeof habitSchema>;
export type HabitCompletionInput = z.infer<typeof habitCompletionSchema>;
export type CustomCallInput = z.infer<typeof customCallSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
export type ConsentInput = z.infer<typeof consentSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>;
export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
export type ChallengeVerificationInput = z.infer<typeof challengeVerificationSchema>;