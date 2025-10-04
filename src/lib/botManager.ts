import { supabase } from "@/integrations/supabase/client";

export interface BotStatus {
  status: 'running' | 'stopped' | 'error';
  uptime?: number;
  lastActivity?: string;
}

export interface BotConfig {
  maxActionsPerHour: number;
  followLimit: number;
  aiApiKey?: string;
  customPrompt?: string;
  twitterCookie?: string;
}

export interface BotLog {
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'WARNING';
  message: string;
}

export interface BotStats {
  actionsToday: number;
  followsToday: number;
  repliesToday: number;
  uptime: number;
}

class BotManager {
  private baseUrl = 'https://api.costras.com';

  private async getAuthHeaders() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.access_token) {
      throw new Error('User not authenticated');
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async startBot(config: BotConfig): Promise<{ success: boolean; message?: string }> {
    try {
      const headers = await this.getAuthHeaders();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const response = await fetch(`${this.baseUrl}/bots/start`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          config: {
            user_id: user.id,
            max_actions_per_hour: config.maxActionsPerHour,
            follow_limit: config.followLimit,
            ...(config.aiApiKey ? { ai_api_key: config.aiApiKey } : {}),
            ...(config.customPrompt ? { custom_prompt: config.customPrompt } : {}),
            ...(config.twitterCookie ? { twitter_cookie: config.twitterCookie } : {})
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error starting bot:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async stopBot(): Promise<{ success: boolean; message?: string }> {
    try {
      const headers = await this.getAuthHeaders();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const response = await fetch(`${this.baseUrl}/bots/stop`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ user_id: user.id })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error stopping bot:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getBotStatus(): Promise<BotStatus | null> {
    try {
      const headers = await this.getAuthHeaders();
      const { data: { user } } = await supabase.auth.getUser();
      const response = await fetch(`${this.baseUrl}/bots/status/${user!.id}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting bot status:', error);
      return null;
    }
  }

  async getBotLogs(): Promise<BotLog[]> {
    try {
      const headers = await this.getAuthHeaders();
      const { data: { user } } = await supabase.auth.getUser();
      const response = await fetch(`${this.baseUrl}/bots/logs/${user!.id}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting bot logs:', error);
      return [];
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Error checking health:', error);
      return false;
    }
  }
}

export const botManager = new BotManager();