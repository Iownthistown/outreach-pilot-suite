import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Zap } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
  loading?: boolean;
}

const WelcomeStep = ({ onNext, loading = false }: WelcomeStepProps) => {
  return (
    <div className="h-full flex flex-col text-center overflow-hidden relative">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Header - Premium Design */}
      <div className="flex-shrink-0 h-32 sm:h-36 flex flex-col justify-center relative z-10">
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-border/20 shadow-xl transition-all duration-300 group-hover:scale-105">
              <img 
                src="/lovable-uploads/1b627097-cca7-4da0-9dfb-92968194dc92.png" 
                alt="COSTRAS Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter brightness-110"
              />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent animate-fade-in">
            Welcome to COSTRAS
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto font-medium">
            AI-powered Twitter automation platform
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-primary/80">
            <Zap className="w-4 h-4" />
            <span>4 simple steps to get started</span>
          </div>
        </div>
      </div>

      {/* Main Content - Modern Step Cards */}
      <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden relative z-10">
        <div className="space-y-3 max-w-md mx-auto px-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/50 dark:border-green-800/30 shadow-sm animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-base font-semibold text-green-900 dark:text-green-100">Account created</span>
              <p className="text-sm text-green-700 dark:text-green-300">✓ Ready to proceed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200/50 dark:border-blue-800/30 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              2
            </div>
            <div className="flex-1 text-left">
              <span className="text-base font-medium text-blue-900 dark:text-blue-100">Choose your plan</span>
              <p className="text-sm text-blue-700 dark:text-blue-300">Select pricing tier</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-200/50 dark:border-purple-800/30 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              3
            </div>
            <div className="flex-1 text-left">
              <span className="text-base font-medium text-purple-900 dark:text-purple-100">Install & connect</span>
              <p className="text-sm text-purple-700 dark:text-purple-300">Setup browser extension</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200/50 dark:border-orange-800/30 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              4
            </div>
            <div className="flex-1 text-left">
              <span className="text-base font-medium text-orange-900 dark:text-orange-100">Analyze account</span>
              <p className="text-sm text-orange-700 dark:text-orange-300">AI optimization setup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium CTA Button */}
      <div className="flex-shrink-0 h-24 flex items-center justify-center relative z-10">
        <Button 
          onClick={onNext}
          disabled={loading}
          size="lg"
          className="w-full max-w-sm mx-auto h-14 text-lg font-semibold bg-gradient-to-r from-primary via-primary to-purple-600 hover:from-primary/90 hover:via-primary/90 hover:to-purple-600/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 rounded-xl group"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
          ) : (
            <>
              <ArrowRight className="w-6 h-6 mr-3 transition-transform group-hover:translate-x-1" />
              <span>Get Started</span>
              <Sparkles className="w-5 h-5 ml-3 opacity-70" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;