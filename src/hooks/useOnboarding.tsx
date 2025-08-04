import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface OnboardingState {
  welcomeCompleted: boolean;
  accountSetup: boolean;
  twitterConnected: boolean;
  extensionInstalled: boolean;
  accountAnalyzed: boolean;
  botConfigured: boolean;
  onboardingComplete: boolean;
  currentStep: number;
  loading: boolean;
  error: string | null;
  analysisData?: any;
  botConfig?: any;
}

interface OnboardingData {
  welcome_completed: boolean;
  account_setup: boolean;
  twitter_connected: boolean;
  extension_installed: boolean;
  account_analyzed: boolean;
  bot_configured: boolean;
  onboarding_complete: boolean;
  user_id: string;
  timestamp: number;
  analysis_data?: any;
  bot_config?: any;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<OnboardingState>({
    welcomeCompleted: false,
    accountSetup: false,
    twitterConnected: false,
    extensionInstalled: false,
    accountAnalyzed: false,
    botConfigured: false,
    onboardingComplete: false,
    currentStep: 0,
    loading: false,
    error: null,
    analysisData: null,
    botConfig: null
  });

  const [extensionCheckInterval, setExtensionCheckInterval] = useState<NodeJS.Timeout | null>(null);

  // Initialize onboarding state from localStorage
  useEffect(() => {
    const savedStep = localStorage.getItem('onboarding_step');
    const welcomeCompleted = localStorage.getItem('onboarding_welcome_completed') === 'true';
    const accountSetup = localStorage.getItem('onboarding_account_setup') === 'true';
    const twitterConnected = localStorage.getItem('costras_twitter_connected') === 'true';
    const extensionInstalled = localStorage.getItem('costras_extension_installed') === 'true';
    const accountAnalyzed = localStorage.getItem('onboarding_account_analyzed') === 'true';
    const botConfigured = localStorage.getItem('onboarding_bot_configured') === 'true';
    const onboardingComplete = localStorage.getItem('onboarding_complete') === 'true';
    
    // Load saved analysis data and bot config
    const analysisData = localStorage.getItem('onboarding_analysis_data');
    const botConfig = localStorage.getItem('onboarding_bot_config');
    
    setState(prev => ({
      ...prev,
      currentStep: savedStep ? parseInt(savedStep) : 0,
      welcomeCompleted,
      accountSetup,
      twitterConnected,
      extensionInstalled,
      accountAnalyzed,
      botConfigured,
      onboardingComplete,
      analysisData: analysisData ? JSON.parse(analysisData) : null,
      botConfig: botConfig ? JSON.parse(botConfig) : null
    }));
  }, []);

