import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "1 account",
        "30 replies per day",
        "Auto likes",
        "Basic analytics",
        "Email support"
      ],
      additionalCredits: "",
      popular: false
    },
    {
      name: "Pro",
      price: "$99",
      period: "/month",
      description: "Most popular choice",
      features: [
        "1 account",
        "70 replies per day",
        "Auto likes",
        "Advanced analytics",
        "Priority support"
      ],
      additionalCredits: "",
      popular: true
    },
    {
      name: "Custom",
      price: "Coming Soon",
      period: "",
      description: "Enterprise solutions",
      features: [
        "Custom account limits",
        "Unlimited replies",
        "Premium features",
        "Dedicated support",
        "Custom integrations"
      ],
      additionalCredits: "",
      popular: false
    }
  ];

  const paymentLinks = {
    Starter: "https://buy.stripe.com/28E7sMgAoaRJ6rAczd8AE00",
    Pro: "https://buy.stripe.com/28EdRa4RG8JB2bk6aP8AE01",
  };

  const handleGetStarted = (planName: string) => {
    if (planName === "Custom") return;
    // Redirect to signup page - users need an account to purchase
    navigate("/signup");
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that's right for your business. All plans include our core features to help you grow your online presence.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="flex justify-center">
          <div className="grid lg:grid-cols-3 gap-8 mb-12 max-w-5xl">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-card border rounded-2xl p-8 shadow-card backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group ${plan.popular ? 'border-primary scale-105 hover:scale-110' : 'border-primary/20 hover:border-primary/40'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
                {plan.additionalCredits && <p className="text-sm text-muted-foreground mt-2">Additional Credits: {plan.additionalCredits}</p>}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? "hero" : "outline"} 
                className="w-full"
                onClick={() => handleGetStarted(plan.name)}
                disabled={plan.name === "Custom"}
              >
                {plan.name === "Custom" ? "Coming Soon" : "Get Started"}
              </Button>
            </div>
          ))}
          </div>
        </div>

        {/* Free Trial CTA */}
        <div className="text-center bg-card border border-primary/20 rounded-2xl p-8 shadow-card backdrop-blur-sm max-w-2xl mx-auto transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/40 cursor-pointer">
          <h3 className="text-2xl font-bold text-foreground mb-4">Start Your Journey</h3>
          <p className="text-muted-foreground mb-6">
            Experience how COSTRAS can revolutionize your Twitter/X strategy with our starter plan.
          </p>
          <Button variant="hero" size="lg" onClick={() => handleGetStarted("Starter")}>
            Begin with Starter Plan
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;