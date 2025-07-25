import { Card } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  Zap,
  AlertTriangle
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-primary/10 text-primary',
    green: 'bg-success/10 text-success',
    orange: 'bg-warning/10 text-warning',
    red: 'bg-destructive/10 text-destructive'
  };

  return (
    <Card className="p-6 bg-gradient-card border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/40">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className="text-sm text-success mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-4 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

interface SimpleStatsProps {
  stats?: {
    actions_today: number;
    new_followers: number;
    engagement_rate: number;
    errors: number;
    actions_trend?: string;
    followers_trend?: string;
    engagement_trend?: string;
  };
  loading?: boolean;
}

const SimpleStats = ({ stats, loading = false }: SimpleStatsProps) => {
  // Default stats if none provided
  const defaultStats = {
    actions_today: 0,
    new_followers: 0,
    engagement_rate: 0,
    errors: 0,
    actions_trend: '',
    followers_trend: '',
    engagement_trend: '',
  };

  const currentStats = stats || defaultStats;

  const statsData = [
    {
      title: "Actions Today",
      value: loading ? "..." : currentStats.actions_today.toString(),
      icon: Zap,
      trend: currentStats.actions_trend,
      color: 'green' as const
    },
    {
      title: "New Followers",
      value: loading ? "..." : currentStats.new_followers.toString(),
      icon: Users,
      trend: currentStats.followers_trend,
      color: 'blue' as const
    },
    {
      title: "Engagement Rate",
      value: loading ? "..." : `${currentStats.engagement_rate}%`,
      icon: TrendingUp,
      trend: currentStats.engagement_trend,
      color: 'green' as const
    },
    {
      title: "Errors",
      value: loading ? "..." : currentStats.errors.toString(),
      icon: AlertTriangle,
      color: currentStats.errors === 0 ? 'green' as const : 'red' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <StatCard 
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default SimpleStats;