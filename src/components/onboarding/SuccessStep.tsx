import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight, Twitter, Chrome } from "lucide-react";
import { useEffect } from "react";
import { triggerConfetti } from "@/components/ui/confetti";

interface SuccessStepProps {
  onComplete: () => void;
}

const SuccessStep = ({ onComplete }: SuccessStepProps) => {
  useEffect(() => {
    // Trigger confetti animation on mount
    const timer = setTimeout(() => {
      triggerConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#26ccff', '#a25afd', '#ff5722', '#4caf50', '#ffeb3b']
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center space-y-8">
      {/* Success Icon with Animation */}
      <div className="space-y-4">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
          <div className="relative w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center border-4 border-green-200 dark:border-green-800">
            <CheckCircle className="w-12 h-12 text-green-600 animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground animate-fade-in">
            🎉 You're All Set!
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Your COSTRAS account is ready! You can now start creating AI-powered Twitter replies that will boost your engagement and grow your audience.
          </p>
        </div>
      </div>

      {/* Success Summary with Animation */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800 animate-fade-in">
        <h3 className="font-semibold text-foreground mb-4 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
          Successfully Connected:
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-green-200/50 dark:border-green-800/50">
            <div className="w-10 h-10 bg-[#1DA1F2]/10 rounded-lg flex items-center justify-center">
              <Twitter className="w-5 h-5 text-[#1DA1F2]" />
            </div>
            <div className="text-left flex-1">
              <h4 className="font-medium text-foreground">Twitter Account</h4>
              <p className="text-sm text-muted-foreground">Ready for AI-powered replies</p>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-600 animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Connected</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-green-200/50 dark:border-green-800/50">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg flex items-center justify-center">
              <Chrome className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left flex-1">
              <h4 className="font-medium text-foreground">Chrome Extension</h4>
              <p className="text-sm text-muted-foreground">Installed and ready to use</p>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-600 animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps with Enhanced Design */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-foreground mb-4 flex items-center justify-center">
          <ArrowRight className="w-5 h-5 text-blue-600 mr-2" />
          What's Next:
        </h3>
        <div className="space-y-4 text-sm">
          <div className="flex items-start space-x-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
            <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</span>
            <div className="text-left">
              <h4 className="font-medium text-foreground">Access Your Dashboard</h4>
              <p className="text-muted-foreground">Configure your AI bot settings and preferences</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
            <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</span>
            <div className="text-left">
              <h4 className="font-medium text-foreground">Customize AI Settings</h4>
              <p className="text-muted-foreground">Set engagement rules and response preferences</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
            <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</span>
            <div className="text-left">
              <h4 className="font-medium text-foreground">Start Creating</h4>
              <p className="text-muted-foreground">Begin generating intelligent Twitter replies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA */}
      <div className="space-y-4">
        <Button
          onClick={onComplete}
          size="lg"
          className="w-full md:w-auto px-10 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Go to Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <p className="text-xs text-muted-foreground animate-fade-in">
          🚀 Ready to boost your Twitter engagement with AI
        </p>
      </div>
    </div>
  );
};

export default SuccessStep;