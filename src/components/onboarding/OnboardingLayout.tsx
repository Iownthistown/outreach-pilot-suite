import { ReactNode } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

const OnboardingLayout = ({ children, currentStep, totalSteps }: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full transition-colors duration-300 ${
                  i < currentStep 
                    ? "bg-primary" 
                    : i === currentStep 
                    ? "bg-primary/60" 
                    : "bg-muted/30"
                }`}
              />
            ))}
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