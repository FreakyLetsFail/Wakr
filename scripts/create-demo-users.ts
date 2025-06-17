import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '../lib/db/schema';
import { hashWeb } from '../lib/crypto/web-crypto';

const client = postgres('postgresql://wakr:wakr_dev_password@localhost:5432/wakr_db', { max: 1 });
const db = drizzle(client);

async function createDemoUsers() {
  console.log('Creating demo users...');

  const adminPasswordHash = await hashWeb('admin123!');
  const userPasswordHash = await hashWeb('test123!');

  try {
    // Create admin user
    await db.insert(users).values({
      email: 'admin@wakr.app',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+491234567890',
      phoneCountryCode: 'DE',
      residenceCountry: 'DE',
      timezone: 'Europe/Berlin',
      language: 'de',
      passwordHash: adminPasswordHash,
      subscriptionTier: 'PRO',
      roles: ['USER', 'ADMIN'],
      trialStartedAt: new Date(),
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      metadata: {
        signupSource: 'demo',
        isDemoUser: true,
      },
    }).onConflictDoUpdate({
      target: users.email,
      set: {
        passwordHash: adminPasswordHash,
        roles: ['USER', 'ADMIN'],
        subscriptionTier: 'PRO',
      },
    });

    console.log('✓ Admin user created/updated: admin@wakr.app');

    // Create regular user
    await db.insert(users).values({
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+491234567891',
      phoneCountryCode: 'DE',
      residenceCountry: 'DE',
      timezone: 'Europe/Berlin',
      language: 'de',
      passwordHash: userPasswordHash,
      subscriptionTier: 'BASIC',
      roles: ['USER'],
      trialStartedAt: new Date(),
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      metadata: {
        signupSource: 'demo',
        isDemoUser: true,
      },
    }).onConflictDoUpdate({
      target: users.email,
      set: {
        passwordHash: userPasswordHash,
        subscriptionTier: 'BASIC',
      },
    });

    console.log('✓ Regular user created/updated: john.doe@example.com');
    console.log('\nDemo users ready!');
    console.log('Admin: admin@wakr.app / admin123!');
    console.log('User: john.doe@example.com / test123!');
    
  } catch (error) {
    console.error('Error creating demo users:', error);
  } finally {
    await client.end();
  }
}

createDemoUsers();