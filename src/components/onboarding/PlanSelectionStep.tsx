import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Star, Crown, CheckCircle } from "lucide-react";
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
  const plans = [{
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for getting started",
    features: ["1 account", "30 replies per day", "Auto likes", "Support"],
    icon: Zap,
    popular: false
  }, {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "Most popular choice",
    features: ["1 account", "100 replies per day", "Auto likes", "Priority support"],
    icon: Star,
    popular: true
  }, {
    name: "Custom",
    price: "Coming Soon",
    period: "",
    description: "Enterprise solutions for large teams",
    features: ["Unlimited automated actions", "White-label solution", "Dedicated account manager", "Custom integrations", "Advanced analytics", "Team management"],
    icon: Crown,
    popular: false
  }];
  return <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed Height */}
      <div className="flex-shrink-0 h-16 text-center flex flex-col justify-center">
        <h1 className="text-lg sm:text-xl font-bold">
          {hasPlan ? `Your ${planType} Plan${isTrial ? ' (Trial)' : ''}` : "Choose Your Plan"}
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm">
          {hasPlan ? "Continue with setup" : "Select the plan that fits your needs"}
        </p>
      </div>

      {/* Plans Grid - Takes remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 h-full">
        {plans.map(plan => {
        const Icon = plan.icon;
        const isPlanPurchased = hasPlan && planType?.toLowerCase() === plan.name.toLowerCase();
        const isDisabled = hasPlan && !isPlanPurchased;
        return <Card key={plan.name} className={`relative h-full ${isPlanPurchased ? 'border-green-500 ring-2 ring-green-500/20 bg-green-50/50' : plan.popular ? 'border-primary ring-2 ring-primary/20' : ''} ${isDisabled ? 'opacity-50' : ''}`}>
              {isPlanPurchased && <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Purchased
                  </span>
                </div>}
              {plan.popular && !isPlanPurchased && !hasPlan && <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-primary text-primary-foreground py-0.5 px-2 rounded-full text-xs font-medium">
                    Popular
                  </span>
                </div>}
              
              <CardHeader className="text-center pb-3">
                <div className="mx-auto mb-2 w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
                <div className="text-xl sm:text-2xl font-bold">
                  {plan.price}
                  <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <CardDescription className="text-xs sm:text-sm">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3 flex flex-col h-full">
                <ul className="space-y-2 flex-1">
                  {plan.features.slice(0, 4).map((feature, index) => <li key={index} className="flex items-start gap-2">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </li>)}
                  {plan.features.length > 4 && (
                    <li className="text-xs text-muted-foreground">
                      +{plan.features.length - 4} more features
                    </li>
                  )}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={isPlanPurchased ? "secondary" : plan.popular ? "default" : "outline"} 
                  size="sm"
                  onClick={() => {
                    if (isPlanPurchased) {
                      onNext();
                      return;
                    }
                    const paymentLinks = {
                      Starter: "https://buy.stripe.com/28E7sMgAoaRJ6rAczd8AE00",
                      Pro: "https://buy.stripe.com/28EdRa4RG8JB2bk6aP8AE01"
                    };
                    const paymentLink = paymentLinks[plan.name as keyof typeof paymentLinks];
                    if (paymentLink) {
                      window.open(paymentLink, '_blank');
                    }
                  }} 
                  disabled={loading || plan.name === "Custom" || isDisabled}
                >
                  {isPlanPurchased ? "Continue" : plan.name === "Custom" ? "Coming Soon" : "Get Started"}
                </Button>
              </CardContent>
            </Card>;
      })}
        </div>
      </div>

      {/* Footer - Fixed Height */}
      <div className="flex-shrink-0 h-16 flex items-center justify-center">
        {!hasPlan && (
          <Button variant="ghost" onClick={onNext} disabled={loading} size="sm" className="text-muted-foreground text-xs">
            Skip for now
          </Button>
        )}
        
        {hasPlan && (
          <Button onClick={onNext} disabled={loading} className="w-full max-w-sm" size="sm">
            Continue Setup
          </Button>
        )}
      </div>
    </div>;
};
export default PlanSelectionStep;