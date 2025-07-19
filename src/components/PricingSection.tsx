import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Lite",
      price: "$29",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Manage 1 project",
        "100 credits per month (~3 replies/day)",
        "Auto-Post on profile",
        "Auto-Reply with your account",
        "User Mention your product",
        "Auto-reply to customer complaints",
        "5 Workflows",
        "Analytics",
        "Email Reports",
        "Support"
      ],
      additionalCredits: "$0.20 each",
      popular: false
    },
    {
      name: "Essential",
      price: "$99",
      period: "/month",
      description: "Most popular choice",
      features: [
        "Manage 1 project",
        "500 credits per month (~17 replies/day)",
        "Auto-Post on profile",
        "Auto-Reply with your account",
        "User Mention your product",
        "Auto-reply to customer complaints",
        "Unlimited Workflows",
        "Analytics",
        "Email Reports",
        "Support"
      ],
      additionalCredits: "$0.20 each",
      popular: true
    },
    {
      name: "Pro",
      price: "$199",
      period: "/month",
      description: "For growing businesses",
      features: [
        "Manage 3 projects",
        "1,500 credits per month (~50 replies/day)",
        "Auto-Post on profile",
        "Auto-Reply with your account",
        "User Mention your product",
        "Auto-reply to customer complaints",
        "Unlimited Workflows",
        "Analytics",
        "Email Reports",
        "Priority Support"
      ],
      additionalCredits: "$0.13 each",
      popular: false
    },
    {
      name: "Agency",
      price: "$499",
      period: "/month",
      description: "For agencies and enterprises",
      features: [
        "Manage 10 projects",
        "5,000 credits per month (~160 replies/day)",
        "Auto-Post on profile",
        "Auto-Reply with your account",
        "User Mention your product",
        "Auto-reply to customer complaints",
        "Unlimited Workflows",
        "Analytics",
        "Email Reports",
        "Priority Support"
      ],
      additionalCredits: "$0.10 each",
      popular: false
    }
  ];

  const handleGetStarted = (planName: string) => {
    navigate("/dashboard");
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
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-card border rounded-2xl p-8 shadow-card backdrop-blur-sm ${plan.popular ? 'border-primary scale-105' : 'border-primary/20'}`}>
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
                <p className="text-sm text-muted-foreground mt-2">Additional Credits: {plan.additionalCredits}</p>
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
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        {/* Free Trial CTA */}
        <div className="text-center bg-card border border-primary/20 rounded-2xl p-8 shadow-card backdrop-blur-sm max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-4">Try It Free</h3>
          <p className="text-muted-foreground mb-6">
            Get 20 free credits to experience how OutreachAI can transform your social marketing.
          </p>
          <Button variant="hero" size="lg" onClick={() => handleGetStarted("Free Trial")}>
            Get Started for Free
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;