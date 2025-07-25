import { supabase } from "@/integrations/supabase/client";

export interface BotStatus {
  status: 'running' | 'stopped' | 'error';
  uptime?: number;
  lastActivity?: string;
}

export interface BotConfig {
  maxActionsPerHour: number;
  followLimit: number;
  aiApiKey: string;
  customPrompt: string;
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
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('User not authenticated');
    }
    return {
      'Authorization': `Bearer ${user.id}`,
      'Content-Type': 'application/json'
    };
  }

  async startBot(config: BotConfig): Promise<{ success: boolean; message?: string }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/bots/start`, {
        method: 'POST',
        headers,
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      const response = await fetch(`${this.baseUrl}/bots/stop`, {
        method: 'POST',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
        throw new Error(`HTTP error! status: ${response.status}`);
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
        throw new Error(`HTTP error! status: ${response.status}`);
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