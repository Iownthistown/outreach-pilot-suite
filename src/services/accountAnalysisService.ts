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
      // For now, check localStorage for cached analysis data
      const cachedAnalysis = localStorage.getItem('analysis_data');
      const analysisComplete = localStorage.getItem('analysis_complete');
      
      if (cachedAnalysis && analysisComplete === 'true') {
        try {
          const data = JSON.parse(cachedAnalysis);
          return {
            id: data.id || userId,
            user_id: userId,
            twitter_handle: data.twitter_handle || '',
            niche: data.niche,
            confidence_score: data.confidence_score,
            tone: data.tone,
            engagement_style: data.engagement_style,
            key_topics: data.key_topics,
            content_patterns: data.content_patterns,
            analysis_data: data.analysis_data,
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString()
          };
        } catch (parseError) {
          console.error('Failed to parse cached analysis:', parseError);
        }
      }

      return null;
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