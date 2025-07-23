import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import ConnectTwitterStep from "@/components/onboarding/ConnectTwitterStep";
import ChromeExtensionStep from "@/components/onboarding/ChromeExtensionStep";
import SuccessStep from "@/components/onboarding/SuccessStep";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/hooks/useAuth";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const totalSteps = 3;
  
  const {
    currentStep,
    loading,
    extensionInstalled,
    handleTwitterConnect,
    handleExtensionInstall,
    completeOnboarding,
    nextStep
  } = useOnboarding();

  // Redirect to dashboard if user completes onboarding
  useEffect(() => {
    if (currentStep >= totalSteps) {
      navigate("/dashboard");
    }
  }, [currentStep, totalSteps, navigate]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
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
          <ConnectTwitterStep 
            onNext={handleTwitterConnect} 
            loading={loading}
          />
        );
      case 1:
        return (
          <ChromeExtensionStep 
            onNext={nextStep}
            loading={loading}
            extensionInstalled={extensionInstalled}
            onInstall={handleExtensionInstall}
          />
        );
      case 2:
        return <SuccessStep onComplete={handleComplete} />;
      default:
        return (
          <ConnectTwitterStep 
            onNext={handleTwitterConnect} 
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