import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, MessageSquare, Clock } from "lucide-react";
import { botManager, type BotStatus } from "@/lib/botManager";

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

const BotStatistics = () => {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: "Actions Today",
      value: "0",
      icon: <TrendingUp className="w-4 h-4" />,
      description: "Total bot actions performed today"
    },
    {
      title: "Follows Today", 
      value: "0",
      icon: <Users className="w-4 h-4" />,
      description: "New accounts followed today"
    },
    {
      title: "Replies Today",
      value: "0", 
      icon: <MessageSquare className="w-4 h-4" />,
      description: "Replies sent today"
    },
    {
      title: "Bot Uptime",
      value: "0m",
      icon: <Clock className="w-4 h-4" />,
      description: "Current session uptime"
    }
  ]);

  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const status = await botManager.getBotStatus();
      
      if (status) {
        // Simulate stats - in real implementation these would come from your backend
        const actionsToday = Math.floor(Math.random() * 50);
        const followsToday = Math.floor(Math.random() * 10);
        const repliesToday = Math.floor(Math.random() * 20);
        
        const formatUptime = (seconds?: number) => {
          if (!seconds) return "0m";
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          if (hours > 0) {
            return `${hours}h ${minutes}m`;
          }
          return `${minutes}m`;
        };

        setStats([
          {
            title: "Actions Today",
            value: actionsToday.toString(),
            icon: <TrendingUp className="w-4 h-4" />,
            description: "Total bot actions performed today"
          },
          {
            title: "Follows Today",
            value: followsToday.toString(),
            icon: <Users className="w-4 h-4" />,
            description: "New accounts followed today"
          },
          {
            title: "Replies Today",
            value: repliesToday.toString(),
            icon: <MessageSquare className="w-4 h-4" />,
            description: "Replies sent today"
          },
          {
            title: "Bot Uptime",
            value: formatUptime(status.uptime),
            icon: <Clock className="w-4 h-4" />,
            description: "Current session uptime"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Statistics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-card/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </span>
                {stat.icon}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {loading ? "..." : stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BotStatistics;