import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  UserPlus, 
  MessageCircle,
  Eye,
  Download,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface ActivityItem {
  id: number;
  type: 'like' | 'follow' | 'reply' | 'view';
  action: string;
  target: string;
  context: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

const DashboardActivity = () => {
  const [selectedFilter, setSelectedFilter] = useState('today');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with real API data
  const activities: ActivityItem[] = [
    {
      id: 1,
      type: "like",
      action: "Bot liked tweet from @johndoe",
      target: "@johndoe",
      context: "Amazing thread about AI automation tools! This is exactly what I needed for my startup...",
      timestamp: "2 hours ago",
      status: "success"
    },
    {
      id: 2,
      type: "follow",
      action: "Bot followed @sarahtech",
      target: "@sarahtech",
      context: "Tech entrepreneur sharing insights about SaaS growth and marketing strategies...",
      timestamp: "3 hours ago",
      status: "success"
    },
    {
      id: 3,
      type: "reply",
      action: "Bot replied to @techstartup",
      target: "@techstartup",
      context: "Looking for feedback on our new product launch. What features matter most to you?",
      timestamp: "5 hours ago",
      status: "pending"
    },
    {
      id: 4,
      type: "view",
      action: "Bot viewed profile @designpro",
      target: "@designpro",
      context: "UI/UX designer with 10+ years experience in mobile and web design...",
      timestamp: "6 hours ago",
      status: "success"
    },
    {
      id: 5,
      type: "like",
      action: "Bot liked tweet from @marketingguru",
      target: "@marketingguru",
      context: "5 essential marketing tips that every startup founder should know in 2024...",
      timestamp: "Yesterday at 4:30 PM",
      status: "failed"
    }
  ];

  const filters = [
    { id: 'today', label: 'Today' },
    { id: '7days', label: 'Last 7 days' },
    { id: '30days', label: 'Last 30 days' },
    { id: 'all', label: 'All time' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'reply':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'view':
        return <Eye className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <Loader2 className="w-4 h-4 text-warning animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const handleExport = () => {
    setIsLoading(true);
    // Simulate export delay
    setTimeout(() => {
      setIsLoading(false);
      // In real app, trigger download
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bot Activity Timeline</h1>
            <p className="text-muted-foreground">Track all your bot's actions and engagement</p>
          </div>
          <Button 
            onClick={handleExport}
            disabled={isLoading}
            variant="outline"
            className="self-start sm:self-auto"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download Report
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filter by:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.id)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Activity Timeline */}
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="p-3 bg-muted/20 rounded-full mt-1 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-1">{activity.action}</p>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {activity.context}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{activity.timestamp}</span>
                        </div>
                        <Badge 
                          variant={activity.status === 'success' ? 'default' : 
                                  activity.status === 'pending' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="flex-shrink-0">
                      {getStatusIcon(activity.status)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Activities
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardActivity;