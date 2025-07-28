-- Add Twitter connection fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS twitter_handle TEXT,
ADD COLUMN IF NOT EXISTS twitter_display_name TEXT,
ADD COLUMN IF NOT EXISTS twitter_profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_auth_token TEXT,
ADD COLUMN IF NOT EXISTS twitter_ct0_token TEXT,
ADD COLUMN IF NOT EXISTS twitter_connected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS twitter_last_sync TIMESTAMP WITH TIME ZONE;