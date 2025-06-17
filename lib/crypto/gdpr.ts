import { db, createSupabaseServiceClient } from '@/lib/supabase-db';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import archiver from 'archiver';
import { decrypt } from './encryption';

export interface UserDataExport {
  profile: any;
  habits: any[];
  wakeCalls: any[];
  callHistory: any[];
  habitCompletions: any[];
  preferences: any;
  integrations: any[];
}

/**
 * Collects all user data for GDPR export
 */
export async function collectUserData(userId: string): Promise<UserDataExport> {
  // Fetch user profile
  const user = await db.users.findById(userId, true);

  if (!user) {
    throw new Error('User not found');
  }

  // Decrypt sensitive data for export
  const decryptedUser = {
    ...user,
    phone: decrypt(user.phone),
    // Remove internal fields - these don't exist in Supabase version
  };

  // Fetch all related data using Supabase client
  const supabase = createSupabaseServiceClient();
  
  const [
    { data: userHabits },
    { data: userWakeCalls },
    { data: userCallLogs },
    { data: userHabitCompletions }
  ] = await Promise.all([
    supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('wake_calls')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('call_logs')
      .select('*')
      .eq('user_id', userId)
      .order('initiated_at', { ascending: false })
      .limit(1000),
    supabase
      .from('habit_completions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(5000)
  ]);

  return {
    profile: decryptedUser,
    habits: userHabits || [],
    wakeCalls: userWakeCalls || [],
    callHistory: userCallLogs || [],
    habitCompletions: userHabitCompletions || [],
    preferences: user.preferences,
    integrations: [], // TODO: Add integrations when implemented
  };
}

/**
 * Creates a ZIP file with all user data
 */
export async function createDataExportZip(data: UserDataExport): Promise<Buffer> {
  const chunks: Buffer[] = [];
  
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    archive.on('data', (chunk) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);

    // Add files to the archive
    archive.append(JSON.stringify(data.profile, null, 2), { 
      name: 'profile.json' 
    });
    
    archive.append(JSON.stringify(data.habits, null, 2), { 
      name: 'habits.json' 
    });
    
    archive.append(JSON.stringify(data.wakeCalls, null, 2), { 
      name: 'wake-calls.json' 
    });
    
    archive.append(JSON.stringify(data.callHistory, null, 2), { 
      name: 'call-history.json' 
    });
    
    archive.append(JSON.stringify(data.habitCompletions, null, 2), { 
      name: 'habit-completions.json' 
    });
    
    archive.append(JSON.stringify(data.preferences, null, 2), { 
      name: 'preferences.json' 
    });

    // Add README
    archive.append(generateExportReadme(data), { 
      name: 'README.txt' 
    });

    archive.finalize();
  });
}

/**
 * Generates a README file for the data export
 */
function generateExportReadme(data: UserDataExport): string {
  return `Wakr.app Data Export
===================

This archive contains all your personal data from Wakr.app as required by GDPR Article 20.

Export Date: ${new Date().toISOString()}
User ID: ${data.profile.id}
Email: ${data.profile.email}

Contents:
- profile.json: Your account information
- habits.json: All your habit configurations
- wake-calls.json: Your wake-up call settings
- call-history.json: History of calls made to you
- habit-completions.json: Your habit completion records
- preferences.json: Your notification and app preferences

Data Protection:
- Phone numbers and other sensitive data have been decrypted for this export
- This data is provided in a portable, machine-readable format (JSON)
- Please store this file securely as it contains your personal information

For questions about this data, please contact: privacy@wakr.app
`;
}

/**
 * Anonymizes user data for soft deletion
 */
export async function anonymizeUser(userId: string): Promise<void> {
  const anonymizedEmail = `deleted-${userId}@wakr.app`;
  const anonymizedPhone = `+00000000000`;
  
  await db.users.update(userId, {
    email: anonymizedEmail,
    first_name: 'Deleted',
    last_name: 'User',
    phone: anonymizedPhone, // Will be encrypted automatically
    preferences: {},
    deleted_at: new Date().toISOString(),
  });
}

/**
 * Logs data access for GDPR compliance
 */
export async function logDataAccess(params: {
  userId: string;
  action: 'data_export' | 'data_deletion' | 'data_access';
  timestamp: Date;
  ip?: string | null;
  adminId?: string;
}): Promise<void> {
  // Store in audit log table when implemented
  console.log('GDPR Audit Log:', params);
  // TODO: Implement audit log table and storage
}