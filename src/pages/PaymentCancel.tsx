import { useNavigate } from "react-router-dom";
import { X, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOnboarding } from "@/hooks/useOnboarding";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const { currentStep } = useOnboarding();
  
  const isInOnboarding = currentStep < 4; // 4 total steps in onboarding

  const handleRetryPayment = () => {
    if (isInOnboarding) {
      navigate("/onboarding");
    } else {
      navigate("/pricing");
    }
  };

  const handleGoHome = () => {
    if (isInOnboarding) {
      navigate("/onboarding");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full p-8 text-center bg-card border border-primary/20 shadow-xl">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <X className="w-10 h-10 text-destructive" />
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Payment Cancelled
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your payment has been cancelled. Don't worry, nothing has been charged.
        </p>

        {/* Why Costras */}
        <div className="bg-background/50 rounded-lg p-6 mb-8 text-left">
          <h3 className="text-lg font-semibold text-foreground mb-4">Why choose Costras?</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Boost your Twitter engagement with AI</span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Intelligently automate replies and likes</span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">7-day free trial</span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Cancel anytime, no hidden costs</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="hero" 
            size="lg"
            onClick={handleRetryPayment}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {isInOnboarding ? "Continue Setup" : "Try Again"}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleGoHome}
          >
            {isInOnboarding ? "Back to Setup" : "Back to Home"}
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-primary/20">
          <p className="text-sm text-muted-foreground">
            Have questions about our pricing or features?
            <br />
            Contact us at support@costras.com
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentCancel;