import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  ExternalLink,
  Bot,
  TrendingUp,
  Users,
  MessageSquare,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FinalSuccessStepProps {
  onComplete: () => void;
  analysisData?: any;
  botConfig?: any;
}

const FinalSuccessStep = ({ onComplete, analysisData, botConfig }: FinalSuccessStepProps) => {
  const { toast } = useToast();
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(prompt);
      setTimeout(() => setCopiedPrompt(null), 2000);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the prompt manually",
        variant: "destructive"
      });
    }
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

  const getQuickStartGuide = () => {
    if (!analysisData?.niche) return null;

    const guides = {
      crypto: [
        "Follow crypto influencers and traders",
        "Engage with market analysis content",
        "Share educational crypto content",
        "Monitor trending crypto hashtags"
      ],
      fitness: [
        "Connect with fitness enthusiasts",
        "Engage with workout and nutrition content",
        "Share motivational fitness posts",
        "Follow gym and health accounts"
      ],
      tech: [
        "Follow tech leaders and developers",
        "Engage with programming content",
        "Share technical insights and tutorials",
        "Monitor trending tech discussions"
      ],
      marketing: [
        "Connect with business leaders",
        "Engage with growth and marketing content",
        "Share marketing insights and tips",
        "Follow startup and entrepreneur accounts"
      ]
    };

    return guides[analysisData.niche as keyof typeof guides];
  };

  const quickStartGuide = getQuickStartGuide();

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 h-full flex flex-col">
      {/* Success Header */}
      <div className="text-center space-y-3 flex-shrink-0">
        <div className="flex justify-center mb-3">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          🎉 Welcome to COSTRAS!
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          Your AI-powered Twitter automation is ready. Everything is configured based on your {analysisData?.niche || 'general'} profile.
        </p>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto space-y-4">
        {/* Analysis Summary */}
        {analysisData && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Analysis Summary
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                What our AI discovered about your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg border">
                  <div className="text-xl sm:text-2xl mb-1">
                    {getNicheIcon(analysisData.niche)}
                  </div>
                  <h4 className="font-medium text-sm">Account Type</h4>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {analysisData.niche?.charAt(0).toUpperCase() + analysisData.niche?.slice(1)}
                  </Badge>
                </div>
                
                <div className="text-center p-3 rounded-lg border">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-green-500" />
                  <h4 className="font-medium text-sm">Engagement</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analysisData.engagement_style}
                  </p>
                </div>
                
                <div className="text-center p-3 rounded-lg border">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-purple-500" />
                  <h4 className="font-medium text-sm">Tone</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analysisData.tone}
                  </p>
                </div>
              </div>

              {analysisData.key_topics && analysisData.key_topics.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Key Topics</h4>
                  <div className="flex flex-wrap gap-1">
                    {analysisData.key_topics.slice(0, 6).map((topic: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {analysisData.key_topics.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{analysisData.key_topics.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      {/* Generated Prompts */}
      {analysisData?.generated_prompts && analysisData.generated_prompts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Your Personalized AI Prompts
            </CardTitle>
            <CardDescription>
              Custom prompts generated specifically for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisData.generated_prompts.map((prompt: string, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Prompt {index + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyPrompt(prompt)}
                    className="h-8 px-2"
                  >
                    {copiedPrompt === prompt ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm bg-muted/50 p-3 rounded">{prompt}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Bot Configuration Summary */}
      {botConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-green-500" />
              Bot Configuration
            </CardTitle>
            <CardDescription>
              Your bot settings optimized for your account type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Activity Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Actions per hour:</span>
                    <span className="font-medium">{botConfig.maxActionsPerHour}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily follow limit:</span>
                    <span className="font-medium">{botConfig.dailyFollowLimit}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Enabled Actions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${botConfig.enableAutoFollow ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span>Auto Follow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${botConfig.enableAutoLike ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span>Auto Like</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${botConfig.enableAutoRetweet ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span>Auto Retweet</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Start Guide */}
      {quickStartGuide && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-indigo-500" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Recommended next steps for your {analysisData?.niche} account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {quickStartGuide.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
          <CardDescription>
            Your bot is configured and ready to start working
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-500" />
                Dashboard
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Monitor your bot's activity, view analytics, and adjust settings.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-green-500" />
                Extension
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Use the Chrome extension to manually control your bot.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Open Extension
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* What's Next - Compact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">What's Next?</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Your bot is ready to start working
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Extension
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final CTA - Fixed at bottom */}
      <div className="text-center space-y-3 flex-shrink-0">
        <h3 className="text-lg sm:text-xl font-semibold">Ready to grow your Twitter presence?</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Your AI-powered automation is ready to engage with your audience.
        </p>
        <Button onClick={onComplete} size="lg" className="w-full max-w-sm">
          Enter Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default FinalSuccessStep;