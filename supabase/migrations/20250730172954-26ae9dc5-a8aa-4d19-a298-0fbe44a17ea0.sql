-- Migration to fix user ID mismatch between auth.users and public.users
-- Move extension data from orphaned user to correct JWT user ID

BEGIN;

-- Step 1: Create the correct user record with JWT user ID if it doesn't exist
-- Using INSERT ... ON CONFLICT to safely handle if record already exists
INSERT INTO public.users (
  id, 
  email, 
  extension_connected,
  extension_last_connected,
  extension_version,
  connection_method,
  session_origin,
  auto_login_enabled,
  twitter_handle,
  twitter_display_name,
  twitter_auth_token,
  twitter_ct0_token,
  twitter_connected_at,
  twitter_last_sync,
  created_at,
  updated_at
)
SELECT 
  'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid, -- Correct JWT user ID
  old_user.email,
  old_user.extension_connected,
  old_user.extension_last_connected,
  old_user.extension_version,
  old_user.connection_method,
  old_user.session_origin,
  old_user.auto_login_enabled,
  old_user.twitter_handle,
  old_user.twitter_display_name,
  old_user.twitter_auth_token,
  old_user.twitter_ct0_token,
  old_user.twitter_connected_at,
  old_user.twitter_last_sync,
  old_user.created_at,
  NOW() -- Update timestamp
FROM public.users old_user
WHERE old_user.id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid
ON CONFLICT (id) DO UPDATE SET
  extension_connected = EXCLUDED.extension_connected,
  extension_last_connected = EXCLUDED.extension_last_connected,
  extension_version = EXCLUDED.extension_version,
  connection_method = EXCLUDED.connection_method,
  session_origin = EXCLUDED.session_origin,
  auto_login_enabled = EXCLUDED.auto_login_enabled,
  twitter_handle = EXCLUDED.twitter_handle,
  twitter_display_name = EXCLUDED.twitter_display_name,
  twitter_auth_token = EXCLUDED.twitter_auth_token,
  twitter_ct0_token = EXCLUDED.twitter_ct0_token,
  twitter_connected_at = EXCLUDED.twitter_connected_at,
  twitter_last_sync = EXCLUDED.twitter_last_sync,
  updated_at = NOW();

-- Step 2: Update all foreign key references to use the correct user ID

-- Update subscriptions table
UPDATE public.subscriptions 
SET user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
WHERE user_id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

-- Update billing_history table
UPDATE public.billing_history 
SET user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
WHERE user_id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

-- Update payment_history table
UPDATE public.payment_history 
SET user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
WHERE user_id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

-- Update extension_sessions table
UPDATE public.extension_sessions 
SET user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
WHERE user_id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

-- Step 3: Clean up the orphaned user record
-- This is safe to do now that all foreign keys have been updated
DELETE FROM public.users 
WHERE id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

-- Step 4: Verification queries (for logging)
-- Count records after migration
DO $$
DECLARE
  user_count INTEGER;
  subscription_count INTEGER;
  session_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.users WHERE id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid;
  SELECT COUNT(*) INTO subscription_count FROM public.subscriptions WHERE user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid;
  SELECT COUNT(*) INTO session_count FROM public.extension_sessions WHERE user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid;
  
  RAISE NOTICE 'Migration completed successfully:';
  RAISE NOTICE 'User records with correct ID: %', user_count;
  RAISE NOTICE 'Subscription records migrated: %', subscription_count;
  RAISE NOTICE 'Extension session records migrated: %', session_count;
END
$$;

COMMIT;