import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, CreditCard, Chrome, Twitter, BarChart3, Sparkles, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { onboardingProgressService, OnboardingProgress } from "@/services/onboardingProgressService";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";

interface OnboardingStep {
  id: string;
  title: string;
  icon: React.ElementType;
  route?: string;
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

interface OnboardingWidgetProps {
  onDismiss: () => void;
}

export default function OnboardingWidget({ onDismiss }: OnboardingWidgetProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subscription } = useSubscription();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Fallback function to detect progress from Supabase data
  const detectProgressFromSupabase = async (): Promise<OnboardingProgress> => {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: analysisData } = await (supabase as any)
        .from('account_analyses')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      const welcome_completed = true;
      const plan_selected = !!userData?.stripe_customer_id || !!subscription;
      const extension_installed = !!userData?.extension_connected;
      const twitter_connected = !!userData?.twitter_handle;
      const account_analyzed = analysisData && analysisData.length > 0;
      const setup_completed = plan_selected && extension_installed && twitter_connected && account_analyzed;

      const steps = [welcome_completed, plan_selected, extension_installed, twitter_connected, account_analyzed];
      const completedSteps = steps.filter(Boolean).length;
      const completion_percentage = Math.round((completedSteps / 5) * 100);

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
        
        try {
          const progressData = await onboardingProgressService.getOnboardingProgress(user.id);
          setProgress(progressData);
        } catch (apiError) {
          const fallbackProgress = await detectProgressFromSupabase();
          setProgress(fallbackProgress);
        }
      } catch (error) {
        console.error('Error loading onboarding progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();

    // Animate in
    setTimeout(() => setIsVisible(true), 100);

    const interval = setInterval(fetchProgress, 30000);
    return () => clearInterval(interval);
  }, [user?.id, subscription]);

  const handleStepAction = (step: OnboardingStep) => {
    if (step.route) {
      navigate(step.route);
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

  // Don't show widget if onboarding is complete
  if (progress?.is_completed || progress?.completion_percentage === 100) {
    return null;
  }

  if (loading) {
    return (
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <Card className="w-80 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
          <CardHeader className="pb-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="h-2 bg-muted rounded animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nextStep = getNextActionableStep();

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Card className="w-80 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-primary animate-pulse" />
              Setup Progress
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 hover:bg-muted/50"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-2 mt-2">
            <div className="relative h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress?.completion_percentage || 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {completedSteps}/{ONBOARDING_STEPS.length} steps
              </span>
              <span className="text-xs font-medium text-foreground">
                {progress?.completion_percentage || 0}% complete
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-4 space-y-2">
          <div className="space-y-1">
            {ONBOARDING_STEPS.map((step, index) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;
              
              return (
                <div
                  key={step.id}
                  className={`group flex items-center gap-2.5 p-2 rounded-md transition-all duration-200 hover:bg-muted/30 ${
                    status === 'completed'
                      ? 'opacity-70'
                      : status === 'current'
                      ? 'bg-primary/5 border border-primary/20'
                      : 'hover:bg-muted/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                      status === 'completed'
                        ? 'bg-success text-success-foreground'
                        : status === 'current'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : status === 'current' ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <Icon className="w-3 h-3" />
                    )}
                  </div>
                  
                  <span
                    className={`text-xs font-medium flex-1 ${
                      status === 'completed'
                        ? 'text-muted-foreground line-through'
                        : status === 'current'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </span>
                  
                  {(status === 'current' || status === 'pending') && step.route && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStepAction(step)}
                      className="h-6 w-6 p-0 hover:bg-primary/20"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
          
          {nextStep && nextStep.route && (
            <div className="pt-2 mt-3 border-t border-border/30">
              <Button 
                onClick={() => handleStepAction(nextStep)}
                size="sm"
                className="w-full h-8 bg-gradient-primary hover:shadow-md transition-all duration-200 text-xs font-medium"
              >
                Continue: {nextStep.title}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}