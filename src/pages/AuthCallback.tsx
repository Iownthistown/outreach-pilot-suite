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
      console.log('AuthCallback useEffect triggered - loading:', loading, 'processing:', processing, 'user:', !!user);
      
      if (loading || processing) {
        console.log('Skipping callback handler - loading or processing');
        return;
      }
      
      if (user) {
        setProcessing(true);
        console.log('OAuth successful, user authenticated:', user.id);
        console.log('User metadata:', user.user_metadata);
        console.log('User email:', user.email);
        
        try {
          // Wait a bit for the auth session to fully settle
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user already exists in our users table
          console.log('Checking if user exists in users table...');
          const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          console.log('User lookup result:', { existingUser, userError });

          if (userError && userError.code !== 'PGRST116') {
            console.error('Error checking existing user:', userError);
            throw userError;
          }

          if (existingUser) {
            // Existing user - go to dashboard
            console.log('Existing user found, redirecting to dashboard');
            navigate("/dashboard", { replace: true });
          } else {
            // New user - create account and go to onboarding
            console.log('New user, creating account and starting onboarding');
            
            const userData = {
              id: user.id,
              email: user.email!,
              twitter_handle: user.user_metadata?.preferred_username || null,
              twitter_display_name: user.user_metadata?.full_name || null,
              twitter_profile_image_url: user.user_metadata?.avatar_url || null,
              connection_method: 'google',
              session_origin: 'google_oauth'
            };
            
            console.log('Inserting user data:', userData);
            
            const { data: insertData, error: insertError } = await supabase
              .from('users')
              .insert(userData)
              .select()
              .single();

            if (insertError) {
              console.error('Error creating user account:', insertError);
              console.error('Insert error details:', {
                code: insertError.code,
                message: insertError.message,
                details: insertError.details,
                hint: insertError.hint
              });
              throw insertError;
            }

            console.log('User account created successfully:', insertData);
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