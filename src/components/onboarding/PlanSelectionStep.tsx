import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCircle } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface PlanSelectionStepProps {
  onNext: () => void;
  loading?: boolean;
}

const PlanSelectionStep = ({
  onNext,
  loading = false
}: PlanSelectionStepProps) => {
  const {
    subscription,
    planType,
    hasPlan,
    isTrial
  } = useSubscription();

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for getting started",
      features: ["1 account", "30 replies per day", "Auto likes", "Support"],
      popular: false,
      hasFreeTrial: true
    },
    {
      name: "Pro",
      price: "$99",
      period: "/month",
      description: "Most popular choice",
      features: ["1 account", "100 replies per day", "Auto likes", "Priority support"],
      popular: true,
      hasFreeTrial: true
    },
    {
      name: "Custom",
      price: "Coming Soon",
      period: "",
      description: "Enterprise solutions",
      features: ["Custom account limits", "Unlimited replies", "Premium features", "Dedicated support", "Custom integrations"],
      popular: false,
      hasFreeTrial: false
    }
  ];

  const paymentLinks = {
    Starter: "https://buy.stripe.com/28E7sMgAoaRJ6rAczd8AE00",
    Pro: "https://buy.stripe.com/28EdRa4RG8JB2bk6aP8AE01"
  };

  const handlePlanSelect = (planName: string) => {
    if (planName === "Custom") return;
    const paymentLink = paymentLinks[planName as keyof typeof paymentLinks];
    if (paymentLink) {
      window.open(paymentLink, '_blank');
    }
  };

  // Check if user should see "Free Trial" text (only if they haven't taken a trial yet)
  const showFreeTrial = !isTrial && !hasPlan;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed Height */}
      <div className="flex-shrink-0 text-center py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {hasPlan ? `Your ${planType} Plan${isTrial ? ' (Trial)' : ''}` : "Choose Your Plan"}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          {hasPlan ? "Continue with setup" : "Choose the plan that's right for your business. All plans include our core features."}
        </p>
      </div>

      {/* Plans Grid - Takes remaining space */}
      <div className="flex-1 min-h-0 overflow-auto px-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto pb-4">
          {plans.map((plan) => {
            const isPlanPurchased = hasPlan && planType?.toLowerCase() === plan.name.toLowerCase();
            const isDisabled = hasPlan && !isPlanPurchased;
            
            return (
              <div
                key={plan.name}
                className={`relative bg-card border rounded-2xl p-6 sm:p-8 shadow-card backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
                  isPlanPurchased 
                    ? 'border-green-500 ring-2 ring-green-500/20' 
                    : plan.popular 
                      ? 'border-primary scale-[1.02] hover:scale-105' 
                      : 'border-primary/20 hover:border-primary/40 hover:scale-[1.02]'
                } ${isDisabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
              >
                {/* Purchased Badge */}
                {isPlanPurchased && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      Purchased
                    </span>
                  </div>
                )}

                {/* Popular Badge */}
                {plan.popular && !isPlanPurchased && !hasPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                  
                  {/* Free Trial Badge - only show if user hasn't taken a trial */}
                  {plan.hasFreeTrial && showFreeTrial && (
                    <Badge variant="secondary" className="mt-3 bg-success/10 text-success border-success/20">
                      Free Trial Available
                    </Badge>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant={isPlanPurchased ? "secondary" : plan.popular ? "hero" : "outline"}
                  className="w-full"
                  onClick={() => {
                    if (isPlanPurchased) {
                      onNext();
                      return;
                    }
                    handlePlanSelect(plan.name);
                  }}
                  disabled={loading || plan.name === "Custom" || isDisabled}
                >
                  {isPlanPurchased 
                    ? "Continue" 
                    : plan.name === "Custom" 
                      ? "Coming Soon" 
                      : showFreeTrial && plan.hasFreeTrial 
                        ? "Start Free Trial" 
                        : "Get Started"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer - Fixed Height */}
      <div className="flex-shrink-0 py-4 flex items-center justify-center">
        {!hasPlan && (
          <Button 
            variant="ghost" 
            onClick={onNext} 
            disabled={loading} 
            className="text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Button>
        )}
        
        {hasPlan && (
          <Button onClick={onNext} disabled={loading} className="w-full max-w-sm">
            Continue Setup
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlanSelectionStep;
