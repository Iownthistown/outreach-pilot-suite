import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
  loading?: boolean;
}

const WelcomeStep = ({ onNext, loading = false }: WelcomeStepProps) => {
  return (
    <div className="text-center space-y-4 sm:space-y-6 h-full flex flex-col justify-center">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
            <img 
              src="/lovable-uploads/1b627097-cca7-4da0-9dfb-92968194dc92.png" 
              alt="COSTRAS Logo" 
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
            />
          </div>
        </div>
        
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          Welcome to COSTRAS
        </h1>
        
        <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto">
          Twitter/X automation platform. Let's get you set up in 4 simple steps.
        </p>
        
        <div className="space-y-2 text-left max-w-sm mx-auto">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs sm:text-sm text-foreground">Account created</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">2</div>
            <span className="text-xs sm:text-sm text-muted-foreground">Choose plan</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">3</div>
            <span className="text-xs sm:text-sm text-muted-foreground">Install & connect</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">4</div>
            <span className="text-xs sm:text-sm text-muted-foreground">Analyze account</span>
          </div>
        </div>
      </div>

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
  );
};

export default WelcomeStep;