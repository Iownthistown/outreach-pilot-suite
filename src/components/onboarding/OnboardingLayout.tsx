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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Back button */}
        {currentStep > 0 && onGoBack && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={onGoBack}
              className="text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        )}
        
        {/* Enhanced Progress indicator */}
        <div className="mb-12">
          {/* Progress bar */}
          <div className="relative mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => onGoBack && i < currentStep && onGoBack()}
                  disabled={i >= currentStep || loading}
                  className={`flex flex-col items-center relative z-10 ${
                    i < currentStep && onGoBack ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      i < currentStep
                        ? "bg-primary border-primary text-primary-foreground"
                        : i === currentStep
                        ? loading
                          ? "bg-primary/20 border-primary text-primary animate-pulse"
                          : "bg-primary/10 border-primary text-primary"
                        : "bg-muted border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {i < currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : i === currentStep && loading ? (
                      <Clock className="w-6 h-6 animate-spin" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <div
                      className={`text-sm font-semibold transition-colors duration-300 ${
                        i <= currentStep ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div
                      className={`text-xs transition-colors duration-300 ${
                        i <= currentStep ? "text-muted-foreground" : "text-muted-foreground/50"
                      }`}
                    >
                      {step.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Connecting lines */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-muted via-muted to-muted -z-10">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary transition-all duration-700 ease-out"
                style={{
                  width: `${(currentStep / (totalSteps - 1)) * 100}%`
                }}
              />
            </div>
          </div>
          
          {/* Progress percentage */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground">
              Step {currentStep + 1} of {totalSteps} • {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-card p-8 animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;