import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (loading || processing) return;
      
      if (user) {
        setProcessing(true);
        console.log('OAuth successful, user authenticated:', user.id);
        
        try {
          // Check if user already exists in our users table
          const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (userError && userError.code !== 'PGRST116') {
            throw userError;
          }

          if (existingUser) {
            // Existing user - go to dashboard
            console.log('Existing user found, redirecting to dashboard');
            navigate("/dashboard", { replace: true });
          } else {
            // New user - create account and go to onboarding
            console.log('New user, creating account and starting onboarding');
            
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email!,
                twitter_handle: user.user_metadata?.preferred_username || null,
                twitter_display_name: user.user_metadata?.full_name || null,
                twitter_profile_image_url: user.user_metadata?.avatar_url || null,
                connection_method: 'oauth',
                session_origin: 'oauth'
              });

            if (insertError) {
              console.error('Error creating user account:', insertError);
              throw insertError;
            }

            console.log('User account created successfully');
            navigate("/onboarding", { replace: true });
          }
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
          toast({
            title: "Account Setup Error",
            description: "There was an issue setting up your account. Please try again.",
            variant: "destructive"
          });
          navigate("/login", { replace: true });
        } finally {
          setProcessing(false);
        }
      } else if (!loading) {
        console.log('OAuth failed, redirecting to login');
        navigate("/login", { replace: true });
      }
    };

    handleOAuthCallback();
  }, [user, loading, navigate, toast, processing]);

  // Show loading while processing authentication
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Completing sign in...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default AuthCallback;