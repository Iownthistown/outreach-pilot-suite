import { Card } from "@/components/ui/card";
import { 
  Heart, 
  UserPlus, 
  MessageCircle,
  Clock
} from "lucide-react";

interface ActivityItem {
  id: number;
  type: 'like' | 'follow' | 'reply';
  message: string;
  time: string;
  user?: string;
}

interface RecentActivityProps {
  activities?: Array<{
    id: number;
    type: 'like' | 'follow' | 'reply';
    message: string;
    time: string;
    user?: string;
  }>;
  loading?: boolean;
}

const RecentActivity = ({ activities = [], loading = false }: RecentActivityProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'reply':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-start gap-3 p-3 animate-pulse">
          <div className="w-8 h-8 bg-muted/40 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted/40 rounded w-3/4" />
            <div className="h-3 bg-muted/40 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="p-6 bg-card border-primary/20 transition-all duration-300 hover:shadow-lg hover:border-primary/40">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${loading ? 'bg-warning animate-pulse' : 'bg-success'}`} />
          <div className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : 'Last 24 hours'}
          </div>
        </div>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loading ? (
          <LoadingSkeleton />
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-3 p-3 hover:bg-muted/20 rounded-lg transition-colors"
            >
              <div className="p-2 bg-muted/20 rounded-full mt-0.5 flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.message}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Your bot activity will appear here</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentActivity;