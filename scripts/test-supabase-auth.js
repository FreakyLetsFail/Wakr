require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  try {
    console.log('🔐 Testing Supabase Auth...');
    console.log('URL:', supabaseUrl);

    // Test auth by trying to sign up with a test email
    const { data, error } = await supabase.auth.signUp({
      email: 'test.user@gmail.com',
      password: 'testpassword123',
    });

    if (error) {
      console.log('❌ Supabase Auth Error:', error.message);
      
      if (error.message.includes('Email not confirmed')) {
        console.log('ℹ️ This means Supabase Auth is working but requires email confirmation');
      } else if (error.message.includes('already registered')) {
        console.log('ℹ️ Email already exists - Auth is working');
      } else if (error.message.includes('Signup is disabled')) {
        console.log('⚠️ Signup is disabled in Supabase settings');
      }
    } else if (data.user) {
      console.log('✅ Supabase Auth is working!');
      console.log('User ID:', data.user.id);
      console.log('Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

testAuth();