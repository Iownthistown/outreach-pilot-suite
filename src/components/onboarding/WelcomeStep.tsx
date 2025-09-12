import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
  loading?: boolean;
}

const WelcomeStep = ({ onNext, loading = false }: WelcomeStepProps) => {
  return (
    <div className="h-full flex flex-col text-center overflow-hidden">
      {/* Header - Bigger and Better */}
      <div className="flex-shrink-0 h-28 sm:h-32 flex flex-col justify-center">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-primary/10 rounded-full">
            <img 
              src="/lovable-uploads/1b627097-cca7-4da0-9dfb-92968194dc92.png" 
              alt="COSTRAS Logo" 
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
          </div>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome to COSTRAS
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Twitter/X automation platform. 4 simple steps to get started.
        </p>
      </div>

      {/* Main Content - Better Proportions */}
      <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
        <div className="space-y-3 text-left max-w-sm mx-auto">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground">Account created</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">2</div>
            <span className="text-sm text-muted-foreground">Choose plan</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">3</div>
            <span className="text-sm text-muted-foreground">Install & connect</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">4</div>
            <span className="text-sm text-muted-foreground">Analyze account</span>
          </div>
        </div>
      </div>

      {/* Button - Bigger and Better */}
      <div className="flex-shrink-0 h-20 flex items-center justify-center">
        <Button 
          onClick={onNext}
          disabled={loading}
          size="lg"
          className="w-full max-w-sm mx-auto h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          ) : (
            <ArrowRight className="w-5 h-5 mr-2" />
          )}
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;