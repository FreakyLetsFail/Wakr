import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/lib/db/schema';
import { 
  users, 
  audioCache, 
  habits,
  wakeCalls
} from '@/lib/db/schema';
import { encrypt, generateSecureToken } from '@/lib/crypto/encryption';
import bcrypt from 'bcryptjs';

// Create database connection
const sql = postgres(process.env.DATABASE_URL || 'postgresql://wakr:wakr_dev_password@localhost:5432/wakr_db');
const db = drizzle(sql, { schema });

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // 1. Create admin user
    console.log('Creating admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@wakr.app';
    const adminPassword = await bcrypt.hash('admin123!', 10);
    
    const [adminUser] = await db.insert(users).values({
      email: adminEmail,
      firstName: 'Admin',
      lastName: 'User',
      phone: encrypt('+491234567890'), // Encrypted at application level
      phoneCountryCode: '+49',
      residenceCountry: 'DE',
      timezone: 'Europe/Berlin',
      language: 'en',
      passwordHash: adminPassword,
      subscriptionTier: 'PRO',
      roles: ['USER', 'ADMIN'],
      trialEndsAt: new Date('2030-12-31'),
    }).returning();
    
    console.log('✅ Admin user created:', adminEmail);

    // 2. Create test users in different timezones
    console.log('Creating test users...');
    const testUsers = [
      {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+14155552671',
        phoneCountryCode: '+1',
        residenceCountry: 'US',
        timezone: 'America/New_York',
        language: 'en',
        subscriptionTier: 'BASIC' as const,
      },
      {
        email: 'maria.garcia@example.com',
        firstName: 'Maria',
        lastName: 'Garcia',
        phone: '+34612345678',
        phoneCountryCode: '+34',
        residenceCountry: 'ES',
        timezone: 'Europe/Madrid',
        language: 'es',
        subscriptionTier: 'PRO' as const,
      },
      {
        email: 'hans.mueller@example.com',
        firstName: 'Hans',
        lastName: 'Müller',
        phone: '+49301234567',
        phoneCountryCode: '+49',
        residenceCountry: 'DE',
        timezone: 'Europe/Berlin',
        language: 'de',
        subscriptionTier: 'TRIAL' as const,
      },
    ];

    const password = await bcrypt.hash('test123!', 10);
    const createdUsers = await db.insert(users).values(
      testUsers.map(user => ({
        ...user,
        phone: encrypt(user.phone), // Encrypt phone numbers
        passwordHash: password,
        roles: ['USER' as const],
        trialEndsAt: user.subscriptionTier === 'TRIAL' 
          ? new Date(Date.now() + 24 * 60 * 60 * 1000) 
          : new Date('2025-12-31'),
      }))
    ).returning();
    
    console.log(`✅ Created ${createdUsers.length} test users`);

    // 3. Create audio cache entries
    console.log('Creating audio cache entries...');
    const audioEntries = [];
    const languages = ['en', 'de', 'es'];
    const times = ['06:00', '06:30', '07:00', '07:30', '08:00'];
    const variants = ['standard', 'motivational', 'gentle', 'energetic'];

    for (const lang of languages) {
      for (const time of times) {
        for (const variant of variants) {
          audioEntries.push({
            cacheKey: `${lang}_wakeup_${time.replace(':', '')}_${variant}`,
            language: lang,
            audioType: 'wakeup',
            time,
            variant,
            audioUrl: `https://wakr-audio.s3.eu-central-1.amazonaws.com/${lang}/${time}/${variant}.mp3`,
            durationSeconds: Math.floor(Math.random() * 10) + 15,
            textContent: `Wake up message in ${lang} at ${time} - ${variant} style`,
            usageCount: Math.floor(Math.random() * 100),
            expiresAt: new Date('2025-12-31'),
          });
        }
      }
    }

    await db.insert(audioCache).values(audioEntries);
    console.log(`✅ Created ${audioEntries.length} audio cache entries`);

    // 4. Create sample habits for admin
    console.log('Creating sample habits...');
    const adminHabits = await db.insert(habits).values([
      {
        userId: adminUser.id,
        name: 'Morning Meditation',
        icon: '🧘',
        color: '#7c3aed',
        frequency: 'DAILY',
        startDate: new Date().toISOString().split('T')[0],
        reminderEnabled: true,
        reminderTime: '06:30',
      },
      {
        userId: adminUser.id,
        name: 'Exercise',
        icon: '🏃',
        color: '#10b981',
        frequency: 'DAILY',
        startDate: new Date().toISOString().split('T')[0],
        frequencyConfig: { days: [1, 2, 3, 4, 5] }, // Weekdays only
        reminderEnabled: true,
        reminderTime: '07:00',
      },
      {
        userId: adminUser.id,
        name: 'Read for 30 minutes',
        icon: '📚',
        color: '#f59e0b',
        frequency: 'DAILY',
        startDate: new Date().toISOString().split('T')[0],
        reminderEnabled: false,
      },
    ]).returning();
    console.log('✅ Sample habits created');

    // 5. Create wake call configuration for admin
    console.log('Creating wake call configuration...');
    await db.insert(wakeCalls).values({
      userId: adminUser.id,
      enabled: true,
      daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
      wakeTime: '07:00',
    });
    console.log('✅ Wake call configuration created');

    console.log('✨ Database seeding completed successfully!');
    
    console.log('\n📝 Test credentials:');
    console.log('Admin: admin@wakr.app / admin123!');
    console.log('Test users: [john.doe|maria.garcia|hans.mueller]@example.com / test123!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Add bcryptjs to dependencies
console.log('Note: You need to install bcryptjs: npm install bcryptjs @types/bcryptjs');

seed().catch(console.error);