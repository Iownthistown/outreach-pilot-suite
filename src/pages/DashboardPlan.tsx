import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown,
  Zap,
  Calendar,
  CreditCard,
  Check,
  Sparkles,
  ArrowRight
} from "lucide-react";

const DashboardPlan = () => {
  // Mock data - replace with real API data
  const currentPlan = {
    name: "Pro Plan",
    price: "$99/month",
    features: ["1 account", "70 replies per day", "Auto likes", "Advanced analytics", "Priority support"],
    actionsUsed: 34,
    actionsLimit: 70,
    validUntil: "December 31, 2024"
  };

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
      popular: false
    }
  ];

  const billingHistory = [
    { date: "Nov 1, 2024", amount: "$99.00", status: "Paid" },
    { date: "Oct 1, 2024", amount: "$99.00", status: "Paid" },
    { date: "Sep 1, 2024", amount: "$99.00", status: "Paid" }
  ];

  const usagePercentage = (currentPlan.actionsUsed / currentPlan.actionsLimit) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscription Plan</h1>
          <p className="text-muted-foreground">Manage your plan and billing settings</p>
        </div>

        {/* Current Plan */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-full">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{currentPlan.name}</h2>
                <p className="text-lg text-primary font-semibold">{currentPlan.price}</p>
              </div>
            </div>
            <Badge variant="default" className="bg-success text-success-foreground">
              Active
            </Badge>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Daily Actions Used</span>
              <span className="text-sm text-muted-foreground">
                {currentPlan.actionsUsed}/{currentPlan.actionsLimit}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Active until {currentPlan.validUntil}
            </p>
          </div>
        </Card>

        {/* Upgrade Plans */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  plan.popular ? 'border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  disabled={plan.name === "Custom"}
                >
                  {plan.name === "Custom" ? "Coming Soon" : plan.name === "Pro" ? "Current Plan" : "Upgrade"}
                  {plan.name !== "Custom" && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Billing History */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Billing History</h3>
            <div className="space-y-3">
              {billingHistory.map((bill, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{bill.date}</p>
                    <p className="text-xs text-muted-foreground">Monthly subscription</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{bill.amount}</p>
                    <Badge variant="secondary" className="text-xs">
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Payment Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Next billing date: December 1, 2024</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Update Payment Method
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPlan;