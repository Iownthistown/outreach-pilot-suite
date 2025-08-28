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
  analysis_data?: any;
  created_at: string;
  updated_at: string;
}

export class AccountAnalysisService {
  async getAnalysis(userId: string): Promise<AccountAnalysisData | null> {
    try {
      // Use rpc call to avoid TypeScript issues with table not in generated types
      const { data, error } = await supabase.rpc('get_account_analysis', {
        p_user_id: userId
      });

      if (error) {
        console.error('Supabase query error:', error);
        return null;
      }

      return data?.[0] || null;
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