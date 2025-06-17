require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function simpleCheck() {
  try {
    // Try to insert a test record to see what fields exist
    console.log('🔍 Testing users table structure...');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Error selecting from users:', error.message);
    } else {
      console.log('✅ Users table accessible');
      if (data && data.length > 0) {
        console.log('Sample user fields:', Object.keys(data[0]));
      } else {
        console.log('Users table is empty');
      }
    }

    // Try the problematic field
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('email_verified')
      .limit(1);

    if (testError) {
      console.log('❌ email_verified field missing:', testError.message);
      console.log('📝 Need to run schema migration');
    } else {
      console.log('✅ email_verified field exists');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

simpleCheck();