// App-wide constants
export const APP_NAME = 'Wakr';
export const APP_DESCRIPTION = 'Personalized wake-up calls and habit tracking';
export const APP_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wakr.app';

// EU country codes
export const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
] as const;

// Subscription limits
export const SUBSCRIPTION_LIMITS = {
  TRIAL: {
    maxHabits: 3,
    maxCustomCalls: 1,
    maxSnoozes: 1,
    features: ['basic_wake_calls', 'basic_habits']
  },
  BASIC: {
    maxHabits: 10,
    maxCustomCalls: 5,
    maxSnoozes: 3,
    features: ['wake_calls', 'habits', 'basic_analytics']
  },
  PRO: {
    maxHabits: -1, // unlimited
    maxCustomCalls: 50,
    maxSnoozes: 5,
    features: ['all_features', 'advanced_analytics', 'custom_challenges', 'voice_challenges']
  }
} as const;

// Languages supported in EU
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
  mt: { name: 'Malti', flag: '🇲🇹', twilio: 'en-US' },
  ga: { name: 'Gaeilge', flag: '🇮🇪', twilio: 'en-US' }
} as const;

export type LanguageCode = keyof typeof EU_LANGUAGES;
export type SubscriptionTier = keyof typeof SUBSCRIPTION_LIMITS;

// Wake call challenge types
export const CHALLENGE_TYPES = {
  none: { name: 'No Challenge', description: 'Simple wake-up call' },
  math: { name: 'Math Problem', description: 'Solve a math equation' },
  memory: { name: 'Memory Sequence', description: 'Remember and repeat a sequence' },
  typing: { name: 'Type Text', description: 'Type a given phrase' },
  qr: { name: 'QR Code Scan', description: 'Scan QR code (PRO only)' },
  shake: { name: 'Shake Phone', description: 'Shake device 30 times (PRO only)' }
} as const;

// Habit frequencies
export const HABIT_FREQUENCIES = {
  DAILY: { name: 'Daily', description: 'Every day' },
  WEEKLY: { name: 'Weekly', description: 'Once per week' },
  MONTHLY: { name: 'Monthly', description: 'Once per month' },
  CUSTOM: { name: 'Custom', description: 'Custom schedule' }
} as const;

// Default user preferences
export const DEFAULT_PREFERENCES = {
  wake_time: '07:00',
  notification_sound: true,
  vibration: true,
  theme: 'system',
  wake_challenge: 'math',
  snooze_limit: 3,
  habit_reminder_time: '20:00'
} as const;

// GDPR consent defaults
export const DEFAULT_CONSENTS = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: null
} as const;

// Stripe price IDs (to be configured)
export const STRIPE_PRICE_IDS = {
  BASIC_MONTHLY: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID || 'price_basic_monthly',
  BASIC_ANNUAL: process.env.STRIPE_BASIC_ANNUAL_PRICE_ID || 'price_basic_annual',
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
  PRO_ANNUAL: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual'
} as const;

// Subscription prices in EUR
export const SUBSCRIPTION_PRICES = {
  BASIC_MONTHLY: 9.99,
  BASIC_ANNUAL: 107.89, // 10% discount
  PRO_MONTHLY: 19.99,
  PRO_ANNUAL: 215.89    // 10% discount
} as const;

// Coin rewards for different actions
export const COIN_REWARDS = {
  wake_challenge_completed: 10,
  wake_challenge_no_snooze: 15,
  habit_completed: 5,
  habit_streak_3: 20,
  habit_streak_7: 50,
  habit_streak_30: 200,
  daily_login: 5,
  perfect_day: 25,
  level_up_multiplier: 50
} as const;

// XP requirements for each level
export const XP_REQUIREMENTS = [
  100, 250, 500, 1000, 1500, 2500, 4000, 6000, 9000, 15000,
  20000, 30000, 45000, 65000, 90000, 120000, 155000, 195000, 240000, 300000
];

// API rate limits
export const RATE_LIMITS = {
  auth: { requests: 10, window: '15m' },
  api: { requests: 100, window: '15m' },
  webhook: { requests: 1000, window: '1h' }
} as const;