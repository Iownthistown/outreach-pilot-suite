import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, RefreshCw } from "lucide-react";
import { botManager, type BotLog } from "@/lib/botManager";
import { Button } from "@/components/ui/button";

const BotLogs = () => {
  const [logs, setLogs] = useState<BotLog[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const botLogs = await botManager.getBotLogs();
      setLogs(botLogs);
      
      // Auto-scroll to bottom if enabled
      if (autoScroll && scrollAreaRef.current) {
        setTimeout(() => {
          scrollAreaRef.current?.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [autoScroll]);

  const getLevelBadge = (level: BotLog['level']) => {
    switch (level) {
      case 'ERROR':
        return <Badge variant="destructive">ERROR</Badge>;
      case 'WARNING':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">WARNING</Badge>;
      case 'INFO':
        return <Badge variant="secondary">INFO</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Live Activity Logs
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{logs.length} log entries</span>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded"
              />
              Auto-scroll
            </label>
          </div>
          
          <ScrollArea 
            className="h-[400px] w-full border rounded-md p-4"
            ref={scrollAreaRef}
          >
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {loading ? "Loading logs..." : "No logs available"}
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 p-3 border rounded-lg bg-card/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getLevelBadge(log.level)}
                        <span className="text-xs text-muted-foreground font-mono">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-mono leading-relaxed">
                      {log.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotLogs;