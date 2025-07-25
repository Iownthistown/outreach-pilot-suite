import { supabase } from '@/lib/supabase';

const API_BASE_URL = 'https://api.costras.com';

export interface DashboardStatus {
  bot_status: 'running' | 'stopped';
  last_action: string;
  uptime: number;
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
    type: 'like' | 'follow' | 'reply';
    message: string;
    time: string;
    user?: string;
    timestamp: string;
  }>;
  twitter_connected: boolean;
  plan: string;
  daily_limit: number;
  actions_used: number;
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

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const userId = await this.getUserId();
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${userId}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async getDashboardStatus(): Promise<DashboardStatus> {
    const userId = await this.getUserId();
    return this.makeRequest<DashboardStatus>(`/dashboard/status/${userId}`);
  }

  async startBot(): Promise<BotStartResponse> {
    const userId = await this.getUserId();
    return this.makeRequest<BotStartResponse>('/bots/start', {
      method: 'POST',
      body: JSON.stringify({
        config: { user_id: userId }
      }),
    });
  }

  async stopBot(): Promise<BotStartResponse> {
    const userId = await this.getUserId();
    return this.makeRequest<BotStartResponse>('/bots/stop', {
      method: 'POST',
      body: JSON.stringify({
        config: { user_id: userId }
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