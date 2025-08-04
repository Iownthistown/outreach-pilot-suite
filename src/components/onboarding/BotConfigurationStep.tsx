import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Settings, 
  MessageSquare, 
  TrendingUp,
  Clock,
  Users,
  Sparkles,
  Copy,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BotConfigurationStepProps {
  onNext: () => void;
  loading?: boolean;
  analysisData?: any;
}

interface BotConfig {
  maxActionsPerHour: number;
  dailyFollowLimit: number;
  enableAutoFollow: boolean;
  enableAutoLike: boolean;
  enableAutoRetweet: boolean;
  enableAutoReply: boolean;
  customPrompts: string[];
  targetKeywords: string[];
  avoidKeywords: string[];
}

const BotConfigurationStep = ({ onNext, loading = false, analysisData }: BotConfigurationStepProps) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<BotConfig>({
    maxActionsPerHour: 10,
    dailyFollowLimit: 50,
    enableAutoFollow: true,
    enableAutoLike: true,
    enableAutoRetweet: false,
    enableAutoReply: false,
    customPrompts: [],
    targetKeywords: [],
    avoidKeywords: ['spam', 'bot', 'fake']
  });
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  // Configure bot based on analysis data
  useEffect(() => {
    if (analysisData) {
      const nicheConfigs = {
        crypto: {
          maxActionsPerHour: 15,
          dailyFollowLimit: 75,
          targetKeywords: ['crypto', 'bitcoin', 'ethereum', 'defi', 'nft'],
          avoidKeywords: ['scam', 'pump', 'moon', 'rugpull']
        },
        fitness: {
          maxActionsPerHour: 12,
          dailyFollowLimit: 60,
          targetKeywords: ['fitness', 'workout', 'gym', 'health', 'nutrition'],
          avoidKeywords: ['injured', 'pain', 'medical']
        },
        tech: {
          maxActionsPerHour: 20,
          dailyFollowLimit: 100,
          targetKeywords: ['tech', 'programming', 'ai', 'startup', 'coding'],
          avoidKeywords: ['bug', 'broken', 'error']
        },
        marketing: {
          maxActionsPerHour: 18,
          dailyFollowLimit: 80,
          targetKeywords: ['marketing', 'growth', 'sales', 'business', 'entrepreneur'],
          avoidKeywords: ['spam', 'fake', 'scam']
        }
      };

      const nicheConfig = nicheConfigs[analysisData.niche as keyof typeof nicheConfigs];
      if (nicheConfig) {
        setConfig(prev => ({
          ...prev,
          ...nicheConfig
        }));
      }

      // Set generated prompts if available
      if (analysisData.generated_prompts) {
        setConfig(prev => ({
          ...prev,
          customPrompts: analysisData.generated_prompts
        }));
      }
    }
  }, [analysisData]);

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

  const getNicheRecommendations = () => {
    if (!analysisData?.niche) return null;

    const recommendations = {
      crypto: {
        title: "Crypto Trading Recommendations",
        tips: [
          "Focus on educational content and market analysis",
          "Engage with established crypto influencers",
          "Share market insights and trading experiences",
          "Be cautious with financial advice compliance"
        ]
      },
      fitness: {
        title: "Fitness Community Recommendations",
        tips: [
          "Share workout routines and progress updates",
          "Engage with fitness motivation content",
          "Connect with gym and health enthusiasts",
          "Promote healthy lifestyle choices"
        ]
      },
      tech: {
        title: "Tech Professional Recommendations",
        tips: [
          "Share technical insights and tutorials",
          "Engage with developer communities",
          "Discuss latest technology trends",
          "Network with industry professionals"
        ]
      },
      marketing: {
        title: "Marketing Expert Recommendations",
        tips: [
          "Share growth strategies and case studies",
          "Engage with business content",
          "Connect with entrepreneurs and marketers",
          "Provide valuable marketing insights"
        ]
      }
    };

    return recommendations[analysisData.niche as keyof typeof recommendations];
  };

  const recommendations = getNicheRecommendations();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Configure Your Bot</h2>
        <p className="text-muted-foreground">
          Settings optimized for your {analysisData?.niche || 'general'} account
        </p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Bot Settings</TabsTrigger>
          <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
          <TabsTrigger value="recommendations">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Activity Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Activity Limits
                </CardTitle>
                <CardDescription>
                  Control how active your bot is to maintain natural behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="actionsPerHour">Actions per hour</Label>
                  <Input
                    id="actionsPerHour"
                    type="number"
                    value={config.maxActionsPerHour}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      maxActionsPerHour: parseInt(e.target.value) || 10 
                    }))}
                    min="1"
                    max="50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 10-20 for natural activity
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily follow limit</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={config.dailyFollowLimit}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      dailyFollowLimit: parseInt(e.target.value) || 50 
                    }))}
                    min="1"
                    max="200"
                  />
                  <p className="text-xs text-muted-foreground">
                    Twitter limits: Stay under 100 follows per day
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bot Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-green-500" />
                  Bot Actions
                </CardTitle>
                <CardDescription>
                  Choose which actions your bot can perform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Follow</Label>
                    <p className="text-xs text-muted-foreground">
                      Follow relevant accounts automatically
                    </p>
                  </div>
                  <Switch
                    checked={config.enableAutoFollow}
                    onCheckedChange={(checked) => setConfig(prev => ({ 
                      ...prev, 
                      enableAutoFollow: checked 
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Like</Label>
                    <p className="text-xs text-muted-foreground">
                      Like posts that match your interests
                    </p>
                  </div>
                  <Switch
                    checked={config.enableAutoLike}
                    onCheckedChange={(checked) => setConfig(prev => ({ 
                      ...prev, 
                      enableAutoLike: checked 
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Retweet</Label>
                    <p className="text-xs text-muted-foreground">
                      Retweet high-quality content
                    </p>
                  </div>
                  <Switch
                    checked={config.enableAutoRetweet}
                    onCheckedChange={(checked) => setConfig(prev => ({ 
                      ...prev, 
                      enableAutoRetweet: checked 
                    }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Reply</Label>
                    <p className="text-xs text-muted-foreground">
                      Reply to mentions and comments
                    </p>
                  </div>
                  <Switch
                    checked={config.enableAutoReply}
                    onCheckedChange={(checked) => setConfig(prev => ({ 
                      ...prev, 
                      enableAutoReply: checked 
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Target Keywords
              </CardTitle>
              <CardDescription>
                Keywords your bot will look for when engaging with content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Target Keywords (comma separated)</Label>
                <Input
                  value={config.targetKeywords.join(', ')}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    targetKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
                  }))}
                  placeholder="crypto, bitcoin, trading..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Avoid Keywords (comma separated)</Label>
                <Input
                  value={config.avoidKeywords.join(', ')}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    avoidKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) 
                  }))}
                  placeholder="spam, scam, fake..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                AI-Generated Prompts
              </CardTitle>
              <CardDescription>
                Personalized prompts based on your account analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {config.customPrompts.length > 0 ? (
                <div className="space-y-4">
                  {config.customPrompts.map((prompt, index) => (
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
                      <p className="text-sm">{prompt}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No custom prompts generated yet.</p>
                  <p className="text-xs">Complete account analysis to get personalized prompts.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {recommendations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  {recommendations.title}
                </CardTitle>
                <CardDescription>
                  Best practices for your {analysisData?.niche} account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>General Guidelines</CardTitle>
              <CardDescription>
                Universal best practices for Twitter bot automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                    Stay Within Twitter Limits
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Keep actions per hour low and respect daily limits to avoid account restrictions.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                    Quality Over Quantity
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Focus on meaningful engagements rather than maximum activity.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">
                    Monitor Performance
                  </h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Regularly check your bot's activity and adjust settings as needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={onNext} size="lg" disabled={loading}>
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

export default BotConfigurationStep;