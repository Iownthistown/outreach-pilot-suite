import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BotConfig } from "@/lib/botManager";

interface BotConfigurationProps {
  config: BotConfig;
  onConfigChange: (config: BotConfig) => void;
}

const BotConfiguration = ({ config, onConfigChange }: BotConfigurationProps) => {
  const [localConfig, setLocalConfig] = useState<BotConfig>(config);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      // Validate configuration
      if (localConfig.maxActionsPerHour < 1 || localConfig.maxActionsPerHour > 100) {
        throw new Error("Max actions per hour must be between 1 and 100");
      }
      if (localConfig.followLimit < 1 || localConfig.followLimit > 50) {
        throw new Error("Follow limit must be between 1 and 50");
      }
      if (!localConfig.aiApiKey.trim()) {
        throw new Error("AI API Key is required");
      }

      onConfigChange(localConfig);
      toast({
        title: "Configuration Saved",
        description: "Bot configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid Configuration",
        description: error instanceof Error ? error.message : "Please check your settings",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (field: keyof BotConfig, value: string | number) => {
    setLocalConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Bot Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxActions">Max Actions per Hour</Label>
            <Input
              id="maxActions"
              type="number"
              min="1"
              max="100"
              value={localConfig.maxActionsPerHour}
              onChange={(e) => updateConfig('maxActionsPerHour', parseInt(e.target.value) || 15)}
              placeholder="15"
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of actions the bot can perform per hour (1-100)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="followLimit">Daily Follow Limit</Label>
            <Input
              id="followLimit"
              type="number"
              min="1"
              max="50"
              value={localConfig.followLimit}
              onChange={(e) => updateConfig('followLimit', parseInt(e.target.value) || 5)}
              placeholder="5"
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of accounts to follow per day (1-50)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aiApiKey">AI API Key</Label>
          <Input
            id="aiApiKey"
            type="password"
            value={localConfig.aiApiKey}
            onChange={(e) => updateConfig('aiApiKey', e.target.value)}
            placeholder="Enter your AI API key"
          />
          <p className="text-xs text-muted-foreground">
            Your OpenAI or other AI service API key for generating responses
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customPrompt">Custom AI Prompt</Label>
          <Textarea
            id="customPrompt"
            value={localConfig.customPrompt}
            onChange={(e) => updateConfig('customPrompt', e.target.value)}
            placeholder="Enter custom instructions for the AI (optional)"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Custom instructions to guide the AI's behavior when interacting on Twitter
          </p>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full"
        >
          {saving ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BotConfiguration;