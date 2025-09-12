import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
  loading?: boolean;
}

const WelcomeStep = ({ onNext, loading = false }: WelcomeStepProps) => {
  return (
    <div className="h-full flex flex-col text-center overflow-hidden">
      {/* Header - Fixed Height */}
      <div className="flex-shrink-0 h-16 sm:h-20 flex flex-col justify-center">
        <div className="flex justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/1b627097-cca7-4da0-9dfb-92968194dc92.png" 
              alt="COSTRAS Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
          </div>
        </div>
        
        <h1 className="text-lg sm:text-xl font-bold text-foreground mt-2">
          Welcome to COSTRAS
        </h1>
      </div>

      {/* Main Content - Fixed Height */}
      <div className="flex-1 min-h-0 flex flex-col justify-center space-y-3 overflow-hidden">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Twitter/X automation platform. 4 simple steps to get started.
        </p>
        
        <div className="space-y-1.5 text-left max-w-xs mx-auto">
          <div className="flex items-center gap-2 p-1.5 rounded bg-muted/50">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-xs text-foreground">Account created</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-muted/50">
            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">2</div>
            <span className="text-xs text-muted-foreground">Choose plan</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-muted/50">
            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">3</div>
            <span className="text-xs text-muted-foreground">Install & connect</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-muted/50">
            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">4</div>
            <span className="text-xs text-muted-foreground">Analyze account</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 h-16 flex items-center justify-center">
        <Button 
          onClick={onNext}
          disabled={loading}
          size="lg"
          className="w-full max-w-sm mx-auto"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <ArrowRight className="w-4 h-4 mr-2" />
          )}
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;