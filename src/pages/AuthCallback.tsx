import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    
    const handleRedirect = () => {
      if (user) {
        console.log('OAuth successful, redirecting to onboarding');
        navigate("/onboarding", { replace: true });
      } else if (!loading) {
        console.log('OAuth failed, redirecting to login');
        navigate("/login", { replace: true });
      }
    };

    // Check immediately if auth state is ready
    if (!loading) {
      handleRedirect();
    } else {
      // If still loading, wait a bit longer for auth state to settle
      redirectTimer = setTimeout(() => {
        handleRedirect();
      }, 2000);
    }

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
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