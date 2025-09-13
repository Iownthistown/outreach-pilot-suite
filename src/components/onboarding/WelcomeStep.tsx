import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Zap, Chrome, Twitter, BarChart3 } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
  loading?: boolean;
}

const WelcomeStep = ({ onNext, loading = false }: WelcomeStepProps) => {
  return (
    <div className="h-full flex flex-col text-center relative px-4 py-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Header - Logo and Title */}
      <div className="flex-shrink-0 relative z-10 mb-8">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/1b627097-cca7-4da0-9dfb-92968194dc92.png" 
            alt="COSTRAS Logo" 
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain filter brightness-110"
          />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
            Welcome to COSTRAS
          </h1>
          <p className="text-sm text-muted-foreground">
            Let's get you set up in just a few simple steps
          </p>
        </div>
      </div>

      {/* Main Content - Elegant Step List */}
      <div className="flex-1 min-h-0 flex flex-col justify-center relative z-10">
        <div className="max-w-md mx-auto px-6">
          
          <div className="space-y-4">
            {/* Step 1 - Account Created (Completed) */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/30 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-foreground">Create your account</span>
            </div>
            
            {/* Step 2 - Choose Plan */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-background/30 border border-border/20 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">2</span>
              </div>
              <span className="text-sm text-muted-foreground">Choose your plan</span>
            </div>
            
            {/* Step 3 - Install Extension */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-background/30 border border-border/20 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">3</span>
              </div>
              <span className="text-sm text-muted-foreground">Install Chrome extension</span>
            </div>
            
            {/* Step 4 - Connect Twitter */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-background/30 border border-border/20 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">4</span>
              </div>
              <span className="text-sm text-muted-foreground">Connect your Twitter/X account</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button - Compact */}
      <div className="flex-shrink-0 h-20 flex items-center justify-center relative z-10">
        <Button 
          onClick={onNext}
          disabled={loading}
          size="lg"
          className="w-full max-w-sm mx-auto h-12 text-base font-semibold bg-gradient-to-r from-primary via-primary to-purple-600 hover:from-primary/90 hover:via-primary/90 hover:to-purple-600/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 rounded-xl group"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          ) : (
            <>
              <ArrowRight className="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" />
              <span>Get Started</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;