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
    <div className="h-full flex flex-col overflow-hidden">
      {/* Success Header - Fixed Height */}
      <div className="flex-shrink-0 h-24 text-center flex flex-col justify-center">
        <div className="flex justify-center mb-2">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-lg sm:text-xl font-bold text-foreground">
          🎉 Welcome to COSTRAS!
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Your AI-powered automation is ready based on your {analysisData?.niche || 'general'} profile.
        </p>
      </div>

      {/* Main Content - Fixed Height, No Scroll */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
        {/* Analysis Summary - Compact */}
        {analysisData && (
          <Card className="mb-3">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="text-center p-2 rounded border">
                  <div className="text-lg mb-1">
                    {getNicheIcon(analysisData.niche)}
                  </div>
                  <h4 className="font-medium text-xs">Type</h4>
                  <Badge variant="secondary" className="text-xs">
                    {analysisData.niche?.charAt(0).toUpperCase() + analysisData.niche?.slice(1)}
                  </Badge>
                </div>
                
                <div className="text-center p-2 rounded border">
                  <Users className="w-4 h-4 mx-auto mb-1 text-green-500" />
                  <h4 className="font-medium text-xs">Engagement</h4>
                  <p className="text-xs text-muted-foreground">
                    {analysisData.engagement_style}
                  </p>
                </div>
                
                <div className="text-center p-2 rounded border">
                  <MessageSquare className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                  <h4 className="font-medium text-xs">Tone</h4>
                  <p className="text-xs text-muted-foreground">
                    {analysisData.tone}
                  </p>
                </div>
              </div>

              {analysisData.key_topics && analysisData.key_topics.length > 0 && (
                <div>
                  <h4 className="font-medium mb-1 text-xs">Key Topics</h4>
                  <div className="flex flex-wrap gap-1">
                    {analysisData.key_topics.slice(0, 4).map((topic: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {analysisData.key_topics.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{analysisData.key_topics.length - 4} more
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

        {/* What's Next - Ultra Compact */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Settings className="w-3 h-3 mr-1" />
                Dashboard
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <ExternalLink className="w-3 h-3 mr-1" />
                Extension
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final CTA - Fixed at bottom */}
      <div className="flex-shrink-0 h-20 text-center flex flex-col justify-center">
        <h3 className="text-sm sm:text-base font-semibold mb-1">Ready to grow your Twitter presence?</h3>
        <Button onClick={onComplete} size="sm" className="w-full max-w-xs mx-auto">
          Enter Dashboard
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default FinalSuccessStep;