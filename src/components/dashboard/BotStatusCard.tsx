import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Moon, 
  Zap, 
  Clock,
  Loader2,
  Wifi,
  WifiOff
} from "lucide-react";

interface BotStatusCardProps {
  isActive: boolean;
  lastAction?: string;
  uptime?: number | string;
  isLoading?: boolean;
  isConnected?: boolean;
  analysisComplete?: boolean;
  onToggle?: () => void;
}

const BotStatusCard = ({ 
  isActive, 
  lastAction, 
  uptime, 
  isLoading = false,
  isConnected = true,
  analysisComplete = true,
  onToggle 
}: BotStatusCardProps) => {

  const formatUptime = (uptime: number | string): string => {
    if (typeof uptime === 'string') {
      return uptime;
    }
    
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusText = () => {
    if (!isConnected) return "Connection Error";
    return isActive ? "Your bot is working" : "Your bot is sleeping";
  };

  const getStatusDescription = () => {
    if (!isConnected) return "Check your internet connection and API status";
    if (!analysisComplete) return "Bot will be available once account analysis is complete";
    return isActive 
      ? "Actively engaging with your Twitter audience" 
      : "Ready to start when you are";
  };

  const getStatusIcon = () => {
    if (!isConnected) return <WifiOff className="w-12 h-12" />;
    return isActive ? <Zap className="w-12 h-12" /> : <Moon className="w-12 h-12" />;
  };

  const getStatusColor = () => {
    if (!isConnected) return 'bg-destructive/20 text-destructive';
    return isActive 
      ? 'bg-success/20 text-success animate-pulse' 
      : 'bg-muted/20 text-muted-foreground';
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-card to-card/80 border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/40">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Connection Status Indicator */}
        {!isConnected && (
          <div className="w-full p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <WifiOff className="w-4 h-4" />
              <span>API Connection Error</span>
            </div>
          </div>
        )}

        {/* Status Icon */}
        <div className={`p-6 rounded-full transition-all duration-500 ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>

        {/* Status Text */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {getStatusText()}
          </h3>
          <p className="text-muted-foreground">
            {getStatusDescription()}
          </p>
        </div>

        {/* Status Details */}
        {isActive && isConnected && (
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

        {/* Real-time Connection Indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
          <span>{isConnected ? 'Connected to API' : 'API Offline'}</span>
        </div>

        {/* Action Button */}
        <Button 
          onClick={onToggle}
          disabled={isLoading || !isConnected || (!analysisComplete && !isActive)}
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
              : analysisComplete
                ? "Wake Up Bot"
                : "Analysis Required"
          }
        </Button>
      </div>
    </Card>
  );
};

export default BotStatusCard;