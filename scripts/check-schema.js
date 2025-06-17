require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    // Get all tables
    const { data: tables, error } = await supabase.rpc('get_tables_info');
    
    if (error) {
      // Fallback to information_schema
      const { data: fallbackTables, error: fallbackError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .neq('table_name', 'schema_migrations');

      if (fallbackTables) {
        console.log('📋 Current tables:');
        fallbackTables.forEach(table => console.log(`  - ${table.table_name}`));
      }
    }

    // Check users table structure
    console.log('\n🔍 Checking users table structure...');
    const { data: columns, error: colError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'users')
      .order('ordinal_position');

    if (columns) {
      console.log('Users table columns:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    } else {
      console.log('❌ Could not fetch users table structure:', colError?.message);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkSchema();