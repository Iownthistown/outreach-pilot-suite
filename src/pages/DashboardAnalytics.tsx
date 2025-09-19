import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  TrendingUp,
  Users,
  MessageSquare,
  Heart,
  UserPlus,
  Eye,
  AlertTriangle,
  Zap,
  Clock,
  Download,
  RefreshCw,
  CheckCircle,
  X,
  Loader2,
  BotOff
} from "lucide-react";
import { apiService, handleApiError, type AnalyticsData } from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";

const DashboardAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { toast } = useToast();

  const fetchAnalyticsData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setRefreshing(!showLoading);
    setError(null);

    try {
      const data = await apiService.getAnalyticsData();
      setAnalyticsData(data);
    } catch (err: any) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      
      toast({
        title: "Failed to load analytics",
        description: errorMessage,
        variant: "destructive",
      });

      // Set empty state data for stopped bot
      setAnalyticsData({
        bot_performance: {
          status: 'stopped',
          uptime: '0%',
          actions_today: 0,
          success_rate: '0%',
          avg_response_time: '0s',
          errors: 0
        },
        engagement_metrics: {
          engagement_rate: '0%',
          follower_growth: 0,
          follower_growth_rate: '0%',
          actions_trend: 'neutral',
          engagement_trend: 'neutral'
        },
        recent_actions: [],
        trends: {
          actions_trend: 'neutral',
          success_rate_trend: 'neutral',
          best_hour: 'N/A'
        },
        insights: {
          recommendation: 'Connect your Twitter account and start the bot to see analytics data.',
          warning: 'Bot is not currently running'
        }
      });
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'reply': return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'view': return <Eye className="w-4 h-4 text-purple-500" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'failed': return <X className="w-4 h-4 text-destructive" />;
      case 'pending': return <Loader2 className="w-4 h-4 text-warning animate-spin" />;
      default: return null;
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const filteredActivities = analyticsData?.recent_actions?.filter(activity => 
    selectedFilter === 'all' || activity.action === selectedFilter
  ) || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Detailed performance metrics and activity logs</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchAnalyticsData(false)}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Error Alert - Removed to prevent showing API connection errors */}

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            {/* Bot Status Card */}
            {analyticsData?.bot_performance.status === 'stopped' && (
              <Card className="p-6 border-warning bg-warning/5">
                <div className="flex items-center gap-4">
                  <BotOff className="w-8 h-8 text-warning" />
                  <div>
                    <h3 className="font-semibold text-warning">Bot Not Running</h3>
                    <p className="text-sm text-muted-foreground">Connect your Twitter account and start the bot to see performance metrics.</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Performance Metrics */}
            {analyticsData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Actions Today</p>
                      <p className="text-2xl font-bold">{analyticsData.bot_performance.actions_today}</p>
                    </div>
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold text-success">{analyticsData.bot_performance.success_rate}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-success" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Response Time</p>
                      <p className="text-2xl font-bold">{analyticsData.bot_performance.avg_response_time}</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Errors</p>
                      <p className="text-2xl font-bold text-destructive">{analyticsData.bot_performance.errors}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                      <p className="text-2xl font-bold text-success">{analyticsData.bot_performance.uptime}</p>
                    </div>
                    <Activity className="w-8 h-8 text-success" />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Best Hour</p>
                      <p className="text-lg font-semibold">{analyticsData.trends.best_hour}</p>
                    </div>
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Activity Filter */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'like', 'follow', 'reply', 'view'].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>

            {/* Activity List */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <BotOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {analyticsData?.bot_performance.status === 'stopped' 
                        ? 'No recent activity. Start the bot to see analytics.' 
                        : 'No recent activity matching the selected filter.'}
                    </p>
                  </div>
                ) : (
                  filteredActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border border-muted/20 rounded-lg">
                      <div className="p-2 bg-muted/20 rounded-full">
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">
                            Bot {activity.action}d {activity.target}
                          </p>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(activity.status)}
                            <Badge variant={
                              activity.status === 'success' ? 'default' :
                              activity.status === 'failed' ? 'destructive' : 'secondary'
                            }>
                              {activity.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 italic">
                          "{activity.tweet_content.substring(0, 100)}..."
                        </p>
                        {activity.reply_content && (
                          <p className="text-sm text-foreground mb-2 bg-muted/20 p-2 rounded">
                            Reply: "{activity.reply_content}"
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-success">Recommendations</h3>
                <p className="text-muted-foreground">
                  {analyticsData?.insights.recommendation || 'No recommendations available.'}
                </p>
              </Card>
              {analyticsData?.insights.warning && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-warning">Warnings</h3>
                  <p className="text-muted-foreground">
                    {analyticsData.insights.warning}
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DashboardAnalytics;