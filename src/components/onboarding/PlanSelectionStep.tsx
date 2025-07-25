import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Star, Crown } from "lucide-react";

interface PlanSelectionStepProps {
  onNext: () => void;
  loading?: boolean;
}

const PlanSelectionStep = ({ onNext, loading = false }: PlanSelectionStepProps) => {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for individuals getting started",
      features: [
        "Up to 100 automated actions per day",
        "Basic Twitter automation",
        "Email support",
        "Chrome extension access"
      ],
      icon: Zap,
      popular: false
    },
    {
      name: "Pro",
      price: "$79",
      period: "/month", 
      description: "Best for growing businesses and creators",
      features: [
        "Up to 500 automated actions per day",
        "Advanced automation features",
        "Priority support",
        "Analytics and insights",
        "Custom automation rules"
      ],
      icon: Star,
      popular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large teams and agencies",
      features: [
        "Unlimited automated actions",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics",
        "Team management"
      ],
      icon: Crown,
      popular: false
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground text-lg">
          Select the plan that best fits your needs. You can upgrade or downgrade anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-base font-normal text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={onNext}
                  disabled={loading}
                >
                  {plan.popular ? "Get Started" : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button variant="ghost" onClick={onNext} disabled={loading} className="text-muted-foreground">
          Skip for now - I'll choose later
        </Button>
      </div>
    </div>
  );
};

export default PlanSelectionStep;