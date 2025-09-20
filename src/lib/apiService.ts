import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = 'https://api.costras.com';

export interface TwitterUserInfo {
  handle: string;
  display_name: string;
  profile_image_url: string;
  connected_at: string;
  last_sync: string;
  is_connected: boolean;
}

export interface DashboardStatus {
  bot_status: 'running' | 'stopped' | 'error';
  last_action: string;
  uptime: number | string;
  stats: {
    actions_today: number;
    new_followers: number;
    engagement_rate: number;
    errors: number;
    actions_trend: string;
    followers_trend: string;
    engagement_trend: string;
  };
  recent_activity: Array<{
    id: number;
    type: 'like' | 'follow' | 'reply' | 'view';
    message: string;
    time: string;
    user?: string;
    timestamp: string;
    target?: string;
    tweet_content?: string;
    reply_content?: string;
    status: 'success' | 'failed' | 'pending';
    icon?: string;
    ai_service?: string;
  }>;
  twitter_connected: boolean;
  plan: string;
  daily_limit: number;
  actions_used: number;
}

export interface AnalyticsData {
  bot_performance: {
    status: 'running' | 'stopped' | 'error';
    uptime: string;
    actions_today: number;
    success_rate: string;
    avg_response_time: string;
    errors: number;
  };
  engagement_metrics: {
    engagement_rate: string;
    follower_growth: number;
    follower_growth_rate: string;
    actions_trend: string;
    engagement_trend: string;
  };
  recent_actions: Array<{
    action: 'like' | 'follow' | 'reply' | 'view';
    target: string;
    tweet_content: string;
    reply_content?: string;
    timestamp: string;
    status: 'success' | 'failed' | 'pending';
    icon: string;
    ai_service?: string;
  }>;
  trends: {
    actions_trend: string;
    success_rate_trend: string;
    best_hour: string;
  };
  insights: {
    recommendation: string;
    warning?: string;
  };
}

export interface BotStartResponse {
  success: boolean;
  message: string;
  bot_status: string;
}

class ApiService {
  private async getUserId(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    return session.user.id;
  }

  private async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || session?.user?.id || '';
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`API Error: ${response.status} ${response.statusText} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async getDashboardStatus(): Promise<DashboardStatus> {
    const userId = await this.getUserId();
    return this.makeRequest<DashboardStatus>(`/analytics/dashboard/${userId}`);
  }

  async getAnalyticsData(): Promise<AnalyticsData> {
    const userId = await this.getUserId();
    return this.makeRequest<AnalyticsData>(`/analytics/dashboard/${userId}`);
  }

  async getRecentActions(): Promise<any[]> {
    const userId = await this.getUserId();
    return this.makeRequest<any[]>(`/analytics/actions/${userId}`);
  }

  async getPerformanceMetrics(): Promise<any> {
    const userId = await this.getUserId();
    return this.makeRequest<any>(`/analytics/performance/${userId}`);
  }

  async startBot(): Promise<BotStartResponse> {
    const userId = await this.getUserId();
    return this.makeRequest<BotStartResponse>('/bots/start', {
      method: 'POST',
      body: JSON.stringify({
        config: { 
          user_id: userId,
          max_actions_per_hour: 15,
          follow_limit: 5
        }
      }),
    });
  }

  async stopBot(): Promise<BotStartResponse> {
    const userId = await this.getUserId();
    return this.makeRequest<BotStartResponse>('/bots/stop', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId
      }),
    });
  }

  async getTwitterUserInfo(): Promise<TwitterUserInfo> {
    const userId = await this.getUserId();
    return this.makeRequest<TwitterUserInfo>(`/twitter/user-info/${userId}`);
  }

  async connectTwitter(authToken: string, ct0Token: string): Promise<TwitterUserInfo> {
    const userId = await this.getUserId();
    return this.makeRequest<TwitterUserInfo>('/twitter/connect', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        auth_token: authToken,
        ct0_token: ct0Token
      }),
    });
  }

  async disconnectTwitter(): Promise<{ success: boolean; message: string }> {
    const userId = await this.getUserId();
    return this.makeRequest<{ success: boolean; message: string }>('/twitter/disconnect', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId
      }),
    });
  }
}

export const apiService = new ApiService();

// Chrome Extension Integration
export const listenForChromeExtension = () => {
  window.addEventListener('costrasTwitterConnected', (event: any) => {
    console.log('Twitter connected via Chrome extension:', event.detail);
    // This will trigger a dashboard refresh
    window.dispatchEvent(new CustomEvent('dashboardRefresh'));
  });
};

// Utility function to handle API errors gracefully
export const handleApiError = (error: any): string => {
  if (error.message?.includes('CORS')) {
    return 'CORS Error: Please check API configuration';
  }
  if (error.message?.includes('Network')) {
    return 'Network Error: Unable to reach API server';
  }
  if (error.message?.includes('401')) {
    return 'Authorization Error: Invalid credentials';
  }
  if (error.message?.includes('404')) {
    return 'API Endpoint not found';
  }
  return error.message || 'Unknown API error occurred';
};