import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { 
  Crown,
  Zap,
  Calendar,
  CreditCard,
  Check,
  Sparkles,
  ArrowRight,
  Settings,
  ExternalLink
} from "lucide-react";

const DashboardPlan = () => {
  const { user } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { toast } = useToast();
  const [isManagingBilling, setIsManagingBilling] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load real billing data
  useEffect(() => {
    const loadBillingData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Load billing history
        const { data: billingData, error: billingError } = await supabase
          .from('billing_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (billingError) {
          console.error('Error loading billing history:', billingError);
        } else {
          setBillingHistory(billingData || []);
        }

        // Load user payment info - eerst proberen uit users tabel, dan fallback
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('payment_method_brand, payment_method_last4')
          .eq('id', user.id)
          .maybeSingle(); // gebruik maybeSingle() om geen error te krijgen bij 0 rows

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error loading user data:', userError);
        } else {
          setPaymentInfo(userData);
        }
      } catch (error) {
        console.error('Error loading billing data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBillingData();
  }, [user]);

  // Handle Stripe Customer Portal redirect
  const handleManageBilling = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to manage your billing.",
        variant: "destructive",
      });
      return;
    }

    setIsManagingBilling(true);
    
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('No access token available');
      }

      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          return_url: `${window.location.origin}/dashboard/plan`
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to create portal session');
      }
      
      if (data?.url) {
        // Redirect to Stripe Customer Portal
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL received');
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      toast({
        title: "Error",
        description: "Failed to open billing management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsManagingBilling(false);
    }
  };

  // Handle plan upgrade
  const handleUpgrade = async (planType: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    setIsUpgrading(planType);
    
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('No access token available');
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          plan_type: planType
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }
      
      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(null);
    }
  };

  // Get current plan info from subscription
  const getCurrentPlan = () => {
    if (!subscription) {
      return {
        name: "Free Plan",
        price: "$0/month",
        features: ["Limited access"],
        actionsUsed: 0,
        actionsLimit: 10,
        validUntil: "No expiration",
        planType: "Free"
      };
    }

    // Map subscription plan_type to plan names
    const planType = (subscription as any).plan_type || "free";
    let planName, price, features, actionsLimit;
    
    switch (planType.toLowerCase()) {
      case "starter":
        planName = "Starter";
        price = "$29/month";
        features = ["1 account", "30 replies per day", "Auto likes", "Support"];
        actionsLimit = 30;
        break;
      case "pro":
        planName = "Pro";
        price = "$99/month";
        features = ["1 account", "70 replies per day", "Auto likes", "Priority support"];
        actionsLimit = 70;
        break;
      default:
        planName = "Free Plan";
        price = "$0/month";
        features = ["Limited access"];
        actionsLimit = 10;
    }
    
    return {
      name: planName,
      price: price,
      features: features,
      actionsUsed: 34, // This would come from your bot statistics
      actionsLimit: actionsLimit,
      validUntil: (subscription as any).current_period_end ? new Date((subscription as any).current_period_end).toLocaleDateString() : "Unknown",
      planType: planType
    };
  };

  const currentPlan = getCurrentPlan();

  // Helper functions to determine plan status
  const isCurrentPlan = (planName: string) => {
    return currentPlan.name.toLowerCase() === planName.toLowerCase();
  };

  const shouldShowDowngrade = (planName: string) => {
    const currentLevel = getPlanLevel(currentPlan.name);
    const targetLevel = getPlanLevel(planName);
    return currentLevel > targetLevel;
  };

  const getPlanLevel = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "starter": return 1;
      case "pro": return 2;
      default: return 0; // Free plan
    }
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
        "Support"
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

  // Format billing history for display
  const formatBillingHistory = (history) => {
    return history.map(bill => ({
      date: new Date(bill.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      amount: `$${(bill.amount / 100).toFixed(2)}`,
      status: bill.status === 'paid' ? 'Paid' : bill.status
    }));
  };

  const formattedBillingHistory = formatBillingHistory(billingHistory);

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
                  disabled={plan.name === "Custom" || isCurrentPlan(plan.name) || isUpgrading === plan.name.toLowerCase()}
                  onClick={() => {
                    if (!isCurrentPlan(plan.name) && plan.name !== "Custom") {
                      handleUpgrade(plan.name.toLowerCase());
                    }
                  }}
                >
                  {plan.name === "Custom" ? "Coming Soon" : 
                   isCurrentPlan(plan.name) ? "Current Plan" : 
                   isUpgrading === plan.name.toLowerCase() ? "Processing..." :
                   shouldShowDowngrade(plan.name) ? "Downgrade" : "Upgrade"}
                  {plan.name !== "Custom" && !isCurrentPlan(plan.name) && isUpgrading !== plan.name.toLowerCase() && <ArrowRight className="w-4 h-4 ml-2" />}
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
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : formattedBillingHistory.length > 0 ? (
              <div className="space-y-3">
                {formattedBillingHistory.map((bill, index) => (
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
            ) : (
              <p className="text-sm text-muted-foreground">No billing history found.</p>
            )}
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Payment Information</h3>
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-12 bg-muted rounded-lg"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              ) : paymentInfo?.payment_method_last4 ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        •••• •••• •••• {paymentInfo.payment_method_last4}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {paymentInfo.payment_method_brand || 'Card'}
                      </p>
                    </div>
                  </div>
                  
                  {(subscription as any)?.current_period_end && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          Next billing date: {new Date((subscription as any).current_period_end).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No payment method on file.</p>
              )}

              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleManageBilling}
                disabled={isManagingBilling}
              >
                <Settings className="w-4 h-4 mr-2" />
                {isManagingBilling ? "Opening..." : "Manage Billing"}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPlan;