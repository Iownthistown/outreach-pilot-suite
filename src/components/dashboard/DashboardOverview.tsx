import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Twitter,
  ExternalLink,
  CreditCard
} from "lucide-react";
import BotStatusCard from "./BotStatusCard";
import SimpleStats from "./SimpleStats";
import RecentActivity from "./RecentActivity";
import { ScrollAnimationWrapper } from "@/hooks/useScrollAnimation";

const DashboardOverview = () => {
  // Mock data - replace with real data from your API
  const isTwitterConnected = true; // Check if user has connected Twitter
  const isBotActive = true; // Check bot status
  const currentPlan = "Pro"; // User's current plan
  const dailyLimit = 50;
  const actionsUsed = 24;

  // Helper function to render connection status
  const renderConnectionStatus = () => {
    if (!isTwitterConnected) {
      return (
        <ScrollAnimationWrapper>
          <Card className="p-8 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-warning/20 rounded-full">
                <Twitter className="w-8 h-8 text-warning" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Connect Twitter First</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your Twitter account to start automating your social media presence
                </p>
                <Button variant="cta" className="gap-2">
                  <Twitter className="w-4 h-4" />
                  Connect Twitter Account
                </Button>
              </div>
            </div>
          </Card>
        </ScrollAnimationWrapper>
      );
    }
    return null;
  };

  // Helper function to render daily limit warning
  const renderDailyLimitStatus = () => {
    const usagePercentage = (actionsUsed / dailyLimit) * 100;
    
    if (usagePercentage >= 90) {
      return (
        <ScrollAnimationWrapper>
          <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/20 rounded-full">
                <ExternalLink className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Daily Limit Reached</h3>
                <p className="text-sm text-muted-foreground">
                  You've used {actionsUsed} of {dailyLimit} daily actions
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Upgrade Plan
              </Button>
            </div>
          </Card>
        </ScrollAnimationWrapper>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <ScrollAnimationWrapper>
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h2>
          <p className="text-muted-foreground">
            Your Twitter bot is {isBotActive ? 'actively working' : 'ready to start'} • {currentPlan} Plan
          </p>
        </div>
      </ScrollAnimationWrapper>

      {/* Connection Status */}
      {renderConnectionStatus()}

      {/* Daily Limit Warning */}
      {renderDailyLimitStatus()}

      {/* Bot Status Card - Only show if connected */}
      {isTwitterConnected && (
        <ScrollAnimationWrapper delay={100}>
          <BotStatusCard 
            isActive={isBotActive}
            lastAction="2 minutes ago"
            uptime={7200} // 2 hours in seconds
          />
        </ScrollAnimationWrapper>
      )}

      {/* Statistics - Only show if connected */}
      {isTwitterConnected && (
        <ScrollAnimationWrapper delay={200}>
          <SimpleStats />
        </ScrollAnimationWrapper>
      )}

      {/* Recent Activity - Only show if connected and bot is active */}
      {isTwitterConnected && isBotActive && (
        <ScrollAnimationWrapper delay={300}>
          <RecentActivity />
        </ScrollAnimationWrapper>
      )}

      {/* Support Section */}
      <ScrollAnimationWrapper delay={400}>
        <Card className="p-6 bg-gradient-card border-primary/20 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Need Help?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is here to help you get the most out of your Twitter bot
          </p>
          <Button variant="outline" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Contact Support
          </Button>
        </Card>
      </ScrollAnimationWrapper>
    </div>
  );
};

export default DashboardOverview;