  // Store user ID in localStorage and window when user changes
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem('costras_user_id', user.id);
      (window as any).costrasUserId = user.id;
    }
  }, [user]);

  // Listen for extension events
  useEffect(() => {
    const handleExtensionInstalled = () => {
      setState(prev => ({ ...prev, extensionInstalled: true }));
      localStorage.setItem('costras_extension_installed', 'true');
      toast({
        title: "Success!",
        description: "Chrome extension detected successfully!",
      });
    };

    const handleTwitterConnected = () => {
      setState(prev => ({ ...prev, twitterConnected: true }));
      localStorage.setItem('costras_twitter_connected', 'true');
      toast({
        title: "Success!",
        description: "Twitter account connected successfully!",
      });
    };

    window.addEventListener('costrasExtensionInstalled', handleExtensionInstalled);
    window.addEventListener('costrasTwitterConnected', handleTwitterConnected);
    window.addEventListener('costrasConnectionSuccess', handleTwitterConnected);

    return () => {
      window.removeEventListener('costrasExtensionInstalled', handleExtensionInstalled);
      window.removeEventListener('costrasTwitterConnected', handleTwitterConnected);
      window.removeEventListener('costrasConnectionSuccess', handleTwitterConnected);
    };
  }, [toast]);

  // Backend API calls
  const trackOnboardingStep = useCallback(async (step: number, data: Partial<OnboardingData> = {}) => {
    if (!user?.id) return;

    try {
      await fetch('https://api.costras.com/onboarding/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({
          step,
          user_id: user.id,
          data,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to track onboarding step:', error);
    }
  }, [user?.id]);

  const saveOnboardingData = useCallback(async (data: Partial<OnboardingData>) => {
    if (!user?.id) return;

    try {
      const response = await fetch('https://api.costras.com/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({
          welcome_completed: data.welcome_completed || false,
          account_setup: data.account_setup || false,
          twitter_connected: data.twitter_connected || false,
          extension_installed: data.extension_installed || false,
          onboarding_complete: data.onboarding_complete || false,
          user_id: user.id,
          timestamp: Date.now()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save onboarding data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
      });
    }
  }, [user?.id, toast]);

  // Extension detection
  const checkExtensionInstalled = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      if (typeof window !== 'undefined') {
        // Check if extension is available
        const script = document.createElement('script');
        script.textContent = `
          if (typeof chrome !== 'undefined' && chrome.runtime) {
            window.postMessage({ type: 'EXTENSION_CHECK' }, '*');
          }
        `;
        document.head.appendChild(script);
        document.head.removeChild(script);
        
        // Listen for extension response
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'EXTENSION_INSTALLED') {
            window.removeEventListener('message', handleMessage);
            resolve(true);
          }
        };
        
        window.addEventListener('message', handleMessage);
        
        // Timeout after 3 seconds
        setTimeout(() => {
          window.removeEventListener('message', handleMessage);
          resolve(false);
        }, 3000);
      } else {
        resolve(false);
      }
    });
  }, []);

  const startExtensionDetection = useCallback(() => {
    if (extensionCheckInterval) {
      clearInterval(extensionCheckInterval);
    }

    const interval = setInterval(async () => {
      const installed = await checkExtensionInstalled();
      if (installed && !state.extensionInstalled) {
        setState(prev => ({ ...prev, extensionInstalled: true }));
        localStorage.setItem('costras_extension_installed', 'true');
        await trackOnboardingStep(2, { extension_installed: true });
        toast({
          title: "Success!",
          description: "Chrome extension detected successfully!",
        });
        clearInterval(interval);
        setExtensionCheckInterval(null);
      }
    }, 2000);

    setExtensionCheckInterval(interval);
  }, [checkExtensionInstalled, state.extensionInstalled, trackOnboardingStep, toast]);

  const stopExtensionDetection = useCallback(() => {
    if (extensionCheckInterval) {
      clearInterval(extensionCheckInterval);
      setExtensionCheckInterval(null);
    }
  }, [extensionCheckInterval]);

  // Step navigation
  const nextStep = useCallback(async () => {
    const newStep = state.currentStep + 1;
    setState(prev => ({ ...prev, currentStep: newStep }));
    localStorage.setItem('onboarding_step', newStep.toString());
    await trackOnboardingStep(newStep);
  }, [state.currentStep, trackOnboardingStep]);

  const goBack = useCallback(() => {
    if (state.currentStep > 0) {
      const newStep = state.currentStep - 1;
      setState(prev => ({ ...prev, currentStep: newStep }));
      localStorage.setItem('onboarding_step', newStep.toString());
    }
  }, [state.currentStep]);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  // Welcome step
  const handleWelcomeComplete = useCallback(async () => {
    setLoading(true);
    
    try {
      setState(prev => ({ ...prev, welcomeCompleted: true }));
      localStorage.setItem('onboarding_welcome_completed', 'true');
      await trackOnboardingStep(0, { welcome_completed: true });
      await nextStep();
    } catch (error) {
      setError('Failed to complete welcome step');
    } finally {
      setLoading(false);
    }
  }, [trackOnboardingStep, nextStep, setLoading, setError]);

  // Account setup
  const handleAccountSetup = useCallback(async () => {
    setLoading(true);
    
    try {
      setState(prev => ({ ...prev, accountSetup: true }));
      localStorage.setItem('onboarding_account_setup', 'true');
      await trackOnboardingStep(1, { account_setup: true });
      await nextStep();
    } catch (error) {
      setError('Failed to complete account setup');
    } finally {
      setLoading(false);
    }
  }, [trackOnboardingStep, nextStep, setLoading, setError]);

  // Extension installation
  const handleExtensionInstall = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Open Chrome Web Store
      window.open('https://chromewebstore.google.com/detail/twitter-bot-connector/mnegdfmbhfmahjhhgibhpabkmobleikk', '_blank');
      
      // Start detection
      startExtensionDetection();
      
      toast({
        title: "Installing...",
        description: "Please install the extension and we'll detect it automatically.",
      });
    } catch (error) {
      setError('Failed to open Chrome Web Store');
      toast({
        title: "Error",
        description: "Failed to open Chrome Web Store. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [startExtensionDetection, toast, setLoading, setError]);

  // Twitter connection
  const handleTwitterConnect = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // The actual connection happens via the extension
      // This just advances to the next step
      await nextStep();
    } catch (error) {
      setError('Failed to proceed to Twitter connection');
    } finally {
      setLoading(false);
    }
  }, [nextStep, setLoading, setError]);

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    setLoading(true);
    
    try {
      setState(prev => ({ ...prev, onboardingComplete: true }));
      localStorage.setItem('onboarding_complete', 'true');
      await saveOnboardingData({
        welcome_completed: state.welcomeCompleted,
        account_setup: state.accountSetup,
        twitter_connected: state.twitterConnected,
        extension_installed: state.extensionInstalled,
        onboarding_complete: true
      });
      
      toast({
        title: "Welcome to COSTRAS!",
        description: "Your account is ready. Redirecting to dashboard...",
      });
    } catch (error) {
      setError('Failed to complete onboarding');
      toast({
        title: "Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [state, saveOnboardingData, toast, setLoading, setError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopExtensionDetection();
    };
  }, [stopExtensionDetection]);

  // Auto-advance when extension is detected
  useEffect(() => {
    if (state.extensionInstalled && state.currentStep === 2) {
      setTimeout(() => {
        nextStep();
      }, 2000);
    }
  }, [state.extensionInstalled, state.currentStep, nextStep]);

  // Auto-advance when Twitter is connected
  useEffect(() => {
    if (state.twitterConnected && state.currentStep === 3) {
      setTimeout(() => {
        nextStep();
      }, 2000);
    }
  }, [state.twitterConnected, state.currentStep, nextStep]);

  // Account analysis
  const handleAnalysisComplete = useCallback(async (analysisData: any) => {
    setState(prev => ({ ...prev, accountAnalyzed: true, analysisData }));
    localStorage.setItem('onboarding_account_analyzed', 'true');
    localStorage.setItem('onboarding_analysis_data', JSON.stringify(analysisData));
    await trackOnboardingStep(4, { account_analyzed: true, analysis_data: analysisData });
    await nextStep();
  }, [trackOnboardingStep, nextStep]);

  // Bot configuration
  const handleBotConfiguration = useCallback(async (botConfig: any) => {
    setState(prev => ({ ...prev, botConfigured: true, botConfig }));
    localStorage.setItem('onboarding_bot_configured', 'true');
    localStorage.setItem('onboarding_bot_config', JSON.stringify(botConfig));
    await trackOnboardingStep(5, { bot_configured: true, bot_config: botConfig });
    await nextStep();
  }, [trackOnboardingStep, nextStep]);

  return {
    ...state,
    handleWelcomeComplete,
    handleAccountSetup,
    handleTwitterConnect,
    handleExtensionInstall,
    handleAnalysisComplete,
    handleBotConfiguration,
    completeOnboarding,
    nextStep,
    goBack,
    setLoading,
    setError,
    startExtensionDetection,
    stopExtensionDetection
  };
};