-- Add Chrome Extension tracking fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS extension_connected BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS extension_last_connected TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS extension_version TEXT,
ADD COLUMN IF NOT EXISTS connection_method TEXT DEFAULT 'manual' CHECK (connection_method IN ('manual', 'extension')),
ADD COLUMN IF NOT EXISTS session_origin TEXT DEFAULT 'website' CHECK (session_origin IN ('website', 'extension')),
ADD COLUMN IF NOT EXISTS auto_login_enabled BOOLEAN DEFAULT FALSE;

-- Create table for tracking extension sessions
CREATE TABLE IF NOT EXISTS public.extension_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL,
  extension_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE,
  browser_info TEXT,
  ip_address TEXT
);

-- Enable RLS on extension_sessions
ALTER TABLE public.extension_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for extension_sessions
CREATE POLICY "Users can view their own extension sessions" 
ON public.extension_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own extension sessions" 
ON public.extension_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own extension sessions" 
ON public.extension_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage extension sessions" 
ON public.extension_sessions 
FOR ALL 
USING (current_setting('role') = 'service_role');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_extension_sessions_updated_at
BEFORE UPDATE ON public.extension_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update extension status
CREATE OR REPLACE FUNCTION public.update_extension_status(
  p_user_id UUID,
  p_extension_version TEXT DEFAULT NULL,
  p_session_token TEXT DEFAULT NULL,
  p_browser_info TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Update user extension status
  UPDATE public.users 
  SET 
    extension_connected = TRUE,
    extension_last_connected = NOW(),
    extension_version = COALESCE(p_extension_version, extension_version),
    connection_method = 'extension',
    session_origin = 'extension',
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Create or update extension session
  INSERT INTO public.extension_sessions (
    user_id, 
    session_token, 
    extension_version, 
    browser_info, 
    last_activity
  ) VALUES (
    p_user_id, 
    COALESCE(p_session_token, gen_random_uuid()::text), 
    p_extension_version, 
    p_browser_info, 
    NOW()
  )
  ON CONFLICT (session_token) 
  DO UPDATE SET 
    last_activity = NOW(),
    is_active = TRUE;

  -- Return updated status
  SELECT JSON_BUILD_OBJECT(
    'success', TRUE,
    'extension_connected', TRUE,
    'last_connected', extension_last_connected,
    'version', extension_version,
    'connection_method', connection_method
  ) INTO result
  FROM public.users
  WHERE id = p_user_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to disconnect extension
CREATE OR REPLACE FUNCTION public.disconnect_extension(p_user_id UUID)
RETURNS JSON AS $$
BEGIN
  -- Update user extension status
  UPDATE public.users 
  SET 
    extension_connected = FALSE,
    connection_method = 'manual',
    session_origin = 'website',
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Deactivate extension sessions
  UPDATE public.extension_sessions 
  SET 
    is_active = FALSE,
    last_activity = NOW()
  WHERE user_id = p_user_id AND is_active = TRUE;

  RETURN JSON_BUILD_OBJECT('success', TRUE, 'extension_connected', FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_extension_sessions_user_id ON public.extension_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_extension_sessions_active ON public.extension_sessions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_users_extension_connected ON public.users(extension_connected);