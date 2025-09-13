import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Zap, Chrome, Twitter, BarChart3 } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
  loading?: boolean;
}

const WelcomeStep = ({ onNext, loading = false }: WelcomeStepProps) => {
  return (
    <div className="h-full flex flex-col text-center overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Header - Compact and Elegant */}
      <div className="flex-shrink-0 h-20 sm:h-24 flex flex-col justify-center relative z-10 pt-3">
        <div className="flex justify-center mb-2">
          <div className="relative group">
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-border/20 shadow-xl transition-all duration-300 group-hover:scale-105">
              <img 
                src="/lovable-uploads/1b627097-cca7-4da0-9dfb-92968194dc92.png" 
                alt="COSTRAS Logo" 
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain filter brightness-110"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
            Welcome to COSTRAS
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            AI-powered Twitter automation platform
          </p>
        </div>
      </div>

      {/* Main Content - Compact Status Steps */}
      <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden relative z-10">
        <div className="max-w-sm mx-auto px-4">
          <div className="space-y-3">
            {/* Account Created - Completed */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200/50 dark:border-green-800/30 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-green-900 dark:text-green-100">Account created</span>
                <p className="text-xs text-green-700 dark:text-green-300">✓ Ready to proceed</p>
              </div>
            </div>
            
            {/* Choose Plan - Next */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200/50 dark:border-blue-800/30 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                2
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Choose your plan</span>
                <p className="text-xs text-blue-700 dark:text-blue-300">Select pricing tier</p>
              </div>
            </div>
            
            {/* Install Extension & Connect - Combined */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-200/50 dark:border-purple-800/30 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <div className="flex">
                  <Chrome className="w-2 h-2 text-white" />
                  <Twitter className="w-2 h-2 text-white ml-0.5" />
                </div>
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Install & connect</span>
                <p className="text-xs text-purple-700 dark:text-purple-300">Extension + Twitter setup</p>
              </div>
            </div>
            
            {/* Account Analysis */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200/50 dark:border-orange-800/30 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-orange-900 dark:text-orange-100">AI account analysis</span>
                <p className="text-xs text-orange-700 dark:text-orange-300">Optimize automation settings</p>
              </div>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Zap className="w-3 h-3 text-primary" />
              <span>4 simple steps • Step 1 of 4 complete</span>
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