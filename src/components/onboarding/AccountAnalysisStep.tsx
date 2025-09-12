import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Twitter, 
  Brain, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Hash,
  Sparkles,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Clock,
  Loader2
} from "lucide-react";
import { analysisProgressService, AnalysisProgress } from "@/services/analysisProgressService";

interface AccountAnalysisStepProps {
  onNext: () => void;
  loading?: boolean;
  twitterConnected: boolean;
  onAnalysisComplete: (analysisData: any) => void;
  twitterHandle?: string;
  userId?: string;
}

interface AnalysisResult {
  status: 'complete' | 'pending' | 'in_progress';
  twitter_handle: string;
  niche?: string;
  confidence_score?: number;
  custom_prompts?: any;
  content_patterns?: {
    posting_style: string;
    content_type: string[];
    engagement_patterns: string;
  };
  engagement_style?: string;
  tone?: string;
  key_topics?: string[];
}

const AccountAnalysisStep = ({ 
  onNext, 
  loading = false, 
  twitterConnected,
  onAnalysisComplete,
  twitterHandle,
  userId 
}: AccountAnalysisStepProps) => {
  const [analysisStatus, setAnalysisStatus] = useState<'waiting' | 'analyzing' | 'complete' | 'error'>('waiting');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [canContinue, setCanContinue] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const { toast } = useToast();

  // Start analysis when Twitter is connected and show continue message after 1 second
  useEffect(() => {
    if (twitterConnected && analysisStatus === 'waiting') {
      startAnalysis();
      
      // Show continue message after 1 second
      setTimeout(() => {
        setCanContinue(true);
      }, 1000);
    }
  }, [twitterConnected, analysisStatus]);

  const getNicheBadgeStyle = (niche: string) => {
    const styles = {
      crypto: "bg-gradient-to-r from-orange-500 to-yellow-500",
      fitness: "bg-gradient-to-r from-green-500 to-emerald-500",
      tech: "bg-gradient-to-r from-blue-500 to-cyan-500",
      marketing: "bg-gradient-to-r from-purple-500 to-pink-500",
      onlyfans: "bg-gradient-to-r from-pink-500 to-rose-500",
      coffee: "bg-gradient-to-r from-amber-600 to-orange-600",
      finance: "bg-gradient-to-r from-yellow-600 to-amber-500",
      lifestyle: "bg-gradient-to-r from-indigo-500 to-purple-500",
      general: "bg-gradient-to-r from-gray-500 to-slate-500"
    };
    return styles[niche as keyof typeof styles] || styles.general;
  };

  const getNicheIcon = (niche: string) => {
    const icons = {
      crypto: "₿",
      fitness: "💪",
      tech: "💻",
      marketing: "📊",
      onlyfans: "🎬",
      coffee: "☕",
      finance: "💰",
      lifestyle: "✨",
      general: "🌐"
    };
    return icons[niche as keyof typeof icons] || icons.general;
  };

  const startAnalysis = async () => {
    setAnalysisStatus('analyzing');
    setProgress(0);
    setCanContinue(false);
    setProgressMessage('Starting analysis...');
    
    try {
      // Get current session and access token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      if (!session) {
        throw new Error('No active session found. Please log in again.');
      }
      
      const accessToken = session.access_token;
      console.log('Access token found:', accessToken ? 'Yes' : 'No');
      console.log('User ID:', session.user.id);

      // Get user data
      const userIdValue = userId || session.user.id;
      const handleValue = twitterHandle || localStorage.getItem('costras_twitter_handle') || 'username';
      const userEmail = session.user.email;
      
      if (!userIdValue) {
        throw new Error('User ID not found');
      }
      
      if (!userEmail) {
        throw new Error('User email not found. Please ensure you are properly logged in.');
      }

      // CRITICAL FIX: Start SSE connection FIRST before making the API call
      console.log('🚀 Starting SSE connection BEFORE API call...');
      analysisProgressService.startRealTimeTracking(userIdValue, {
        onProgressUpdate: (progressData: AnalysisProgress) => {
          console.log('📊 Progress update received:', progressData);
          setProgress(progressData.percent);
          setProgressMessage(progressData.message);
          setCurrentStage(progressData.stage);
          setLastUpdate(progressData.updated_at);
          
          // Allow continue after reaching 10%
          if (progressData.percent >= 10 && !canContinue) {
            setCanContinue(true);
          }
        },
        onComplete: (result: any) => {
          setProgress(100);
          setCurrentStage("Analysis complete!");
          setProgressMessage("Analysis completed successfully!");
          setAnalysisResult(result);
          setAnalysisStatus('complete');
          onAnalysisComplete(result);
          
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
          // Don't fail completely on progress errors, continue with fallback
          if (!canContinue && progress === 0) {
            // If we haven't made any progress, show continue option after 10 seconds
            setTimeout(() => {
              setCanContinue(true);
            }, 10000);
          }
        }
      });

      // Small delay to ensure SSE connection is established
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('Making API call with headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      });

      // Start analysis via API with JWT token
      const response = await fetch('https://api.costras.com/api/analyze-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          twitter_handle: handleValue,
          user_id: userIdValue,
          user_email: userEmail
        })
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      toast({
        title: "Analysis Started",
        description: "This might take a few minutes. You can continue to the next step while analysis runs in the background.",
        duration: 5000
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to analyze account. Please try again.');
      
      toast({
        title: "Analysis Failed",
        description: "Unable to start account analysis. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRetry = () => {
    setAnalysisStatus('waiting');
    setProgress(0);
    setErrorMessage('');
    setCanContinue(false);
    setProgressMessage('');
    
    // Stop any existing polling
    analysisProgressService.stopTracking();
    
    startAnalysis();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      analysisProgressService.cleanup();
    };
  }, []);

  if (!twitterConnected) {
    return (
      <div className="max-w-md mx-auto space-y-4 h-full flex flex-col justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Account Analysis</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Connect Twitter first to analyze your content
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center space-y-3">
              <Twitter className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                Complete Twitter connection step to continue
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 h-full flex flex-col">
      <div className="text-center space-y-2 flex-shrink-0">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">AI Account Analysis</h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Analyzing your Twitter account to optimize bot settings
        </p>
        {canContinue && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-primary bg-primary/10 px-3 py-2 rounded-lg animate-fade-in">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Analysis continues in background. You can proceed to next step.</span>
            <span className="sm:hidden">Can continue to next step</span>
          </div>
        )}
      </div>

      {analysisStatus === 'analyzing' && (
        <Card className="flex-1 flex flex-col">
          <CardHeader className="text-center pb-3 flex-shrink-0">
            <div className="flex justify-center mb-2">
              <div className="relative">
                <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-primary animate-pulse" />
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
            </div>
            <CardTitle className="text-lg sm:text-xl">Analyzing Your Account</CardTitle>
            <CardDescription className="text-xs sm:text-sm">This may take a few moments...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col">
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground truncate">{progressMessage || currentStage}</span>
                <span className="text-primary font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 sm:h-3 bg-muted/20 transition-all duration-300" 
              />
              {lastUpdate && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="hidden sm:inline">Last updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
                  <span className="sm:hidden">Updating...</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1">
              <div className="p-2 sm:p-3 rounded-lg bg-muted/50 transition-all hover:bg-muted/70">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-blue-500" />
                <p className="text-xs font-medium">Content</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-muted/50 transition-all hover:bg-muted/70">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-green-500" />
                <p className="text-xs font-medium">Engagement</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-muted/50 transition-all hover:bg-muted/70">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-purple-500" />
                <p className="text-xs font-medium">Tone</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-muted/50 transition-all hover:bg-muted/70">
                <Hash className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-orange-500" />
                <p className="text-xs font-medium">Topics</p>
              </div>
            </div>

            {canContinue && (
              <div className="pt-3 border-t animate-fade-in flex-shrink-0">
                <Button onClick={onNext} className="w-full">
                  <span className="hidden sm:inline">Continue to Bot Configuration</span>
                  <span className="sm:hidden">Continue Setup</span>
                  <span className="ml-2 text-xs opacity-70 hidden sm:inline">(Analysis continues)</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {analysisStatus === 'complete' && analysisResult && (
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle>Analysis Complete!</CardTitle>
            <CardDescription>Here's what we discovered about your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Niche Detection - only show if niche exists */}
            {analysisResult.niche && (
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-lg" 
                     style={{ background: `linear-gradient(135deg, ${getNicheBadgeStyle(analysisResult.niche)})` }}>
                  <span className="text-2xl">{getNicheIcon(analysisResult.niche)}</span>
                  {analysisResult.niche.charAt(0).toUpperCase() + analysisResult.niche.slice(1)} Creator
                </div>
                {analysisResult.confidence_score && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground">Confidence:</span>
                    <Progress value={analysisResult.confidence_score} className="w-24 h-2" />
                    <span className="text-sm font-medium">{analysisResult.confidence_score}%</span>
                  </div>
                )}
              </div>
            )}

            {/* Content Insights - only show if data exists */}
            {analysisResult.content_patterns && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    Content Patterns
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Style:</span> {analysisResult.content_patterns.posting_style}</p>
                    <p><span className="text-muted-foreground">Types:</span> {analysisResult.content_patterns.content_type.join(', ')}</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-500" />
                    Engagement Style
                  </h4>
                  <div className="space-y-1 text-sm">
                    {analysisResult.engagement_style && (
                      <Badge variant="outline">{analysisResult.engagement_style}</Badge>
                    )}
                    <p className="text-muted-foreground text-xs">
                      {analysisResult.content_patterns.engagement_patterns}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Topics - only show if they exist */}
            {analysisResult.key_topics && analysisResult.key_topics.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-orange-500" />
                  Key Topics & Themes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.key_topics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Prompts Available Indicator */}
            {analysisResult.custom_prompts && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Custom AI prompts generated!</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your bot will use personalized prompts based on your account analysis.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={onNext} className="flex-1">
                Continue to Bot Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {analysisStatus === 'error' && (
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <CardTitle>Analysis Failed</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Button onClick={handleRetry}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
            <div className="text-center">
              <Button onClick={onNext} className="w-full">
                Continue to Bot Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountAnalysisStep;