import { supabase } from "@/integrations/supabase/client";

export interface AnalysisProgress {
  stage: string;
  percent: number;
  message: string;
  updated_at: string;
}

export interface AnalysisProgressResponse {
  progress: AnalysisProgress;
  status: 'in_progress' | 'complete' | 'error' | 'not_started';
}

// Progress stage mapping
export const PROGRESS_STAGES = {
  0: "Starting analysis...",
  10: "Starting Twitter data collection...",
  25: "Twitter data collected successfully",
  35: "Starting AI analysis...",
  50: "AI analysis completed and saved",
  60: "Generating custom prompts...",
  75: "Custom prompts generated and saved",
  90: "Finalizing results...",
  100: "Analysis completed successfully!"
};

export class AnalysisProgressService {
  private eventSource: EventSource | null = null;
  private onProgressUpdate: ((progress: AnalysisProgress) => void) | null = null;
  private onComplete: ((result: any) => void) | null = null;
  private onError: ((error: string) => void) | null = null;

  async getProgress(userId: string): Promise<AnalysisProgressResponse> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`https://api.costras.com/api/analysis-progress/${userId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            progress: {
              stage: "not_started",
              percent: 0,
              message: "Analysis not started",
              updated_at: new Date().toISOString()
            },
            status: 'not_started'
          };
        }
        throw new Error(`Failed to fetch progress: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        progress: {
          stage: data.stage || "unknown",
          percent: data.percent || 0,
          message: data.message || PROGRESS_STAGES[data.percent as keyof typeof PROGRESS_STAGES] || "Processing...",
          updated_at: data.updated_at || new Date().toISOString()
        },
        status: data.percent === 100 ? 'complete' : 'in_progress'
      };
    } catch (error) {
      console.error('Progress fetch error:', error);
      throw error;
    }
  }

  startRealTimeTracking(
    userId: string,
    options: {
      onProgressUpdate: (progress: AnalysisProgress) => void;
      onComplete?: (result: any) => void;
      onError?: (error: string) => void;
    }
  ) {
    this.onProgressUpdate = options.onProgressUpdate;
    this.onComplete = options.onComplete;
    this.onError = options.onError;

    // Close existing connection if any
    this.stopTracking();

    try {
      // Use SSE for real-time progress updates
      const eventSourceUrl = `https://api.costras.com/api/analysis-progress-stream/${userId}`;
      this.eventSource = new EventSource(eventSourceUrl);

      this.eventSource.onmessage = (event) => {
        try {
          const progressData = JSON.parse(event.data);
          
          const progress: AnalysisProgress = {
            stage: progressData.stage || "unknown",
            percent: progressData.percent || 0,
            message: progressData.message || PROGRESS_STAGES[progressData.percent as keyof typeof PROGRESS_STAGES] || "Processing...",
            updated_at: progressData.updated_at || new Date().toISOString()
          };

          if (this.onProgressUpdate) {
            this.onProgressUpdate(progress);
          }

          // Check if analysis is complete
          if (progress.percent >= 100) {
            this.stopTracking();
            if (this.onComplete) {
              // Fetch final analysis result
              this.getFinalResult(userId)
                .then(result => this.onComplete?.(result))
                .catch(error => this.onError?.('Failed to fetch final results'));
            }
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error);
          if (this.onError) {
            this.onError('Error processing progress update');
          }
        }
      };

      this.eventSource.onerror = (event) => {
        console.error('SSE connection error:', event);
        if (this.onError) {
          this.onError('Connection error - real-time updates may be delayed');
        }
        
        // Don't auto-close on error - let it reconnect
        // The browser will automatically attempt to reconnect
      };

      this.eventSource.onopen = () => {
        console.log('SSE connection established for user:', userId);
      };

    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
      if (this.onError) {
        this.onError('Failed to establish real-time connection');
      }
    }
  }

  stopTracking() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  private async getFinalResult(userId: string): Promise<any> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    // Try to get the final analysis result
    const twitterHandle = localStorage.getItem('costras_twitter_handle') || 'username';
    
    const response = await fetch(
      `https://api.costras.com/api/custom-prompt/${userId}/${twitterHandle}`,
      {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      }
    );

    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch final result');
  }

  isTracking(): boolean {
    return this.eventSource !== null;
  }

  cleanup() {
    this.stopTracking();
    this.onProgressUpdate = null;
    this.onComplete = null;
    this.onError = null;
  }
}

export const analysisProgressService = new AnalysisProgressService();