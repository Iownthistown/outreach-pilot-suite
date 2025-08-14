import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import PlanSelectionStep from "@/components/onboarding/PlanSelectionStep";
import ChromeExtensionStep from "@/components/onboarding/ChromeExtensionStep";
import AccountAnalysisStep from "@/components/onboarding/AccountAnalysisStep";
import BotConfigurationStep from "@/components/onboarding/BotConfigurationStep";
import FinalSuccessStep from "@/components/onboarding/FinalSuccessStep";
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
    handleExtensionInstall,
    handleTwitterConnect,
    handleAnalysisComplete,
    handleBotConfiguration,
    completeOnboarding,
    nextStep,
    goBack,
    analysisData,
    botConfig
  } = useOnboarding();

  // Redirect to dashboard if user completes onboarding
  useEffect(() => {
    if (currentStep >= totalSteps) {
      navigate("/dashboard");
    }
  }, [currentStep, totalSteps, navigate]);

  // Handle authentication state - only redirect if we're sure user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('User not authenticated in onboarding, redirecting to login');
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

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
          <PlanSelectionStep 
            onNext={nextStep} 
            loading={loading}
          />
        );
      case 2:
        return (
          <ChromeExtensionStep 
            onNext={handleTwitterConnect}
            loading={loading}
            extensionInstalled={extensionInstalled}
            twitterConnected={twitterConnected}
            onInstall={handleExtensionInstall}
          />
        );
      case 3:
        return (
          <AccountAnalysisStep
            onNext={nextStep}
            loading={loading}
            twitterConnected={twitterConnected}
            onAnalysisComplete={handleAnalysisComplete}
            twitterHandle={localStorage.getItem('costras_twitter_handle') || undefined}
            userId={user?.id}
          />
        );
      case 4:
        return (
          <BotConfigurationStep
            onNext={() => handleBotConfiguration({})}
            loading={loading}
            analysisData={analysisData}
          />
        );
      case 5:
        return (
          <FinalSuccessStep 
            onComplete={handleComplete}
            analysisData={analysisData}
            botConfig={botConfig}
          />
        );
      default:
        return (
          <WelcomeStep 
            onNext={handleWelcomeComplete} 
            loading={loading}
          />
        );
    }
  };

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Setting up your account...</p>
        </div>
      </div>
    );
  }

  // Don't render onboarding if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <OnboardingLayout 
      currentStep={currentStep} 
      totalSteps={totalSteps}
      loading={loading}
      onGoBack={goBack}
    >
      {renderStep()}
    </OnboardingLayout>
  );
};

export default Onboarding;