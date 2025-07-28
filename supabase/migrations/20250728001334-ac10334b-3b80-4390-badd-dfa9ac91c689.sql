-- Enable Row Level Security on billing_history table
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own billing history
CREATE POLICY "Users can view own billing history" 
ON public.billing_history 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for service role to manage all billing history
CREATE POLICY "Service role can manage billing history" 
ON public.billing_history 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);