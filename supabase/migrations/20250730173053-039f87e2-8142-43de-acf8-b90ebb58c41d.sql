-- Migration to fix user ID mismatch between auth.users and public.users
-- Update the existing user record to use the correct JWT user ID

BEGIN;

-- Step 1: Update all foreign key references FIRST to avoid constraint violations
-- We'll update them to point to the correct JWT user ID

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

-- Step 2: Now update the user record itself to use the correct JWT user ID
-- This is the key fix - changing the primary key to match auth.users
UPDATE public.users 
SET 
  id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid,
  updated_at = NOW()
WHERE id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

-- Step 3: Verification - check that everything is properly aligned
DO $$
DECLARE
  user_count INTEGER;
  subscription_count INTEGER;
  session_count INTEGER;
  auth_user_exists BOOLEAN;
BEGIN
  -- Check if user record exists with correct ID
  SELECT COUNT(*) INTO user_count 
  FROM public.users 
  WHERE id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid;
  
  -- Check subscriptions
  SELECT COUNT(*) INTO subscription_count 
  FROM public.subscriptions 
  WHERE user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid;
  
  -- Check extension sessions
  SELECT COUNT(*) INTO session_count 
  FROM public.extension_sessions 
  WHERE user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid;
  
  -- Check if auth user exists (this should return true)
  SELECT COUNT(*) > 0 INTO auth_user_exists
  FROM auth.users 
  WHERE id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid;
  
  RAISE NOTICE 'Migration verification:';
  RAISE NOTICE 'User record with correct JWT ID: %', user_count;
  RAISE NOTICE 'Subscription records: %', subscription_count; 
  RAISE NOTICE 'Extension session records: %', session_count;
  RAISE NOTICE 'Auth user exists: %', auth_user_exists;
  
  -- Raise error if verification fails
  IF user_count != 1 OR NOT auth_user_exists THEN
    RAISE EXCEPTION 'Migration verification failed. User record or auth user missing.';
  END IF;
  
  RAISE NOTICE 'Migration completed successfully! Frontend should now detect extension connection.';
END
$$;

COMMIT;