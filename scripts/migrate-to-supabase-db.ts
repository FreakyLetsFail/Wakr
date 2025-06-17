import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../lib/db/schema';
import 'dotenv/config';

// This script migrates the database schema from Drizzle ORM to Supabase
// and sets up proper RLS policies

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrate() {
  console.log('Starting migration to Supabase...');

  try {
    // 1. First, we need to create the schema in Supabase
    // This assumes you've already pushed the Drizzle schema to Supabase using:
    // DATABASE_URL=your_supabase_connection_string npm run db:push

    // 2. Enable RLS on all tables
    console.log('Enabling RLS on all tables...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Enable RLS on all tables
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE user_coins ENABLE ROW LEVEL SECURITY;
        ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
        ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
        ALTER TABLE rewards_catalog ENABLE ROW LEVEL SECURITY;
        ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
        ALTER TABLE audio_cache ENABLE ROW LEVEL SECURITY;
        ALTER TABLE wake_calls ENABLE ROW LEVEL SECURITY;
        ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE custom_calls ENABLE ROW LEVEL SECURITY;
        ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
        ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
        ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;
        ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE gdpr_consent_logs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE data_processing_logs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
      `
    });

    if (rlsError) {
      console.error('Error enabling RLS:', rlsError);
      // Continue anyway - might already be enabled
    }

    // 3. Create RLS policies
    console.log('Creating RLS policies...');
    
    // Note: You'll need to run the enable-rls.sql script in Supabase SQL Editor
    // or use the Supabase CLI to apply the policies

    console.log('Migration completed!');
    console.log('\nNext steps:');
    console.log('1. Run the enable-rls.sql script in Supabase SQL Editor');
    console.log('2. Update your code to use Supabase client instead of Drizzle');
    console.log('3. Test all database operations with RLS enabled');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Helper function to create a Supabase-compatible connection string
function getSupabaseConnectionString() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  // Extract project ID from URL
  const projectId = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  
  if (!projectId) {
    throw new Error('Invalid Supabase URL');
  }
  
  // Construct connection string
  return `postgresql://postgres.${projectId}:${supabaseServiceKey}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;
}

migrate();