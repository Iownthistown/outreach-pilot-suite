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

    console.log('🚀 Starting SSE connection for user:', userId);

    try {
      // Try SSE first with auth token
      this.establishSSEConnection(userId);
    } catch (error) {
      console.error('❌ Failed to establish SSE connection:', error);
      console.log('🔄 Falling back to polling...');
      this.startPolling(userId);
    }
  }

  private async establishSSEConnection(userId: string) {
    try {
      // Get auth token for SSE
      const { data: { session } } = await supabase.auth.getSession();
      let eventSourceUrl = `https://api.costras.com/api/analysis-progress-stream/${userId}`;
      
      // Add auth token if available
      if (session?.access_token) {
        eventSourceUrl += `?token=${encodeURIComponent(session.access_token)}`;
        console.log('🔐 Adding auth token to SSE connection');
      }
      
      console.log('🔗 SSE URL:', eventSourceUrl.replace(/token=[^&]+/, 'token=***'));
      
      this.eventSource = new EventSource(eventSourceUrl);

      this.eventSource.onopen = () => {
        console.log('✅ SSE connection established for user:', userId);
      };

      this.eventSource.onmessage = (event) => {
        try {
          console.log('📨 SSE message received:', event.data);
          const progressData = JSON.parse(event.data);
          
          const progress: AnalysisProgress = {
            stage: progressData.stage || "unknown",
            percent: progressData.percent || 0,
            message: progressData.message || PROGRESS_STAGES[progressData.percent as keyof typeof PROGRESS_STAGES] || "Processing...",
            updated_at: progressData.updated_at || new Date().toISOString()
          };

          console.log('🔄 Progress update:', progress);

          if (this.onProgressUpdate) {
            this.onProgressUpdate(progress);
          }

          // Check if analysis is complete
          if (progress.percent >= 100) {
            console.log('✅ Analysis complete, fetching final results...');
            this.stopTracking();
            if (this.onComplete) {
              // Fetch final analysis result
              this.getFinalResult(userId)
                .then(result => this.onComplete?.(result))
                .catch(error => this.onError?.('Failed to fetch final results'));
            }
          }
        } catch (error) {
          console.error('❌ Error parsing SSE data:', error);
          if (this.onError) {
            this.onError('Error processing progress update');
          }
        }
      };

      this.eventSource.onerror = (event) => {
        console.error('❌ SSE connection error:', event);
        console.log('🔄 SSE failed, switching to polling fallback...');
        
        // Close SSE and fallback to polling
        this.stopTracking();
        this.startPolling(userId);
      };

    } catch (error) {
      console.error('❌ Failed to establish SSE connection:', error);
      throw error;
    }
  }

  private startPolling(userId: string) {
    console.log('🔄 Starting polling fallback for user:', userId);
    
    const pollInterval = setInterval(async () => {
      try {
        console.log('📡 Polling for progress updates...');
        const progressResponse = await this.getProgress(userId);
        
        if (progressResponse.progress) {
          console.log('📊 Polling progress:', progressResponse.progress);
          
          if (this.onProgressUpdate) {
            this.onProgressUpdate(progressResponse.progress);
          }
          
          if (progressResponse.status === 'complete' || progressResponse.progress.percent >= 100) {
            console.log('✅ Analysis complete via polling');
            clearInterval(pollInterval);
            
            if (this.onComplete) {
              try {
                const result = await this.getFinalResult(userId);
                this.onComplete(result);
              } catch (error) {
                console.error('Failed to fetch final result:', error);
                this.onError?.('Analysis complete but failed to fetch results');
              }
            }
          }
        }
      } catch (error) {
        console.error('❌ Polling error:', error);
        // Continue polling on error, but notify
        if (this.onError) {
          this.onError('Connection issues - retrying...');
        }
      }
    }, 3000); // Poll every 3 seconds

    // Store polling interval for cleanup
    (this as any).pollInterval = pollInterval;
  }

  stopTracking() {
    if (this.eventSource) {
      console.log('🛑 Closing SSE connection');
      this.eventSource.close();
      this.eventSource = null;
    }
    
    // Clear polling interval if exists
    if ((this as any).pollInterval) {
      console.log('🛑 Stopping polling');
      clearInterval((this as any).pollInterval);
      (this as any).pollInterval = null;
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
    console.log('🧹 Cleaning up progress service');
    this.stopTracking();
    this.onProgressUpdate = null;
    this.onComplete = null;
    this.onError = null;
  }
}

export const analysisProgressService = new AnalysisProgressService();