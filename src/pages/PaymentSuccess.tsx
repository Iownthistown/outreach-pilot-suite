import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOnboarding } from "@/hooks/useOnboarding";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { currentStep } = useOnboarding();
  
  const isInOnboarding = currentStep < 4; // 4 total steps in onboarding

  useEffect(() => {
    // Optional: Track successful payment in analytics
    console.log("Payment successful - user landed on success page");
  }, []);

  const handleNextStep = () => {
    if (isInOnboarding) {
      navigate("/onboarding");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full p-8 text-center bg-card border border-primary/20 shadow-xl">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-success" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Payment Successful!
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Welcome to Costras! Your account is activated and you can now use all premium features.
        </p>

        {/* Features Preview */}
        <div className="bg-background/50 rounded-lg p-6 mb-8 text-left">
          <h3 className="text-lg font-semibold text-foreground mb-4">You now have access to:</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-foreground">AI-powered Twitter automation</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-foreground">Automatic replies and likes</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-foreground">Advanced analytics</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-foreground">Priority support</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="hero" 
            size="lg"
            onClick={handleNextStep}
            className="flex items-center gap-2"
          >
            {isInOnboarding ? "Continue Setup" : "Go to Dashboard"}
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-primary/20">
          <p className="text-sm text-muted-foreground">
            You will receive a confirmation email with your subscription details within a few minutes.
            <br />
            Have questions? Contact us at support@costras.com
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;