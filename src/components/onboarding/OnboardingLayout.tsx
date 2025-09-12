import { ReactNode } from "react";
import { CheckCircle, Clock, Circle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  loading?: boolean;
  onGoBack?: () => void;
}

const OnboardingLayout = ({ children, currentStep, totalSteps, loading = false, onGoBack }: OnboardingLayoutProps) => {
  const steps = [
    { title: "Welcome", description: "Get started with COSTRAS" },
    { title: "Choose Plan", description: "Select your subscription" },
    { title: "Connect & Setup", description: "Install extension & connect account" },
    { title: "Analyze Account", description: "AI-powered analysis" },
    { title: "Complete Setup", description: "Finish configuration" }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-4xl flex flex-col h-screen max-h-screen">
        {/* Compact Header with Back Button and Progress */}
        <div className="flex-shrink-0 mb-4 sm:mb-6">
          {/* Back button and step indicator */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {currentStep > 0 && onGoBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoBack}
                className="text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <div className="text-xs text-muted-foreground ml-auto">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
          
          {/* Compact Progress Bar */}
          <div className="space-y-2">
            {/* Visual progress bar */}
            <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${((currentStep + 1) / totalSteps) * 100}%`
                }}
              />
            </div>
            
            {/* Step indicators for mobile */}
            <div className="flex justify-between sm:hidden">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i < currentStep
                      ? "bg-primary"
                      : i === currentStep
                      ? "bg-primary/60"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            
            {/* Step labels for desktop */}
            <div className="hidden sm:flex justify-between text-xs">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center transition-colors duration-300 ${
                    i <= currentStep ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      i < currentStep
                        ? "bg-primary"
                        : i === currentStep
                        ? "bg-primary/60"
                        : "bg-muted"
                    }`}
                  />
                  {step.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area - Scrollable if needed */}
        <div className="flex-1 overflow-auto">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-card p-4 sm:p-6 lg:p-8 h-full min-h-0 animate-fade-in">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;