require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyUser() {
  try {
    // Check auth.users table
    console.log('🔍 Checking Supabase Auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message);
    } else {
      console.log(`✅ Found ${authUsers.users.length} auth users`);
      const frank = authUsers.users.find(u => u.email === 'frank.garcia@gmail.com');
      if (frank) {
        console.log('User Frank found in auth.users:');
        console.log(`  - ID: ${frank.id}`);
        console.log(`  - Email: ${frank.email}`);
        console.log(`  - Confirmed: ${frank.email_confirmed_at ? 'Yes' : 'No'}`);
        console.log(`  - Created: ${frank.created_at}`);

        // Check if profile exists in our users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', frank.id)
          .single();

        if (profile) {
          console.log('\n👤 Profile in users table:');
          console.log(`  - Name: ${profile.first_name} ${profile.last_name}`);
          console.log(`  - Hometown: ${profile.hometown}`);
          console.log(`  - Subscription: ${profile.subscription_tier}`);
        } else {
          console.log('\n❌ No profile found in users table:', profileError?.message);
        }

        // Check coins
        const { data: coins, error: coinsError } = await supabase
          .from('user_coins')
          .select('*')
          .eq('user_id', frank.id)
          .single();

        if (coins) {
          console.log('\n💰 Coins record:');
          console.log(`  - Balance: ${coins.current_balance}`);
          console.log(`  - Level: ${coins.level}`);
        } else {
          console.log('\n❌ No coins record:', coinsError?.message);
        }
      }
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

verifyUser();