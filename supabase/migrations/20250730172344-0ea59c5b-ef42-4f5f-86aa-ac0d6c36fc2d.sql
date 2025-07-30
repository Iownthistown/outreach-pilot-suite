-- Check if user exists and copy extension data to correct user ID
DO $$
DECLARE
    source_user_exists BOOLEAN;
    target_user_exists BOOLEAN;
BEGIN
    -- Check if source user exists
    SELECT EXISTS(SELECT 1 FROM public.users WHERE id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid) INTO source_user_exists;
    
    -- Check if target user exists
    SELECT EXISTS(SELECT 1 FROM public.users WHERE id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid) INTO target_user_exists;
    
    IF source_user_exists THEN
        IF target_user_exists THEN
            -- Target user exists, update it with extension data from source
            UPDATE public.users 
            SET 
                extension_connected = source.extension_connected,
                extension_last_connected = source.extension_last_connected,
                extension_version = source.extension_version,
                connection_method = source.connection_method,
                session_origin = source.session_origin,
                auto_login_enabled = source.auto_login_enabled,
                twitter_auth_token = source.twitter_auth_token,
                twitter_ct0_token = source.twitter_ct0_token,
                twitter_handle = source.twitter_handle,
                twitter_display_name = source.twitter_display_name,
                twitter_profile_image_url = source.twitter_profile_image_url,
                twitter_connected_at = source.twitter_connected_at,
                twitter_last_sync = source.twitter_last_sync,
                updated_at = NOW()
            FROM public.users source
            WHERE public.users.id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
            AND source.id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;
        ELSE
            -- Target user doesn't exist, create it with data from source
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
            WHERE id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;
        END IF;
        
        -- Update extension_sessions to point to the correct user ID
        UPDATE public.extension_sessions 
        SET user_id = 'fd81b163-9643-4e98-8188-c900aa6feceb'::uuid
        WHERE user_id = '463cfa45-c2b1-41c1-b0de-cf184ccafaa9'::uuid;
        
        RAISE NOTICE 'Successfully copied extension data to correct user ID';
    ELSE
        RAISE NOTICE 'Source user with old ID not found';
    END IF;
END $$;