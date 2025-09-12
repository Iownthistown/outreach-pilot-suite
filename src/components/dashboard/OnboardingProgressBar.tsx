import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { onboardingProgressService, OnboardingProgress } from "@/services/onboardingProgressService";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";

interface OnboardingProgressBarProps {
  onExpand: () => void;
  onDismiss: () => void;
}

export default function OnboardingProgressBar({ onExpand, onDismiss }: OnboardingProgressBarProps) {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);

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

    const interval = setInterval(fetchProgress, 30000);
    return () => clearInterval(interval);
  }, [user?.id, subscription]);

  // Don't show progress bar if onboarding is complete
  if (progress?.is_completed || progress?.completion_percentage === 100) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full bg-muted/20 border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-2 bg-muted rounded flex-1 max-w-xs animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-6 w-6 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const completedSteps = [
    progress?.welcome_completed,
    progress?.plan_selected,
    progress?.extension_installed,
    progress?.twitter_connected,
    progress?.account_analyzed,
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-background/95 backdrop-blur-sm border-b border-border/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative h-2 bg-muted/30 rounded-full flex-1 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress?.completion_percentage || 0}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {progress?.completion_percentage || 0}% Complete
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
              className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{completedSteps}/5 steps</span>
              <ChevronUp className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
              className="sm:hidden text-xs text-muted-foreground hover:text-foreground"
            >
              Continue Setup
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-7 w-7 p-0 hover:bg-muted/50"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}