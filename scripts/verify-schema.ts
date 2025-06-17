#!/usr/bin/env tsx

import { db } from '../lib/db/index';
import { users, userCoins, achievements, systemConfig } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function verifySchema() {
  console.log('🔍 Verifying database schema...');

  try {
    // Test basic query to check if tables exist
    console.log('Testing users table...');
    const usersCount = await db.select().from(users).limit(1);
    console.log('✅ Users table accessible');

    console.log('Testing user_coins table...');
    const coinsCount = await db.select().from(userCoins).limit(1);
    console.log('✅ User coins table accessible');

    console.log('Testing achievements table...');
    const achievementsCount = await db.select().from(achievements).limit(1);
    console.log('✅ Achievements table accessible');

    console.log('Testing system_config table...');
    const configCount = await db.select().from(systemConfig).limit(1);
    console.log('✅ System config table accessible');

    console.log('\n✅ All core tables are accessible and schema is valid!');
    console.log('\n📋 Database Summary:');
    console.log(`- Users: ${usersCount.length} records`);
    console.log(`- User Coins: ${coinsCount.length} records`);
    console.log(`- Achievements: ${achievementsCount.length} records`);
    console.log(`- System Config: ${configCount.length} records`);

  } catch (error) {
    console.error('❌ Schema verification failed:', error);
    throw error;
  }
}

verifySchema()
  .then(() => {
    console.log('\n🎉 Schema verification completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Schema verification failed:', error);
    process.exit(1);
  });