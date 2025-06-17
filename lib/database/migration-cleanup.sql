-- ===============================================
-- MANUAL SCHEMA CLEANUP FOR SUPABASE AUTH
-- ===============================================
-- Run this in Supabase SQL Editor

-- 1. Remove auth-related columns (not needed with Supabase Auth)
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;
ALTER TABLE users DROP COLUMN IF EXISTS email_verification_token;
ALTER TABLE users DROP COLUMN IF EXISTS two_factor_enabled;
ALTER TABLE users DROP COLUMN IF EXISTS two_factor_secret;

-- 2. Update users.id column to not auto-generate UUID
-- (ID will come from Supabase Auth instead)
ALTER TABLE users ALTER COLUMN id DROP DEFAULT;

-- 3. Add comment for clarity
COMMENT ON COLUMN users.id IS 'UUID from Supabase Auth - matches auth.users.id';

-- 4. Verify schema
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Expected result: id column should have no default value