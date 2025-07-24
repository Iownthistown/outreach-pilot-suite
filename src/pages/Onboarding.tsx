import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import AccountSetupStep from "@/components/onboarding/AccountSetupStep";
import ChromeExtensionStep from "@/components/onboarding/ChromeExtensionStep";
import TwitterConnectStep from "@/components/onboarding/TwitterConnectStep";
import SuccessStep from "@/components/onboarding/SuccessStep";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/hooks/useAuth";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const totalSteps = 5;
  
  const {
    currentStep,
    loading,
    extensionInstalled,
    twitterConnected,
    handleWelcomeComplete,
    handleAccountSetup,
    handleExtensionInstall,
    handleTwitterConnect,
    completeOnboarding,
    nextStep
  } = useOnboarding();

  // Redirect to dashboard if user completes onboarding
  useEffect(() => {
    if (currentStep >= totalSteps) {
      navigate("/dashboard");
    }
  }, [currentStep, totalSteps, navigate]);

  // Redirect to login if not authenticated and past account setup
  useEffect(() => {
    if (!authLoading && !user && currentStep > 1) {
      navigate("/login");
    }
  }, [authLoading, user, navigate, currentStep]);

  const handleComplete = async () => {
    await completeOnboarding();
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <WelcomeStep 
            onNext={handleWelcomeComplete} 
            loading={loading}
          />
        );
      case 1:
        return (
          <AccountSetupStep 
            onNext={handleAccountSetup} 
            loading={loading}
          />
        );
      case 2:
        return (
          <ChromeExtensionStep 
            onNext={nextStep}
            loading={loading}
            extensionInstalled={extensionInstalled}
            onInstall={handleExtensionInstall}
          />
        );
      case 3:
        return (
          <TwitterConnectStep 
            onNext={handleTwitterConnect} 
            loading={loading}
          />
        );
      case 4:
        return <SuccessStep onComplete={handleComplete} />;
      default:
        return (
          <WelcomeStep 
            onNext={handleWelcomeComplete} 
            loading={loading}
          />
        );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingLayout 
      currentStep={currentStep} 
      totalSteps={totalSteps}
      loading={loading}
    >
      {renderStep()}
    </OnboardingLayout>
  );
};

export default Onboarding;