import { supabase } from "@/integrations/supabase/client";

export interface AccountAnalysisData {
  id: string;
  user_id: string;
  twitter_handle: string;
  niche?: string;
  confidence_score?: number;
  tone?: string;
  engagement_style?: string;
  key_topics?: string;
  content_patterns?: string;
  short_summary?: string;
  analysis_data?: any;
  created_at: string;
  updated_at: string;
}

export class AccountAnalysisService {
  async getAnalysis(userId: string): Promise<AccountAnalysisData | null> {
    try {
      // Cast to any to access account_analyses table not in generated types
      const { data, error } = await (supabase as any)
        .from('account_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Supabase query error:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return data as AccountAnalysisData;
    } catch (error) {
      console.error('Error fetching account analysis:', error);
      return null;
    }
  }

  async hasAnalysis(userId: string): Promise<boolean> {
    const analysis = await this.getAnalysis(userId);
    return analysis !== null;
  }
}

export const accountAnalysisService = new AccountAnalysisService();