import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Mail, Chrome } from "lucide-react";

interface AccountSetupStepProps {
  onNext: () => void;
  loading?: boolean;
}

const AccountSetupStep = ({ onNext, loading = false }: AccountSetupStepProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setAuthLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
      
      // Store user data for extension
      const user = JSON.parse(localStorage.getItem('sb-sjsuwthvozuzabktkcxu-auth-token') || '{}');
      if (user?.user?.id) {
        localStorage.setItem('costras_user_id', user.user.id);
        (window as any).costrasUserId = user.user.id;
      }
      
      onNext();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message || "Please check your credentials and try again.",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
      // Note: Google auth will redirect, so onNext() will be called after redirect
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google authentication failed",
        description: error.message || "Please try again.",
      });
      setAuthLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Create Your Account</h2>
        <p className="text-muted-foreground">
          {isLogin ? "Sign in to continue" : "Get started with COSTRAS"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isLogin ? "Sign In" : "Sign Up"}
          </CardTitle>
          <CardDescription>
            {isLogin ? "Welcome back!" : "Create your COSTRAS account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleAuth}
            disabled={authLoading || loading}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Chrome className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={authLoading || loading}
              className="w-full"
              size="lg"
            >
              {authLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : null}
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              disabled={authLoading || loading}
              className="text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSetupStep;