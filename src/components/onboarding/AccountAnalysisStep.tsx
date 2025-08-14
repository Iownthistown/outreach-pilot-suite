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
  Clock
} from "lucide-react";

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
  const { toast } = useToast();

  // Start analysis when Twitter is connected
  useEffect(() => {
    if (twitterConnected && analysisStatus === 'waiting') {
      startAnalysis();
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
      
      if (!userIdValue) {
        throw new Error('User ID not found');
      }

      // Start with scanning profile stage
      setCurrentStage("Scanning profile...");
      setProgress(25);

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
          user_id: userIdValue
        })
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      // Analysis started successfully
      setCurrentStage("Analyzing content...");
      setProgress(50);
      setCanContinue(true); // Allow user to continue while analysis runs

      toast({
        title: "Analysis Started",
        description: "This might take a minute. You can continue to the next step while analysis runs in the background.",
        duration: 5000
      });

      // Start polling for status
      const pollInterval = setInterval(async () => {
        try {
          // Get fresh session for status checks
          const { data: { session: statusSession } } = await supabase.auth.getSession();
          if (!statusSession) {
            console.error('No session available for status check');
            return;
          }

          const statusResponse = await fetch(
            `https://api.costras.com/api/custom-prompt/${userIdValue}/${handleValue}`,
            {
              headers: {
                'Authorization': `Bearer ${statusSession.access_token}`
              }
            }
          );

          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            
            if (statusData.status === 'complete') {
              clearInterval(pollInterval);
              setProgress(100);
              setCurrentStage("Analysis complete!");
              setAnalysisResult(statusData);
              setAnalysisStatus('complete');
              onAnalysisComplete(statusData);
              
              // Store completion status
              localStorage.setItem('analysis_complete', 'true');
              localStorage.setItem('analysis_data', JSON.stringify(statusData));
              
              toast({
                title: "Analysis Complete!",
                description: "Your account analysis is ready.",
                duration: 3000
              });
            } else if (statusData.status === 'in_progress') {
              // Update progress based on analysis stage
              if (currentStage.includes("Scanning")) {
                setCurrentStage("Building insights...");
                setProgress(75);
              } else if (currentStage.includes("Analyzing")) {
                setCurrentStage("Generating prompts...");
                setProgress(90);
              }
            }
          }
        } catch (pollError) {
          console.error('Status check error:', pollError);
        }
      }, 5000); // Check every 5 seconds

      // Store the interval ID to clean up later
      (window as any).analysisInterval = pollInterval;
      
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
    
    // Clear any existing interval
    if ((window as any).analysisInterval) {
      clearInterval((window as any).analysisInterval);
    }
    
    startAnalysis();
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if ((window as any).analysisInterval) {
        clearInterval((window as any).analysisInterval);
      }
    };
  }, []);

  if (!twitterConnected) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Account Analysis</h2>
          <p className="text-muted-foreground">
            Connect your Twitter account first to analyze your content patterns
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Twitter className="w-16 h-16 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Please complete the Twitter connection step to continue
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">AI Account Analysis</h2>
        <p className="text-muted-foreground">
          We're analyzing your Twitter account to optimize your bot settings
        </p>
        {canContinue && (
          <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>This might take a minute. You can continue to the next step while analysis runs in the background.</span>
          </div>
        )}
      </div>

      {analysisStatus === 'analyzing' && (
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Brain className="w-16 h-16 text-primary animate-pulse" />
                <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
            </div>
            <CardTitle>Analyzing Your Account</CardTitle>
            <CardDescription>This may take a few moments...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{currentStage}</span>
                <span className="text-primary font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-3 bg-muted/20" 
                style={{
                  background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary-foreground)) 100%)'
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted/50 transition-all hover:bg-muted/70">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-xs font-medium">Content Patterns</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 transition-all hover:bg-muted/70">
                <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-xs font-medium">Engagement Style</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 transition-all hover:bg-muted/70">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-xs font-medium">Communication Tone</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 transition-all hover:bg-muted/70">
                <Hash className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <p className="text-xs font-medium">Key Topics</p>
              </div>
            </div>

            {canContinue && (
              <div className="pt-4 border-t">
                <Button onClick={onNext} className="w-full" variant="outline">
                  Continue to Next Step
                  <span className="ml-2 text-xs text-muted-foreground">(Analysis continues in background)</span>
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
              <Button onClick={handleRetry} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-analyze
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
              <Button variant="ghost" onClick={onNext} size="sm">
                Continue with default settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountAnalysisStep;