import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, CreditCard, Chrome, Twitter, BarChart3, Settings } from "lucide-react";
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
    icon: Check,
  },
  {
    id: 'plan_selected',
    title: 'Choose Your Plan',
    icon: CreditCard,
    route: '/dashboard/plan',
  },
  {
    id: 'extension_installed',
    title: 'Install Extension',
    icon: Chrome,
  },
  {
    id: 'twitter_connected',
    title: 'Connect Twitter',
    icon: Twitter,
  },
  {
    id: 'account_analyzed',
    title: 'Analyze Account',
    icon: BarChart3,
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
      <Card className="w-full">
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>Progress tracking temporarily unavailable</p>
            <p className="text-xs mt-1">Using local detection</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const nextStep = getNextActionableStep();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Complete Your Setup</span>
          <span className="text-sm font-normal text-muted-foreground">
            {completedSteps} of {ONBOARDING_STEPS.length} steps completed
          </span>
        </CardTitle>
        <div className="space-y-2">
          <Progress value={progress?.completion_percentage || 0} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {progress?.completion_percentage || 0}% complete
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {ONBOARDING_STEPS.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;
            
            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                  status === 'completed'
                    ? 'bg-green-50 border-green-200'
                    : status === 'current'
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-muted/30 border-border/50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    status === 'completed'
                      ? 'bg-green-500 text-white'
                      : status === 'current'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      status === 'completed'
                        ? 'text-green-700'
                        : status === 'current'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                
                {status === 'current' && step.route && (
                  <Button
                    size="sm"
                    onClick={() => handleStepAction(step)}
                    className="ml-auto"
                  >
                    Continue
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        
        {nextStep && nextStep.route && (
          <div className="pt-4 border-t">
            <Button 
              onClick={() => handleStepAction(nextStep)}
              className="w-full"
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