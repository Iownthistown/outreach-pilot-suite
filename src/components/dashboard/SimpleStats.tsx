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

const SimpleStats = () => {
  // Mock data - replace with real data from your API
  const stats = [
    {
      title: "Actions Today",
      value: "24",
      icon: Zap,
      trend: "+8 from yesterday",
      color: 'green' as const
    },
    {
      title: "New Followers",
      value: "12",
      icon: Users,
      trend: "+5 from yesterday",
      color: 'blue' as const
    },
    {
      title: "Engagement Rate",
      value: "78%",
      icon: TrendingUp,
      trend: "+3% from yesterday",
      color: 'green' as const
    },
    {
      title: "Errors",
      value: "0",
      icon: AlertTriangle,
      color: 'green' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
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