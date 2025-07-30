-- Migration to fix user ID mismatch between auth.users and public.users  
-- Use a temporary approach to handle foreign key constraints safely

BEGIN;

-- Step 1: Create the new user record with correct JWT ID first
-- Copy all data from the orphaned record but use the correct ID
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
  stripe_customer_id,
  payment_method_id,
  payment_method_last4,
  payment_method_brand,
  created_at,
  updated_at
)
SELECT 
  'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid, -- Correct JWT user ID
  'ls23yim+corrected@gmail.com', -- Temporary different email to avoid unique constraint
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
  stripe_customer_id,
  payment_method_id,
  payment_method_last4,
  payment_method_brand,
  created_at,
  NOW() -- Update timestamp
FROM public.users old_user
WHERE old_user.id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

-- Step 2: Update all foreign key references to point to the new user ID
UPDATE public.subscriptions 
SET user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
WHERE user_id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

UPDATE public.billing_history 
SET user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
WHERE user_id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

UPDATE public.payment_history 
SET user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
WHERE user_id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

UPDATE public.extension_sessions 
SET user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
WHERE user_id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

-- Step 3: Delete the orphaned user record
DELETE FROM public.users 
WHERE id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

-- Step 4: Fix the email back to the original
UPDATE public.users 
SET email = 'ls23yim@gmail.com'
WHERE id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid;

-- Step 5: Verification
DO $$
DECLARE
  user_count INTEGER;
  subscription_count INTEGER;
  session_count INTEGER;
  user_extension_status BOOLEAN;
  user_twitter_handle TEXT;
BEGIN
  -- Check user record
  SELECT COUNT(*) INTO user_count 
  FROM public.users 
  WHERE id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid;
  
  -- Get extension status and twitter handle
  SELECT extension_connected, twitter_handle 
  INTO user_extension_status, user_twitter_handle
  FROM public.users 
  WHERE id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid;
  
  -- Check related data
  SELECT COUNT(*) INTO subscription_count 
  FROM public.subscriptions 
  WHERE user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid;
  
  SELECT COUNT(*) INTO session_count 
  FROM public.extension_sessions 
  WHERE user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid;
  
  RAISE NOTICE '=== MIGRATION COMPLETED SUCCESSFULLY ===';
  RAISE NOTICE 'User record with correct JWT ID: %', user_count;
  RAISE NOTICE 'Extension connected: %', user_extension_status;
  RAISE NOTICE 'Twitter handle: %', COALESCE(user_twitter_handle, 'NULL');
  RAISE NOTICE 'Subscription records migrated: %', subscription_count;
  RAISE NOTICE 'Extension session records: %', session_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Frontend should now show extension as CONNECTED!';
  
  -- Ensure migration succeeded
  IF user_count != 1 THEN
    RAISE EXCEPTION 'Migration failed: User record not found with correct ID';
  END IF;
END
$$;

COMMIT;