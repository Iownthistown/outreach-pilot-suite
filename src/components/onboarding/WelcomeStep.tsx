import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
  loading?: boolean;
}

const WelcomeStep = ({ onNext, loading = false }: WelcomeStepProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 flex items-center justify-center">
            <img 
              src="/lovable-uploads/1b627097-cca7-4da0-9dfb-92968194dc92.png" 
              alt="COSTRAS Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to COSTRAS
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          The ultimate Twitter/X automation platform. Let's get you set up in just a few simple steps.
        </p>
        
        <div className="space-y-3 text-left max-w-md mx-auto">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-foreground">Create your account</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">2</div>
            <span className="text-sm text-muted-foreground">Choose your plan</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">3</div>
            <span className="text-sm text-muted-foreground">Connect your account</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">4</div>
            <span className="text-sm text-muted-foreground">Analyze account</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={onNext}
        disabled={loading}
        size="lg"
        className="w-full max-w-xs mx-auto"
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