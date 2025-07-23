import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Loader2, Activity } from "lucide-react";
import { botManager, type BotStatus, type BotConfig } from "@/lib/botManager";
import { useToast } from "@/hooks/use-toast";

interface BotControlPanelProps {
  config: BotConfig;
}

const BotControlPanel = ({ config }: BotControlPanelProps) => {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<'start' | 'stop' | null>(null);
  const { toast } = useToast();

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const botStatus = await botManager.getBotStatus();
      setStatus(botStatus);
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleStartBot = async () => {
    setActionLoading('start');
    try {
      const result = await botManager.startBot(config);
      if (result.success) {
        toast({
          title: "Bot Started",
          description: "Your Twitter bot is now running!",
        });
        await fetchStatus();
      } else {
        toast({
          variant: "destructive",
          title: "Failed to Start Bot",
          description: result.message || "Unknown error occurred",
        });
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleStopBot = async () => {
    setActionLoading('stop');
    try {
      const result = await botManager.stopBot();
      if (result.success) {
        toast({
          title: "Bot Stopped",
          description: "Your Twitter bot has been stopped.",
        });
        await fetchStatus();
      } else {
        toast({
          variant: "destructive",
          title: "Failed to Stop Bot",
          description: result.message || "Unknown error occurred",
        });
      }
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = () => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    
    switch (status.status) {
      case 'running':
        return <Badge className="bg-green-500 hover:bg-green-600">Running</Badge>;
      case 'stopped':
        return <Badge variant="secondary">Stopped</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatUptime = (seconds?: number) => {
    if (!seconds) return "0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Bot Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Status:</span>
            {getStatusBadge()}
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          </div>
          {status?.uptime && (
            <div className="text-sm text-muted-foreground">
              Uptime: {formatUptime(status.uptime)}
            </div>
          )}
        </div>

        {status?.lastActivity && (
          <div className="text-sm text-muted-foreground">
            Last Activity: {new Date(status.lastActivity).toLocaleString()}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleStartBot}
            disabled={status?.status === 'running' || actionLoading !== null}
            className="flex-1"
            variant={status?.status === 'running' ? 'secondary' : 'default'}
          >
            {actionLoading === 'start' ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Start Bot
          </Button>
          
          <Button
            onClick={handleStopBot}
            disabled={status?.status !== 'running' || actionLoading !== null}
            variant="destructive"
            className="flex-1"
          >
            {actionLoading === 'stop' ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Square className="w-4 h-4 mr-2" />
            )}
            Stop Bot
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotControlPanel;