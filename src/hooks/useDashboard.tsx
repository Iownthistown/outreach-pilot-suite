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
          ai_service: action.ai_service,
        })),
        twitter_connected: true, // Assume connected if we get data
        plan: 'Pro', // Default plan
        daily_limit: 100,
        actions_used: analyticsData.bot_performance.actions_today,
      };

      setDashboardData(transformedData);
      setError(null);
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      
      console.warn('Using fallback data due to API error:', errorMessage);
      
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

// Fallback data for when API is not available
const getFallbackData = (): DashboardStatus => ({
  bot_status: 'stopped',
  last_action: '2 minutes ago',
  uptime: 7200,
  stats: {
    actions_today: 24,
    new_followers: 12,
    engagement_rate: 78,
    errors: 0,
    actions_trend: '+8 from yesterday',
    followers_trend: '+5 from yesterday',
    engagement_trend: '+3% from yesterday',
  },
  recent_activity: [
    {
      id: 1,
      type: 'like' as const,
      message: 'Bot liked tweet from @johndoe',
      time: '2 minutes ago',
      user: '@johndoe',
      timestamp: new Date().toISOString(),
      target: '@johndoe',
      tweet_content: 'Amazing thread about AI automation tools! This is exactly what I needed for my startup...',
      status: 'success' as const,
      icon: 'heart',
      ai_service: 'llama3_70b',
    },
    {
      id: 2,
      type: 'follow' as const,
      message: 'Bot followed @sarahtech',
      time: '5 minutes ago',
      user: '@sarahtech',
      timestamp: new Date().toISOString(),
      target: '@sarahtech',
      tweet_content: 'Tech entrepreneur sharing insights about SaaS growth and marketing strategies...',
      status: 'success' as const,
      icon: 'user-plus',
    },
    {
      id: 3,
      type: 'reply' as const,
      message: 'Bot replied to @techstartup',
      time: '15 minutes ago',
      user: '@techstartup',
      timestamp: new Date().toISOString(),
      target: '@techstartup',
      tweet_content: 'Looking for feedback on our new product launch. What features matter most to you?',
      reply_content: 'Great question! I think user experience and seamless integration are key factors.',
      status: 'pending' as const,
      icon: 'message-circle',
      ai_service: 'qwen2',
    },
  ],
  twitter_connected: true,
  plan: 'Pro',
  daily_limit: 70,
  actions_used: 34,
});