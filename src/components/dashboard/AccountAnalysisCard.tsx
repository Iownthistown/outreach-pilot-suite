import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Brain, 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  ArrowRight 
} from "lucide-react";
import { analysisProgressService, AnalysisProgress } from "@/services/analysisProgressService";
import { accountAnalysisService, AccountAnalysisData } from "@/services/accountAnalysisService";
import { supabase } from "@/integrations/supabase/client";

interface AccountAnalysisCardProps {
  userId?: string;
  twitterHandle?: string;
}

interface AnalysisStatus {
  status: 'complete' | 'pending' | 'in_progress' | 'not_started' | 'failed' | 'error';
  twitter_handle: string;
  niche?: string;
  confidence_score?: number;
  custom_prompts?: any;
}

const AccountAnalysisCard = ({ userId, twitterHandle }: AccountAnalysisCardProps) => {
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus | null>(null);
  const [supabaseAnalysis, setSupabaseAnalysis] = useState<AccountAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isPolling, setIsPolling] = useState(false);
  const [actualTwitterHandle, setActualTwitterHandle] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkAnalysisStatus = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Get current session and access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No active session found. Please login again.');
      }

      const accessToken = session.access_token;

      // First, fetch the user's Twitter handle from Supabase if not provided
      let effectiveTwitterHandle = twitterHandle;
      
      if (!effectiveTwitterHandle) {
        console.log('No twitter handle provided, fetching from Supabase...');
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('twitter_handle')
          .eq('id', userId)
          .single();
          
        if (userError) {
          console.error('Error fetching user data:', userError);
        } else if (userData?.twitter_handle) {
          effectiveTwitterHandle = userData.twitter_handle;
          setActualTwitterHandle(effectiveTwitterHandle);
          console.log('Found twitter handle in Supabase:', effectiveTwitterHandle);
        }
      } else {
        setActualTwitterHandle(effectiveTwitterHandle);
      }

      // First check Supabase for existing analysis
      const supabaseData = await accountAnalysisService.getAnalysis(userId);
      
      if (supabaseData) {
        setSupabaseAnalysis(supabaseData);
        setAnalysisStatus({ 
          status: 'complete', 
          twitter_handle: supabaseData.twitter_handle,
          niche: supabaseData.niche,
          confidence_score: supabaseData.confidence_score
        });
        setProgress(100);
        setError(null);
        setLoading(false);
        return;
      }

      // If no Supabase data and no Twitter handle, can't proceed
      if (!effectiveTwitterHandle) {
        setAnalysisStatus({ status: 'not_started', twitter_handle: '' });
        setProgress(0);
        setLoading(false);
        return;
      }

      // If no Supabase data, check the external API
      const response = await fetch(
        `https://api.costras.com/api/custom-prompt/${userId}/${effectiveTwitterHandle}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalysisStatus(data);
        setError(null);
        
        // Update progress based on status
        if (data.status === 'complete') {
          setProgress(100);
        } else if (data.status === 'in_progress') {
          setProgress(75);
        } else if (data.status === 'pending') {
          setProgress(25);
        } else {
          setProgress(0);
        }
      } else if (response.status === 404) {
        // Analysis not started yet
        setAnalysisStatus({ status: 'not_started', twitter_handle: effectiveTwitterHandle });
        setProgress(0);
      } else {
        throw new Error(`API returned ${response.status}`);
      }
    } catch (err) {
      console.error('Analysis status check error:', err);
      setError(err instanceof Error ? err.message : 'Failed to check analysis status');
      
      // Check localStorage for cached analysis data
      const cachedAnalysis = localStorage.getItem('analysis_data');
      if (cachedAnalysis) {
        try {
          const data = JSON.parse(cachedAnalysis);
          setAnalysisStatus(data);
          setProgress(100);
        } catch (parseError) {
          console.error('Failed to parse cached analysis:', parseError);
        }
      } else {
        // No data found anywhere, show not started
        setAnalysisStatus({ status: 'not_started', twitter_handle: actualTwitterHandle || '' });
        setProgress(0);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, twitterHandle, actualTwitterHandle]);

  // Initial status check and cleanup
  useEffect(() => {
    checkAnalysisStatus();

    return () => {
      analysisProgressService.cleanup();
    };
  }, [checkAnalysisStatus]);

  const startAnalysis = async () => {
    // Use the effective twitter handle (either from props or fetched from Supabase)
    const effectiveTwitterHandle = actualTwitterHandle || twitterHandle;
    
    if (!userId || !effectiveTwitterHandle) {
      toast({
        title: "Missing Information",
        description: "User ID or Twitter handle not found. Please complete onboarding first.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0); // Reset progress to 0 immediately
    setProgressMessage('Starting analysis...');
    setLastUpdate('');

    try {
      // Get current session and access token like in onboarding
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No active session found. Please login again.');
      }

      const accessToken = session.access_token;
      const user = session.user;
      
      if (!user?.email) {
        throw new Error('User email not found. Please ensure you are properly logged in.');
      }

      // CRITICAL FIX: Start SSE connection FIRST before making the API call
      console.log('🚀 Starting SSE connection BEFORE API call...');
      analysisProgressService.startRealTimeTracking(userId, {
        onProgressUpdate: (progressData: AnalysisProgress) => {
          console.log('📊 Progress update received:', progressData);
          setProgress(progressData.percent);
          setProgressMessage(progressData.message);
          setLastUpdate(progressData.updated_at);
          
          // Update status based on progress
          if (progressData.percent < 100) {
            setAnalysisStatus({ status: 'in_progress', twitter_handle: effectiveTwitterHandle });
          }
        },
        onComplete: (result: any) => {
          setProgress(100);
          setProgressMessage("Analysis completed successfully!");
          setAnalysisStatus(result);
          setIsPolling(false);
          
          // Store completion status
          localStorage.setItem('analysis_complete', 'true');
          localStorage.setItem('analysis_data', JSON.stringify(result));
          
          toast({
            title: "Analysis Complete!",
            description: "Your account analysis is ready.",
            duration: 3000
          });
        },
        onError: (error: string) => {
          console.error('Progress tracking error:', error);
          setError(`Progress tracking: ${error}`);
          
          // Don't show every connection error, only significant ones
          if (!error.includes('Connection issues')) {
            toast({
              title: "Progress Tracking Issue",
              description: error,
              variant: "destructive"
            });
          }
        }
      });

      // Small delay to ensure SSE connection is established
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('Making API call with headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      });

      const response = await fetch('https://api.costras.com/api/analyze-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          twitter_handle: effectiveTwitterHandle,
          user_id: userId,
          user_email: user.email
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to start analysis: ${response.status}`);
      }

      toast({
        title: "Analysis Started",
        description: "Your account analysis has been started and will complete shortly.",
        duration: 3000
      });

      // Update status to show analysis is starting
      setAnalysisStatus({ status: 'pending', twitter_handle: effectiveTwitterHandle });
      setProgress(0); // Ensure progress starts at 0
      setProgressMessage('Analysis starting...');
      setIsPolling(true);

    } catch (err) {
      console.error('Start analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start analysis');
      
      toast({
        title: "Analysis Failed",
        description: "Unable to start account analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = () => {
    if (!analysisStatus) return "Analysis Status Unknown";
    
    switch (analysisStatus.status) {
      case 'complete':
        return "Analysis Complete";
      case 'in_progress':
        return "Analyzing Account";
      case 'pending':
        return "Analysis Pending";
      case 'not_started':
        return "Ready to Analyze";
      case 'failed':
      case 'error':
        return "Analysis Failed";
      default:
        return "Analysis Status Unknown";
    }
  };

  const getStatusDescription = () => {
    if (!analysisStatus) return "Unable to determine analysis status";
    
    switch (analysisStatus.status) {
      case 'complete':
        if (supabaseAnalysis) {
          let description = "Your account has been successfully analyzed";
          if (supabaseAnalysis.niche) {
            description = `Detected as ${supabaseAnalysis.niche} creator`;
            if (supabaseAnalysis.confidence_score) {
              description += ` with ${supabaseAnalysis.confidence_score}% confidence`;
            }
          }
          return description;
        }
        return analysisStatus.niche 
          ? `Detected as ${analysisStatus.niche} creator with ${analysisStatus.confidence_score}% confidence`
          : "Your account has been successfully analyzed";
      case 'in_progress':
        return "AI is currently analyzing your Twitter content and engagement patterns";
      case 'pending':
        return "Analysis request submitted and will begin processing shortly";
      case 'not_started':
        return "Complete your account analysis to unlock personalized bot settings and get started";
      case 'failed':
      case 'error':
        return "The analysis could not be completed. Click retry to try again.";
      default:
        return "Unable to determine analysis status";
    }
  };

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="w-6 h-6 animate-spin" />;
    if (error) return <AlertCircle className="w-6 h-6 text-destructive" />;
    
    if (!analysisStatus) return <Brain className="w-6 h-6 text-muted-foreground" />;
    
    switch (analysisStatus.status) {
      case 'complete':
        return <CheckCircle className="w-6 h-6 text-success" />;
      case 'in_progress':
        return <Brain className="w-6 h-6 text-primary animate-pulse" />;
      case 'pending':
        return <Loader2 className="w-6 h-6 text-warning animate-spin" />;
      case 'not_started':
        return <Brain className="w-6 h-6 text-muted-foreground" />;
      case 'failed':
      case 'error':
        return <AlertCircle className="w-6 h-6 text-destructive" />;
      default:
        return <Brain className="w-6 h-6 text-muted-foreground" />;
    }
  };

  if (loading && !analysisStatus) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <div>
            <h3 className="font-semibold">Checking Analysis Status</h3>
            <p className="text-sm text-muted-foreground">Loading your account analysis status...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-muted/40">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-lg font-semibold">Account Analysis</CardTitle>
              <CardDescription className="text-sm">
                <span className={`inline-flex items-center gap-1 ${
                  analysisStatus?.status === 'complete' ? 'text-success' :
                  analysisStatus?.status === 'in_progress' ? 'text-primary' :
                  analysisStatus?.status === 'failed' || analysisStatus?.status === 'error' ? 'text-destructive' :
                  'text-muted-foreground'
                }`}>
                  {getStatusText()}
                </span>
              </CardDescription>
            </div>
          </div>
          {analysisStatus?.custom_prompts && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Custom Prompts
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getStatusDescription()}
          </p>
        </div>

        {/* Progress Bar */}
        {analysisStatus && analysisStatus.status !== 'not_started' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">
                  {progressMessage || 
                   (analysisStatus.status === 'in_progress' ? 'Analyzing your content...' : 
                    analysisStatus.status === 'pending' ? 'Starting analysis...' : 
                    'Progress')}
                </span>
                <span className="text-primary font-semibold">{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-muted/30"
              />
            </div>
            
            {(analysisStatus.status === 'in_progress' || analysisStatus.status === 'pending') && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>{progressMessage || "AI is analyzing your Twitter content and engagement patterns..."}</span>
              </div>
            )}
            
            {lastUpdate && analysisProgressService.isTracking() && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-success/10 rounded-lg p-3 border border-success/20">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>Live tracking active - Last update: {new Date(lastUpdate).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-3 text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Connection Error</p>
                <p className="text-xs mt-1 opacity-90">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Details */}
        {analysisStatus?.status === 'complete' && (supabaseAnalysis || analysisStatus.niche) && (
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">Analysis Complete</span>
              </div>
              
              {supabaseAnalysis ? (
                <div className="grid grid-cols-1 gap-3">
                  {supabaseAnalysis.niche && (
                    <div className="flex justify-between items-center py-2 border-b border-success/20 last:border-b-0">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Niche</span>
                      <span className="text-sm font-semibold text-foreground">{supabaseAnalysis.niche}</span>
                    </div>
                  )}
                  {supabaseAnalysis.confidence_score && (
                    <div className="flex justify-between items-center py-2 border-b border-success/20 last:border-b-0">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Confidence</span>
                      <span className="text-sm font-semibold text-foreground">{supabaseAnalysis.confidence_score}%</span>
                    </div>
                  )}
                  {supabaseAnalysis.tone && (
                    <div className="flex justify-between items-center py-2 border-b border-success/20 last:border-b-0">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tone</span>
                      <span className="text-sm font-semibold text-foreground">{supabaseAnalysis.tone}</span>
                    </div>
                  )}
                  {supabaseAnalysis.engagement_style && (
                    <div className="flex justify-between items-center py-2 border-b border-success/20 last:border-b-0">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Style</span>
                      <span className="text-sm font-semibold text-foreground">{supabaseAnalysis.engagement_style}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Results</span>
                  <span className="text-sm font-semibold text-foreground">
                    {analysisStatus.niche} • {analysisStatus.confidence_score}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {analysisStatus?.status === 'not_started' && (
            <Button 
              onClick={() => navigate('/onboarding')}
              variant="default" 
              className="flex-1 gap-2"
            >
              <Brain className="w-4 h-4" />
              Start Account Analysis
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          
          {analysisStatus?.status === 'complete' && (
            <Button 
              onClick={startAnalysis} 
              variant="outline" 
              size="sm"
              disabled={loading}
              className="flex-1 gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Re-analyze Account
            </Button>
          )}
          
          {(analysisStatus?.status === 'failed' || analysisStatus?.status === 'error') && (
            <Button 
              onClick={() => navigate('/onboarding')} 
              variant="destructive" 
              size="sm"
              disabled={loading}
              className="flex-1 gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Analysis
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          
          {error && !analysisStatus?.status && (
            <div className="flex gap-2 w-full">
              <Button 
                onClick={checkAnalysisStatus} 
                variant="outline" 
                size="sm"
                className="flex-1 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Check Status
              </Button>
              <Button 
                onClick={() => navigate('/onboarding')} 
                variant="default" 
                size="sm"
                className="flex-1 gap-2"
              >
                <Brain className="w-4 h-4" />
                Start Analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountAnalysisCard;