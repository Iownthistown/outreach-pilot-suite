import { supabase } from "@/integrations/supabase/client";

export interface OnboardingProgress {
  welcome_completed: boolean;
  plan_selected: boolean;
  extension_installed: boolean;
  twitter_connected: boolean;
  account_analyzed: boolean;
  setup_completed: boolean;
  completion_percentage: number;
  current_step: string;
  is_completed: boolean;
}

export interface CurrentStep {
  current_step: string;
  completion_percentage: number;
  is_completed: boolean;
}

export class OnboardingProgressService {
  private readonly API_BASE_URL = 'https://api.costras.com';

  private async getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getOnboardingProgress(userId: string): Promise<OnboardingProgress> {
    try {
      return await this.makeRequest<OnboardingProgress>(`/api/onboarding-progress/${userId}`);
    } catch (error) {
      console.error('Error fetching onboarding progress:', error);
      throw error;
    }
  }

  async completeOnboardingStep(userId: string, step: string): Promise<void> {
    try {
      await this.makeRequest(`/api/onboarding-progress/${userId}/complete/${step}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error completing onboarding step:', error);
      throw error;
    }
  }

  async getCurrentOnboardingStep(userId: string): Promise<CurrentStep> {
    try {
      return await this.makeRequest<CurrentStep>(`/api/onboarding-progress/${userId}/current-step`);
    } catch (error) {
      console.error('Error fetching current onboarding step:', error);
      throw error;
    }
  }

  async resetOnboardingProgress(userId: string): Promise<void> {
    try {
      await this.makeRequest(`/api/onboarding-progress/${userId}/reset`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error resetting onboarding progress:', error);
      throw error;
    }
  }
}

export const onboardingProgressService = new OnboardingProgressService();