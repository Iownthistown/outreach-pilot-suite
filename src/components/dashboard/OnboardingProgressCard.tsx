import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, CreditCard, Chrome, Twitter, BarChart3, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { onboardingProgressService, OnboardingProgress } from "@/services/onboardingProgressService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";

interface OnboardingStep {
  id: string;
  title: string;
  icon: React.ElementType;
  route?: string;
  action?: () => void;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome_completed',
    title: 'Get Started',
    icon: Sparkles,
    route: '/onboarding?step=0',
  },
  {
    id: 'plan_selected',
    title: 'Choose Your Plan',
    icon: CreditCard,
    route: '/onboarding?step=1',
  },
  {
    id: 'extension_installed',
    title: 'Install Extension',
    icon: Chrome,
    route: '/onboarding?step=2',
  },
  {
    id: 'twitter_connected',
    title: 'Connect Twitter',
    icon: Twitter,
    route: '/onboarding?step=2',
  },
  {
    id: 'account_analyzed',
    title: 'Analyze Account',
    icon: BarChart3,
    route: '/onboarding?step=3',
  },
];

export default function OnboardingProgressCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { subscription } = useSubscription();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback function to detect progress from Supabase data
  const detectProgressFromSupabase = async (): Promise<OnboardingProgress> => {
    try {
      // Get user data
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      // Check for account analysis
      const { data: analysisData } = await (supabase as any)
        .from('account_analyses')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      // Determine progress based on available data
      const welcome_completed = true; // Always true if user reached dashboard
      const plan_selected = !!userData?.stripe_customer_id || !!subscription;
      const extension_installed = !!userData?.extension_connected;
      const twitter_connected = !!userData?.twitter_handle;
      const account_analyzed = analysisData && analysisData.length > 0;
      const setup_completed = plan_selected && extension_installed && twitter_connected && account_analyzed;

      // Calculate completion percentage
      const steps = [welcome_completed, plan_selected, extension_installed, twitter_connected, account_analyzed];
      const completedSteps = steps.filter(Boolean).length;
      const completion_percentage = Math.round((completedSteps / 5) * 100);

      // Determine current step
      let current_step = 'setup_completed';
      if (!welcome_completed) current_step = 'welcome_completed';
      else if (!plan_selected) current_step = 'plan_selected';
      else if (!extension_installed) current_step = 'extension_installed';
      else if (!twitter_connected) current_step = 'twitter_connected';
      else if (!account_analyzed) current_step = 'account_analyzed';

      return {
        welcome_completed,
        plan_selected,
        extension_installed,
        twitter_connected,
        account_analyzed,
        setup_completed,
        completion_percentage,
        current_step,
        is_completed: setup_completed,
      };
    } catch (error) {
      console.error('Error detecting progress from Supabase:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try the API
        try {
          const progressData = await onboardingProgressService.getOnboardingProgress(user.id);
          setProgress(progressData);
        } catch (apiError) {
          console.log('API unavailable, falling back to Supabase detection:', apiError);
          
          // Fallback to Supabase detection
          const fallbackProgress = await detectProgressFromSupabase();
          setProgress(fallbackProgress);
        }
      } catch (error) {
        console.error('Error loading onboarding progress:', error);
        setError('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchProgress, 30000);
    return () => clearInterval(interval);
  }, [user?.id, subscription]);

  const handleStepAction = (step: OnboardingStep) => {
    if (step.route) {
      navigate(step.route);
    } else if (step.action) {
      step.action();
    }
  };

  const getStepStatus = (stepId: string): 'completed' | 'current' | 'pending' => {
    if (!progress) return 'pending';
    
    if (progress[stepId as keyof OnboardingProgress] === true) {
      return 'completed';
    }
    
    if (progress.current_step === stepId) {
      return 'current';
    }
    
    return 'pending';
  };

  const getCurrentStepIndex = (): number => {
    if (!progress) return 0;
    return ONBOARDING_STEPS.findIndex(step => step.id === progress.current_step);
  };

  const getNextActionableStep = (): OnboardingStep | null => {
    if (!progress) return ONBOARDING_STEPS[0];
    
    for (const step of ONBOARDING_STEPS) {
      const status = getStepStatus(step.id);
      if (status === 'current' || status === 'pending') {
        return step;
      }
    }
    
    return null;
  };

  const completedSteps = ONBOARDING_STEPS.filter(step => getStepStatus(step.id) === 'completed').length;

  // Don't show card if onboarding is complete
  if (progress?.is_completed || progress?.completion_percentage === 100) {
    return null;
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl bg-gradient-card border-border/50 shadow-card">
        <CardHeader className="pb-3">
          <div className="h-5 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="h-3 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl bg-gradient-card border-border/50 shadow-card">
        <CardContent className="pt-4 pb-4">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Progress tracking temporarily unavailable</p>
            <p className="text-xs mt-1">Using local detection</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const nextStep = getNextActionableStep();

  return (
    <Card className="w-full max-w-2xl bg-gradient-card border-border/50 shadow-card animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-primary animate-pulse" />
            Complete Your Setup
          </CardTitle>
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            {completedSteps}/{ONBOARDING_STEPS.length} steps
          </span>
        </div>
        <div className="space-y-2 mt-3">
          <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress?.completion_percentage || 0}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {progress?.completion_percentage || 0}% complete
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="grid gap-2">
          {ONBOARDING_STEPS.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;
            
            return (
              <div
                key={step.id}
                className={`group flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 hover:scale-[1.01] ${
                  status === 'completed'
                    ? 'bg-success/10 border-success/20 hover:bg-success/15'
                    : status === 'current'
                    ? 'bg-primary/10 border-primary/30 hover:bg-primary/15 shadow-button/20'
                    : 'bg-muted/20 border-border/30 hover:bg-muted/30'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-success text-success-foreground scale-110'
                      : status === 'current'
                      ? 'bg-primary text-primary-foreground animate-glow'
                      : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20'
                  }`}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium transition-colors ${
                      status === 'completed'
                        ? 'text-success-foreground'
                        : status === 'current'
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                
                {(status === 'current' || status === 'pending') && step.route && (
                  <Button
                    size="sm"
                    onClick={() => handleStepAction(step)}
                    className="ml-auto h-7 px-3 text-xs shadow-button hover:shadow-glow transition-all duration-300"
                  >
                    {status === 'current' ? 'Continue' : 'Start'}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        
        {nextStep && nextStep.route && (
          <div className="pt-2 mt-3 border-t border-border/50">
            <Button 
              onClick={() => handleStepAction(nextStep)}
              className="w-full h-9 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-sm font-medium"
            >
              Continue Setup: {nextStep.title}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}