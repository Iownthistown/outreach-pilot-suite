import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Add a small delay to ensure auth state is fully processed
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          console.log('OAuth successful, redirecting to onboarding');
          // User is authenticated, redirect to onboarding
          navigate("/onboarding", { replace: true });
        } else {
          console.log('OAuth failed, redirecting to login');
          // Authentication failed, redirect to login
          navigate("/login", { replace: true });
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, loading, navigate]);

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