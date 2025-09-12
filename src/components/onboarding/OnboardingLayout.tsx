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
    { title: "Analyze Account", description: "AI-powered optimization" }
  ];

  return (
    <div className="h-screen w-full bg-gradient-hero flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="w-full max-w-4xl h-full max-h-screen flex flex-col">
        {/* Compact Header with Back Button and Progress - Fixed Height */}
        <div className="flex-shrink-0 h-16 sm:h-20 mb-2 sm:mb-4">
          {/* Back button and step indicator */}
          <div className="flex items-center justify-between mb-2">
            {currentStep > 0 && onGoBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoBack}
                className="text-muted-foreground hover:text-foreground h-8"
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
          <div className="space-y-1 sm:space-y-2">
            {/* Visual progress bar */}
            <div className="relative h-1.5 sm:h-2 bg-muted/30 rounded-full overflow-hidden">
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
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
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
                    className={`w-1 h-1 rounded-full mr-1.5 ${
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

        {/* Main Content Area - Takes remaining height, no scroll */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-card p-3 sm:p-4 lg:p-6 h-full overflow-hidden animate-fade-in">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;