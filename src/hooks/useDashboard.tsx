import { useState, useEffect, useCallback } from 'react';
import { apiService, DashboardStatus, handleApiError, listenForChromeExtension } from '@/lib/apiService';
import { useToast } from '@/hooks/use-toast';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [botActionLoading, setBotActionLoading] = useState(false);
  const { toast } = useToast();

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const data = await apiService.getDashboardStatus();
      setDashboardData(data);
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      
      // Show fallback toast for serious errors
      if (errorMessage.includes('Network') || errorMessage.includes('CORS')) {
        toast({
          title: "API Connection Error",
          description: "Using demo data. Check backend connection.",
          variant: "destructive",
        });
        
        // Use fallback data
        setDashboardData(getFallbackData());
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [toast]);

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
      type: 'like',
      message: 'Bot liked tweet from @johndoe',
      time: '2 minutes ago',
      user: '@johndoe',
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      type: 'follow',
      message: 'Bot followed @sarahtech',
      time: '5 minutes ago',
      user: '@sarahtech',
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      type: 'reply',
      message: 'Bot replied to @techstartup',
      time: '15 minutes ago',
      user: '@techstartup',
      timestamp: new Date().toISOString(),
    },
  ],
  twitter_connected: true,
  plan: 'Pro',
  daily_limit: 70,
  actions_used: 34,
});