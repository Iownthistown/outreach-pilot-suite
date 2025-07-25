import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Moon, 
  Zap, 
  Clock,
  Loader2
} from "lucide-react";
import { botManager } from "@/lib/botManager";
import { useToast } from "@/hooks/use-toast";

interface BotStatusCardProps {
  isActive: boolean;
  lastAction?: string;
  uptime?: number;
}

const BotStatusCard = ({ isActive: initialActive, lastAction, uptime }: BotStatusCardProps) => {
  const [isActive, setIsActive] = useState(initialActive);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleBotStatus = async () => {
    setIsLoading(true);
    try {
      if (isActive) {
        await botManager.stopBot();
        setIsActive(false);
        toast({
          title: "Bot paused",
          description: "Your bot is now sleeping",
        });
      } else {
        await botManager.startBot({
          maxActionsPerHour: 15,
          followLimit: 5,
          aiApiKey: '',
          customPrompt: ''
        });
        setIsActive(true);
        toast({
          title: "Bot activated",
          description: "Your bot is now working",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle bot status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-card to-card/80 border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/40">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Status Icon */}
        <div className={`p-6 rounded-full transition-all duration-500 ${
          isActive 
            ? 'bg-success/20 text-success animate-pulse' 
            : 'bg-muted/20 text-muted-foreground'
        }`}>
          {isActive ? (
            <Zap className="w-12 h-12" />
          ) : (
            <Moon className="w-12 h-12" />
          )}
        </div>

        {/* Status Text */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {isActive ? "Your bot is working" : "Your bot is sleeping"}
          </h3>
          <p className="text-muted-foreground">
            {isActive 
              ? "Actively engaging with your Twitter audience" 
              : "Ready to start when you are"
            }
          </p>
        </div>

        {/* Status Details */}
        {isActive && (
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {lastAction && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Last action: {lastAction}</span>
              </div>
            )}
            {uptime && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-success/20 text-success">
                  Uptime: {formatUptime(uptime)}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={handleToggleBotStatus}
          disabled={isLoading}
          size="lg"
          variant={isActive ? "outline" : "cta"}
          className={`px-8 py-3 text-lg transition-all duration-300 ${
            isActive 
              ? 'hover:bg-destructive hover:text-destructive-foreground hover:border-destructive' 
              : 'hover:scale-105'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : isActive ? (
            <Pause className="w-5 h-5 mr-2" />
          ) : (
            <Play className="w-5 h-5 mr-2" />
          )}
          {isLoading 
            ? "Processing..." 
            : isActive 
              ? "Pause Bot" 
              : "Wake Up Bot"
          }
        </Button>
      </div>
    </Card>
  );
};

export default BotStatusCard;