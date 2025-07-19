import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";

interface SuccessStepProps {
  onComplete: () => void;
}

const SuccessStep = ({ onComplete }: SuccessStepProps) => {
  return (
    <div className="text-center space-y-8">
      {/* Success Animation */}
      <div className="relative">
        <div className="mx-auto w-24 h-24 bg-success/10 rounded-full flex items-center justify-center animate-scale-in">
          <CheckCircle className="w-12 h-12 text-success animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-8 h-8 text-primary animate-glow" />
        </div>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Account Connected! 🎉
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Congratulations! Your Twitter account and Chrome extension are now connected. You're all set to start creating amazing AI-powered replies.
        </p>
      </div>

      {/* Success Summary */}
      <div className="bg-success/5 border border-success/20 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-success flex items-center justify-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Setup Complete
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Twitter Account</span>
            <span className="text-success font-medium">✓ Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Chrome Extension</span>
            <span className="text-success font-medium">✓ Installed</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">AI Replies</span>
            <span className="text-success font-medium">✓ Ready</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-card/50 rounded-xl p-6 border border-border/50">
        <h3 className="font-semibold text-foreground mb-4">What's Next?</h3>
        <div className="space-y-3 text-sm text-left">
          <div className="flex items-start space-x-3">
            <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs">1</span>
            <span className="text-muted-foreground">Explore your dashboard to see analytics and settings</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs">2</span>
            <span className="text-muted-foreground">Start engaging with tweets to see AI suggestions</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs">3</span>
            <span className="text-muted-foreground">Watch your engagement grow automatically</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button
        onClick={onComplete}
        size="lg"
        className="w-full md:w-auto px-8 py-3 text-lg font-semibold"
      >
        Go to Dashboard
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

export default SuccessStep;