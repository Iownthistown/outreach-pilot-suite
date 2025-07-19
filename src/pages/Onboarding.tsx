import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import ConnectTwitterStep from "@/components/onboarding/ConnectTwitterStep";
import ChromeExtensionStep from "@/components/onboarding/ChromeExtensionStep";
import SuccessStep from "@/components/onboarding/SuccessStep";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    navigate("/dashboard");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ConnectTwitterStep onNext={handleNext} />;
      case 1:
        return <ChromeExtensionStep onNext={handleNext} />;
      case 2:
        return <SuccessStep onComplete={handleComplete} />;
      default:
        return <ConnectTwitterStep onNext={handleNext} />;
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep} totalSteps={totalSteps}>
      {renderStep()}
    </OnboardingLayout>
  );
};

export default Onboarding;