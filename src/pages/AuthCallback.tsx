import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    let isMounted = true;
    
    const processAuthCallback = async () => {
      // Wait a bit longer to ensure auth state is fully processed
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!isMounted) return;
      
      if (user) {
        console.log('OAuth successful, user authenticated:', user.id);
        navigate("/onboarding", { replace: true });
      } else if (!loading) {
        console.log('OAuth failed or user not found, redirecting to login');
        navigate("/login", { replace: true });
      }
    };

    // Only start processing if loading is complete or we have a user
    if (!loading || user) {
      processAuthCallback();
    }

    return () => {
      isMounted = false;
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