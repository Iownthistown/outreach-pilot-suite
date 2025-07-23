import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface OnboardingState {
  twitterConnected: boolean;
  extensionInstalled: boolean;
  onboardingComplete: boolean;
  currentStep: number;
  loading: boolean;
  error: string | null;
}

interface OnboardingData {
  twitter_connected: boolean;
  extension_installed: boolean;
  onboarding_complete: boolean;
  user_id: string;
  timestamp: number;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<OnboardingState>({
    twitterConnected: false,
    extensionInstalled: false,
    onboardingComplete: false,
    currentStep: 0,
    loading: false,
    error: null
  });

  const [extensionCheckInterval, setExtensionCheckInterval] = useState<NodeJS.Timeout | null>(null);

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
    await trackOnboardingStep(newStep);
  }, [state.currentStep, trackOnboardingStep]);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  // Twitter connection
  const handleTwitterConnect = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      setState(prev => ({ ...prev, twitterConnected: true }));
      await trackOnboardingStep(1, { twitter_connected: true });
      await saveOnboardingData({ twitter_connected: true });
      
      toast({
        title: "Success!",
        description: "Twitter account connected successfully!",
      });
      
      setTimeout(() => {
        nextStep();
      }, 1500);
    } catch (error) {
      setError('Failed to connect Twitter account');
      toast({
        title: "Error",
        description: "Failed to connect Twitter account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [trackOnboardingStep, saveOnboardingData, toast, nextStep, setLoading, setError]);

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

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    setLoading(true);
    
    try {
      setState(prev => ({ ...prev, onboardingComplete: true }));
      await saveOnboardingData({
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
  }, [state.twitterConnected, state.extensionInstalled, saveOnboardingData, toast, setLoading, setError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopExtensionDetection();
    };
  }, [stopExtensionDetection]);

  // Auto-advance when extension is detected
  useEffect(() => {
    if (state.extensionInstalled && state.currentStep === 1) {
      setTimeout(() => {
        nextStep();
      }, 2000);
    }
  }, [state.extensionInstalled, state.currentStep, nextStep]);

  return {
    ...state,
    handleTwitterConnect,
    handleExtensionInstall,
    completeOnboarding,
    nextStep,
    setLoading,
    setError,
    startExtensionDetection,
    stopExtensionDetection
  };
};