import { useState, useEffect, useCallback } from 'react';
import { apiService, DashboardStatus, AnalyticsData, handleApiError, listenForChromeExtension } from '@/lib/apiService';
import { useToast } from '@/hooks/use-toast';
import { useExtensionStatus } from '@/hooks/useExtensionStatus';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [botActionLoading, setBotActionLoading] = useState(false);
  const { toast } = useToast();
  const { extensionStatus } = useExtensionStatus();

  // Fetch real analytics data from API
  const fetchDashboardData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      // Try to get real analytics data first
      const analyticsData = await apiService.getAnalyticsData();
      
      // Transform analytics data to dashboard format
      const transformedData: DashboardStatus = {
        bot_status: analyticsData.bot_performance.status,
        last_action: analyticsData.recent_actions?.[0]?.timestamp 
          ? formatTimeAgo(analyticsData.recent_actions[0].timestamp) 
          : 'Never',
        uptime: analyticsData.bot_performance.uptime,
        stats: {
          actions_today: analyticsData.bot_performance.actions_today,
          new_followers: analyticsData.engagement_metrics.follower_growth,
          engagement_rate: parseInt(analyticsData.engagement_metrics.engagement_rate.replace('%', '')),
          errors: analyticsData.bot_performance.errors,
          actions_trend: analyticsData.trends.actions_trend,
          followers_trend: analyticsData.engagement_metrics.follower_growth_rate,
          engagement_trend: analyticsData.engagement_metrics.engagement_trend,
        },
        recent_activity: analyticsData.recent_actions.map((action, index) => ({
          id: index + 1,
          type: action.action,
          message: `Bot ${action.action}${action.action === 'reply' ? 'ied to' : action.action === 'like' ? 'd tweet from' : action.action === 'view' ? 'ed profile' : 'ed'} ${action.target}`,
          time: formatTimeAgo(action.timestamp),
          user: action.target,
          timestamp: action.timestamp,
          target: action.target,
          tweet_content: action.tweet_content,
          reply_content: action.reply_content,
          status: action.status,
          icon: action.icon,
          // Remove ai_service from display
        })),
        twitter_connected: true, // Assume connected if we get data
        plan: 'Pro', // Default plan
        daily_limit: 100,
        actions_used: analyticsData.bot_performance.actions_today,
      };

      setDashboardData(transformedData);
      setError(null);
    } catch (err: any) {
      // Only show error for unexpected issues, not API unavailability
      if (err.name !== 'TypeError' && !err.message.includes('Failed to fetch')) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      } else {
        setError(null); // Clear any previous errors
        console.info('External API unavailable, using fallback data');
      }
      
      // Use fallback data when API fails
      setDashboardData(getFallbackData());
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [toast]);

  // Helper function to format timestamp to relative time
  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Start bot
  const startBot = useCallback(async () => {
    setBotActionLoading(true);
    try {
      const response = await apiService.startBot();
      if (response.success) {
        toast({
          title: "Bot Started",
          description: "Your bot is now working!",
        });
        // Refresh dashboard data
        await fetchDashboardData(false);
      } else {
        throw new Error(response.message || 'Failed to start bot');
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      toast({
        title: "Failed to start bot",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setBotActionLoading(false);
    }
  }, [fetchDashboardData, toast]);

  // Stop bot
  const stopBot = useCallback(async () => {
    setBotActionLoading(true);
    try {
      const response = await apiService.stopBot();
      if (response.success) {
        toast({
          title: "Bot Paused",
          description: "Your bot is now sleeping",
        });
        // Refresh dashboard data
        await fetchDashboardData(false);
      } else {
        throw new Error(response.message || 'Failed to stop bot');
      }
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      toast({
        title: "Failed to pause bot",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setBotActionLoading(false);
    }
  }, [fetchDashboardData, toast]);

  // Set up real-time polling
  useEffect(() => {
    fetchDashboardData();

    // Poll every 30 seconds for status updates
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 30000);

    // Listen for Chrome extension events
    listenForChromeExtension();

    // Listen for manual refresh events
    const handleRefresh = () => fetchDashboardData(false);
    window.addEventListener('dashboardRefresh', handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('dashboardRefresh', handleRefresh);
    };
  }, [fetchDashboardData]);

  return {
    dashboardData,
    loading,
    error,
    botActionLoading,
    extensionStatus,
    startBot,
    stopBot,
    refetch: () => fetchDashboardData(),
  };
};

// Empty state data for when API is not available or bot is stopped
const getFallbackData = (): DashboardStatus => ({
  bot_status: 'stopped',
  last_action: 'Never',
  uptime: '0%',
  stats: {
    actions_today: 0,
    new_followers: 0,
    engagement_rate: 0,
    errors: 0,
    actions_trend: '',
    followers_trend: '',
    engagement_trend: '',
  },
  recent_activity: [],
  twitter_connected: false,
  plan: 'Free',
  daily_limit: 10,
  actions_used: 0,
});