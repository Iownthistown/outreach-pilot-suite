import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  Sparkles 
} from "lucide-react";

interface AccountAnalysisCardProps {
  userId?: string;
  twitterHandle?: string;
}

interface AnalysisStatus {
  status: 'complete' | 'pending' | 'in_progress' | 'not_started';
  twitter_handle: string;
  niche?: string;
  confidence_score?: number;
  custom_prompts?: any;
}

const AccountAnalysisCard = ({ userId, twitterHandle }: AccountAnalysisCardProps) => {
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const checkAnalysisStatus = useCallback(async () => {
    if (!userId || !twitterHandle) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.costras.com/api/custom-prompt/${userId}/${twitterHandle}`,
        {
          headers: {
            'Authorization': `Bearer ${userId}`
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
        setAnalysisStatus({ status: 'not_started', twitter_handle: twitterHandle });
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
      }
    } finally {
      setLoading(false);
    }
  }, [userId, twitterHandle]);

  // Poll for status updates
  useEffect(() => {
    checkAnalysisStatus();

    // Set up polling if analysis is in progress
    let pollInterval: NodeJS.Timeout;
    
    if (analysisStatus?.status === 'in_progress' || analysisStatus?.status === 'pending') {
      pollInterval = setInterval(() => {
        checkAnalysisStatus();
      }, 10000); // Check every 10 seconds
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [checkAnalysisStatus, analysisStatus?.status]);

  const startAnalysis = async () => {
    if (!userId || !twitterHandle) {
      toast({
        title: "Missing Information",
        description: "User ID or Twitter handle not found. Please complete onboarding first.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.costras.com/api/analyze-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}`
        },
        body: JSON.stringify({
          twitter_handle: twitterHandle,
          user_id: userId
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
      setAnalysisStatus({ status: 'pending', twitter_handle: twitterHandle });
      setProgress(25);

      // Start polling
      setTimeout(() => {
        checkAnalysisStatus();
      }, 2000);

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
        return "✅ Analysis Complete";
      case 'in_progress':
        return "🔄 Analyzing Account...";
      case 'pending':
        return "⏳ Analysis Pending...";
      case 'not_started':
        return "🔍 Ready to Analyze";
      default:
        return "Analysis Status Unknown";
    }
  };

  const getStatusDescription = () => {
    if (!analysisStatus) return "Unable to determine analysis status";
    
    switch (analysisStatus.status) {
      case 'complete':
        return analysisStatus.niche 
          ? `Detected as ${analysisStatus.niche} creator with ${analysisStatus.confidence_score}% confidence`
          : "Your account has been successfully analyzed";
      case 'in_progress':
        return "AI is currently analyzing your Twitter content and engagement patterns";
      case 'pending':
        return "Analysis request submitted and will begin processing shortly";
      case 'not_started':
        return "Start analyzing your account to get personalized bot settings";
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
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-lg">Account Analysis Status</CardTitle>
              <CardDescription>{getStatusText()}</CardDescription>
            </div>
          </div>
          {analysisStatus?.custom_prompts && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              Custom Prompts
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {getStatusDescription()}
        </p>

        {/* Progress Bar */}
        {analysisStatus && analysisStatus.status !== 'not_started' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)'
              }}
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Error: {error}</span>
            </div>
          </div>
        )}

        {/* Analysis Details */}
        {analysisStatus?.status === 'complete' && analysisStatus.niche && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Analysis Complete</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Niche: {analysisStatus.niche} • Confidence: {analysisStatus.confidence_score}%
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {analysisStatus?.status === 'not_started' && (
            <Button 
              onClick={startAnalysis} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              Start Analysis
            </Button>
          )}
          
          {analysisStatus?.status === 'complete' && (
            <Button 
              onClick={startAnalysis} 
              variant="outline" 
              size="sm"
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-analyze
            </Button>
          )}
          
          {error && (
            <Button 
              onClick={checkAnalysisStatus} 
              variant="outline" 
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountAnalysisCard;