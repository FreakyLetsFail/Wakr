require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyUser() {
  try {
    // Get the user we just created
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, subscription_tier, created_at')
      .eq('email', 'alice.smith@example.com');

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    if (users && users.length > 0) {
      console.log('✅ User found in database:');
      console.log(JSON.stringify(users[0], null, 2));

      // Check user coins
      const { data: coins, error: coinsError } = await supabase
        .from('user_coins')
        .select('*')
        .eq('user_id', users[0].id);

      if (coins && coins.length > 0) {
        console.log('\n💰 User coins record:');
        console.log(JSON.stringify(coins[0], null, 2));
      } else {
        console.log('\n❌ No coins record found:', coinsError?.message);
      }
    } else {
      console.log('❌ User not found in database');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

verifyUser();