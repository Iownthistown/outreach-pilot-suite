import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Twitter,
  ExternalLink,
  CreditCard,
  Loader2
} from "lucide-react";
import BotStatusCard from "./BotStatusCard";
import SimpleStats from "./SimpleStats";
import RecentActivity from "./RecentActivity";
import { ScrollAnimationWrapper } from "@/hooks/useScrollAnimation";
import { useDashboard } from "@/hooks/useDashboard";

const DashboardOverview = () => {
  const { 
    dashboardData, 
    loading, 
    error, 
    botActionLoading, 
    startBot, 
    stopBot 
  } = useDashboard();

  // Helper function to render connection status
  const renderConnectionStatus = () => {
    if (loading) {
      return (
        <ScrollAnimationWrapper>
          <Card className="p-8 bg-gradient-to-br from-muted/10 to-muted/5 border-muted/20 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Loading Dashboard</h3>
                <p className="text-muted-foreground">
                  Connecting to your account...
                </p>
              </div>
            </div>
          </Card>
        </ScrollAnimationWrapper>
      );
    }

    if (!dashboardData?.twitter_connected) {
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
    if (!dashboardData) return null;
    
    const usagePercentage = (dashboardData.actions_used / dashboardData.daily_limit) * 100;
    
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
                  You've used {dashboardData.actions_used} of {dashboardData.daily_limit} daily actions
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

  const handleBotToggle = async () => {
    if (!dashboardData) return;
    
    if (dashboardData.bot_status === 'running') {
      await stopBot();
    } else {
      await startBot();
    }
  };

  const isConnected = !error || dashboardData !== null;
  const botIsActive = dashboardData?.bot_status === 'running';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <ScrollAnimationWrapper>
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, John!
          </h2>
          <p className="text-muted-foreground flex items-center gap-2">
            Your Twitter bot is {botIsActive ? 'actively working' : 'ready to start'} • 
            {dashboardData?.plan || 'Pro'} Plan
            {!isConnected && (
              <>
                <span className="text-destructive">• API Connection Error</span>
              </>
            )}
          </p>
        </div>
      </ScrollAnimationWrapper>

      {/* API Error Status */}
      {error && (
        <ScrollAnimationWrapper>
          <Card className="p-4 bg-destructive/10 border-destructive/20">
            <div className="flex items-center gap-3 text-destructive">
              <ExternalLink className="w-5 h-5" />
              <div>
                <p className="font-medium">API Connection Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </Card>
        </ScrollAnimationWrapper>
      )}

      {/* Connection Status */}
      {renderConnectionStatus()}

      {/* Daily Limit Warning */}
      {renderDailyLimitStatus()}

      {/* Bot Status Card - Only show if connected */}
      {dashboardData?.twitter_connected && (
        <ScrollAnimationWrapper delay={100}>
          <BotStatusCard 
            isActive={botIsActive}
            lastAction={dashboardData?.last_action}
            uptime={dashboardData?.uptime}
            isLoading={botActionLoading}
            isConnected={isConnected}
            onToggle={handleBotToggle}
          />
        </ScrollAnimationWrapper>
      )}

      {/* Statistics - Only show if connected */}
      {dashboardData?.twitter_connected && (
        <ScrollAnimationWrapper delay={200}>
          <SimpleStats 
            stats={dashboardData?.stats}
            loading={loading}
          />
        </ScrollAnimationWrapper>
      )}

      {/* Recent Activity - Only show if connected and bot is active */}
      {dashboardData?.twitter_connected && (
        <ScrollAnimationWrapper delay={300}>
          <RecentActivity 
            activities={dashboardData?.recent_activity}
            loading={loading}
          />
        </ScrollAnimationWrapper>
      )}

      {/* Support Section */}
      <ScrollAnimationWrapper delay={400}>
        <Card className="p-6 bg-gradient-card border-primary/20 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Need Help?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is here to help you get the most out of your Twitter bot
          </p>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => window.location.href = '/dashboard/support'}
          >
            <ExternalLink className="w-4 h-4" />
            Contact Support
          </Button>
        </Card>
      </ScrollAnimationWrapper>
    </div>
  );
};

export default DashboardOverview;