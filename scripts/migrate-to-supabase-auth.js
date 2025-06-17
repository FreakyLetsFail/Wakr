require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateSchema() {
  try {
    console.log('🔄 Starting Supabase Auth schema migration...');

    // Step 1: Check current users table structure
    console.log('📋 Checking current users table...');
    const { data: existingUsers, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .limit(5);

    if (usersError) {
      console.log('❌ Cannot access users table:', usersError.message);
      return;
    }

    console.log(`Found ${existingUsers?.length || 0} existing users`);

    // Step 2: List current Supabase Auth users
    console.log('\n🔐 Checking Supabase Auth users...');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Cannot access auth users:', authError.message);
      return;
    }

    console.log(`Found ${authData.users.length} Supabase Auth users`);

    // Step 3: Clean slate approach - delete test users
    console.log('\n🧹 Cleaning up test users for fresh start...');
    
    // Delete from our users table first (to avoid foreign key constraints)
    const testEmails = [
      'alice.smith@example.com',
      'bob.johnson@example.com', 
      'eva.brown@gmail.com',
      'frank.garcia@gmail.com',
      'grace.lee@gmail.com'
    ];

    for (const email of testEmails) {
      console.log(`Deleting user: ${email}`);
      
      // Delete from users table
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('email', email);
        
      if (deleteError) {
        console.log(`  ❌ Error deleting from users table: ${deleteError.message}`);
      }

      // Delete from auth
      const authUser = authData.users.find(u => u.email === email);
      if (authUser) {
        const { error: authDeleteError } = await supabase.auth.admin.deleteUser(authUser.id);
        if (authDeleteError) {
          console.log(`  ❌ Error deleting from auth: ${authDeleteError.message}`);
        } else {
          console.log(`  ✅ Deleted auth user: ${email}`);
        }
      }
    }

    // Step 4: Update schema (remove auth fields)
    console.log('\n🔧 Updating schema - removing auth-related columns...');
    
    const schemaUpdates = [
      'ALTER TABLE users DROP COLUMN IF EXISTS password_hash',
      'ALTER TABLE users DROP COLUMN IF EXISTS email_verification_token', 
      'ALTER TABLE users DROP COLUMN IF EXISTS two_factor_enabled',
      'ALTER TABLE users DROP COLUMN IF EXISTS two_factor_secret',
      // Remove auto-generation from ID (manually via SQL editor)
      'COMMENT ON COLUMN users.id IS \'ID from Supabase Auth - no auto-generation\'',
    ];

    for (const sql of schemaUpdates) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
        if (error) {
          console.log(`⚠️  Could not execute: ${sql}`);
          console.log(`   Error: ${error.message}`);
          console.log('   → This might need to be done manually in Supabase SQL Editor');
        } else {
          console.log(`✅ Executed: ${sql}`);
        }
      } catch (err) {
        console.log(`⚠️  SQL execution not available via API`);
        console.log('   → Schema updates need to be done manually in Supabase SQL Editor');
        break;
      }
    }

    console.log('\n✅ Migration preparation complete!');
    console.log('\n📝 Manual steps needed:');
    console.log('1. Go to Supabase SQL Editor');
    console.log('2. Run the schema updates from schema-updated.sql');
    console.log('3. Remove DEFAULT uuid_generate_v4() from users.id column');
    console.log('4. Test registration with new clean schema');

  } catch (err) {
    console.error('❌ Migration error:', err.message);
  }
}

migrateSchema();