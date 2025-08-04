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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <Sparkles className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground">
          🎉 Welcome to COSTRAS!
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered Twitter automation is ready. We've analyzed your account and configured 
          everything based on your {analysisData?.niche || 'general'} profile.
        </p>
      </div>

      {/* Analysis Summary */}
      {analysisData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Your Account Analysis Summary
            </CardTitle>
            <CardDescription>
              Here's what our AI discovered about your Twitter presence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg border">
                <div className="text-3xl mb-2">
                  {getNicheIcon(analysisData.niche)}
                </div>
                <h4 className="font-medium">Account Type</h4>
                <Badge variant="secondary" className="mt-1">
                  {analysisData.niche?.charAt(0).toUpperCase() + analysisData.niche?.slice(1)}
                </Badge>
              </div>
              
              <div className="text-center p-4 rounded-lg border">
                <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h4 className="font-medium">Engagement Style</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {analysisData.engagement_style}
                </p>
              </div>
              
              <div className="text-center p-4 rounded-lg border">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <h4 className="font-medium">Communication Tone</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {analysisData.tone}
                </p>
              </div>
            </div>

            {analysisData.key_topics && analysisData.key_topics.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Key Topics Detected</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisData.key_topics.map((topic: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
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

      <Separator />

      {/* Final CTA */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Ready to grow your Twitter presence?</h3>
        <p className="text-muted-foreground">
          Your AI-powered automation is active and ready to help you engage with your audience.
        </p>
        <Button onClick={onComplete} size="lg" className="px-8">
          Enter Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default FinalSuccessStep;