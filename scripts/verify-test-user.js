require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTestUser() {
  try {
    console.log('📧 Manually verifying test user for development...');

    // Get Grace's user ID
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message);
      return;
    }

    const grace = authUsers.users.find(u => u.email === 'grace.lee@gmail.com');
    if (!grace) {
      console.log('❌ Grace not found in auth users');
      return;
    }

    // Manually verify the email (for development)
    const { data, error } = await supabase.auth.admin.updateUserById(
      grace.id,
      { 
        email_confirm: true,
        app_metadata: { 
          ...grace.app_metadata,
          provider: 'email',
          providers: ['email']
        }
      }
    );

    if (error) {
      console.error('❌ Error verifying user:', error.message);
    } else {
      console.log('✅ User email verified successfully');
      console.log('Now you can login with grace.lee@gmail.com / test123456');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

verifyTestUser();