-- Fix user ID mismatch by creating correct user record and copying extension data
-- First, create the user record with the correct ID from auth.users
INSERT INTO public.users (
  id, 
  email, 
  extension_connected, 
  extension_last_connected, 
  extension_version,
  connection_method,
  session_origin,
  auto_login_enabled,
  twitter_auth_token,
  twitter_ct0_token,
  twitter_handle,
  twitter_display_name,
  twitter_profile_image_url,
  twitter_connected_at,
  twitter_last_sync,
  created_at,
  updated_at
)
SELECT 
  'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid as id,
  'ls23yim@gmail.com' as email,
  extension_connected,
  extension_last_connected,
  extension_version,
  connection_method,
  session_origin,
  auto_login_enabled,
  twitter_auth_token,
  twitter_ct0_token,
  twitter_handle,
  twitter_display_name,
  twitter_profile_image_url,
  twitter_connected_at,
  twitter_last_sync,
  created_at,
  NOW() as updated_at
FROM public.users 
WHERE id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid
ON CONFLICT (id) DO UPDATE SET
  extension_connected = EXCLUDED.extension_connected,
  extension_last_connected = EXCLUDED.extension_last_connected,
  extension_version = EXCLUDED.extension_version,
  connection_method = EXCLUDED.connection_method,
  session_origin = EXCLUDED.session_origin,
  auto_login_enabled = EXCLUDED.auto_login_enabled,
  twitter_auth_token = EXCLUDED.twitter_auth_token,
  twitter_ct0_token = EXCLUDED.twitter_ct0_token,
  twitter_handle = EXCLUDED.twitter_handle,
  twitter_display_name = EXCLUDED.twitter_display_name,
  twitter_profile_image_url = EXCLUDED.twitter_profile_image_url,
  twitter_connected_at = EXCLUDED.twitter_connected_at,
  twitter_last_sync = EXCLUDED.twitter_last_sync,
  updated_at = NOW();

-- Update extension_sessions to point to the correct user ID
UPDATE public.extension_sessions 
SET user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
WHERE user_id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;

-- Optionally clean up the old user record (uncomment if you want to remove it)
-- DELETE FROM public.users WHERE id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;