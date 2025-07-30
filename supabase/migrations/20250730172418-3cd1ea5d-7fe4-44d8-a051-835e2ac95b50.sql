-- Update the existing user record to use the correct ID from auth.users
UPDATE public.users 
SET id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
WHERE id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

-- Update extension_sessions to point to the correct user ID
UPDATE public.extension_sessions 
SET user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
WHERE user_id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;