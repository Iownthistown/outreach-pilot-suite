-- Update all related tables to use the correct user ID from auth.users
-- Start with dependent tables first, then the users table

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

-- Finally, update the users table
UPDATE public.users 
SET id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
WHERE id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;