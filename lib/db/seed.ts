import { db } from './index';
import { achievements, systemConfig } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Insert achievements
  await db.insert(achievements).values([
    // Wake-up achievements
    {
      key: 'first_wake',
      name: 'Early Bird',
      description: 'Complete your first wake-up challenge',
      icon: '🌅',
      requirementType: 'wake_challenges',
      requirementValue: 1,
      coinReward: 50,
      xpReward: 50,
      tier: 'bronze'
    },
    {
      key: 'wake_week',
      name: 'Week Warrior',
      description: 'Complete wake-up challenges for 7 days',
      icon: '💪',
      requirementType: 'wake_challenges',
      requirementValue: 7,
      coinReward: 100,
      xpReward: 100,
      tier: 'silver'
    },
    {
      key: 'wake_month',
      name: 'Morning Master',
      description: 'Complete wake-up challenges for 30 days',
      icon: '👑',
      requirementType: 'wake_challenges',
      requirementValue: 30,
      coinReward: 500,
      xpReward: 500,
      tier: 'gold'
    },
    
    // Habit achievements
    {
      key: 'first_habit',
      name: 'Habit Starter',
      description: 'Complete your first habit',
      icon: '✅',
      requirementType: 'total_habits',
      requirementValue: 1,
      coinReward: 25,
      xpReward: 25,
      tier: 'bronze'
    },
    {
      key: 'habit_streak_7',
      name: 'Consistent',
      description: '7-day habit streak',
      icon: '🔥',
      requirementType: 'streak',
      requirementValue: 7,
      coinReward: 75,
      xpReward: 75,
      tier: 'bronze'
    },
    {
      key: 'habit_streak_30',
      name: 'Unstoppable',
      description: '30-day habit streak',
      icon: '⚡',
      requirementType: 'streak',
      requirementValue: 30,
      coinReward: 300,
      xpReward: 300,
      tier: 'silver'
    },
    {
      key: 'habit_streak_100',
      name: 'Legendary',
      description: '100-day habit streak',
      icon: '💎',
      requirementType: 'streak',
      requirementValue: 100,
      coinReward: 1000,
      xpReward: 1000,
      tier: 'platinum'
    },
    
    // Level achievements
    {
      key: 'level_5',
      name: 'Rising Star',
      description: 'Reach level 5',
      icon: '⭐',
      requirementType: 'level',
      requirementValue: 5,
      coinReward: 100,
      xpReward: 0,
      tier: 'bronze'
    },
    {
      key: 'level_10',
      name: 'Dedicated',
      description: 'Reach level 10',
      icon: '🌟',
      requirementType: 'level',
      requirementValue: 10,
      coinReward: 250,
      xpReward: 0,
      tier: 'silver'
    },
    {
      key: 'level_25',
      name: 'Elite',
      description: 'Reach level 25',
      icon: '✨',
      requirementType: 'level',
      requirementValue: 25,
      coinReward: 1000,
      xpReward: 0,
      tier: 'gold'
    },
    
    // Special achievements
    {
      key: 'no_snooze_week',
      name: 'No Snooze',
      description: 'Week without using snooze',
      icon: '⏰',
      requirementType: 'no_snooze',
      requirementValue: 7,
      coinReward: 200,
      xpReward: 200,
      tier: 'silver'
    },
    {
      key: 'perfect_week',
      name: 'Perfect Week',
      description: 'Complete all habits for a week',
      icon: '💯',
      requirementType: 'perfect_week',
      requirementValue: 1,
      coinReward: 150,
      xpReward: 150,
      tier: 'silver'
    }
  ]).onConflictDoNothing();

  // Insert system configuration
  await db.insert(systemConfig).values([
    {
      key: 'maintenance_mode',
      value: false,
      description: 'Enable maintenance mode'
    },
    {
      key: 'allowed_countries',
      value: ["DE", "AT", "CH", "FR", "IT", "ES", "NL", "BE", "LU", "DK", "SE", "FI", "IE", "PT", "GR", "PL", "CZ", "HU", "RO", "BG", "HR", "SI", "SK", "EE", "LV", "LT", "MT", "CY"],
      description: 'EU countries allowed for registration'
    },
    {
      key: 'twilio_webhook_url',
      value: "https://wakr.app/api/webhooks/twilio",
      description: 'Twilio webhook URL'
    },
    {
      key: 'max_habits_basic',
      value: 10,
      description: 'Maximum habits for basic tier'
    },
    {
      key: 'max_custom_calls_basic',
      value: 5,
      description: 'Maximum custom calls per month for basic tier'
    },
    {
      key: 'max_custom_calls_pro',
      value: 20,
      description: 'Maximum custom calls per month for pro tier'
    },
    {
      key: 'trial_duration_hours',
      value: 24,
      description: 'Trial duration in hours'
    },
    {
      key: 'coin_rewards',
      value: {
        wake_challenge_completed: 10,
        wake_challenge_no_snooze: 15,
        habit_completed: 5,
        habit_streak_3: 20,
        habit_streak_7: 50,
        habit_streak_30: 200,
        daily_login: 5,
        perfect_day: 25,
        level_up_multiplier: 50
      },
      description: 'Coin rewards for different actions'
    },
    {
      key: 'xp_requirements',
      value: [100, 250, 500, 1000, 1500, 2500, 4000, 6000, 9000, 15000],
      description: 'XP required for each level'
    },
    {
      key: 'level_benefits',
      value: {
        "5": {"title": "Rising Star", "perks": ["Custom badge color", "5% mehr Coins"]},
        "10": {"title": "Dedicated", "perks": ["Exclusive themes", "10% mehr Coins"]},
        "15": {"title": "Champion", "perks": ["Beta features", "15% mehr Coins"]},
        "20": {"title": "Master", "perks": ["VIP support", "20% mehr Coins"]},
        "25": {"title": "Legend", "perks": ["Lifetime recognition", "25% mehr Coins"]}
      },
      description: 'Benefits for reaching certain levels'
    }
  ]).onConflictDoNothing();

  console.log('✅ Database seeded successfully!');
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  });