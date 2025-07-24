import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Target,
  Plus,
  Activity,
  Calendar,
  Clock
} from "lucide-react";
import BotControlPanel from "./BotControlPanel";
import BotConfiguration from "./BotConfiguration";
import BotLogs from "./BotLogs";
import BotStatistics from "./BotStatistics";
import type { BotConfig } from "@/lib/botManager";
import { ScrollAnimationWrapper } from "@/hooks/useScrollAnimation";

const DashboardOverview = () => {
  // Bot configuration state
  const [botConfig, setBotConfig] = useState<BotConfig>({
    maxActionsPerHour: 15,
    followLimit: 5,
    aiApiKey: '',
    customPrompt: 'You are a helpful Twitter bot that engages authentically with users interested in our product. Be friendly, professional, and provide value in your responses.'
  });
  const stats = [
    {
      name: "Total Replies",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: MessageSquare,
    },
    {
      name: "Leads Generated",
      value: "87",
      change: "+23%",
      changeType: "positive",
      icon: Users,
    },
    {
      name: "Active Workflows",
      value: "5",
      change: "+2",
      changeType: "positive",
      icon: Target,
    },
    {
      name: "Engagement Rate",
      value: "78%",
      change: "+5%",
      changeType: "positive",
      icon: TrendingUp,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "reply",
      message: "Replied to @johndoe about SaaS pricing",
      time: "2 minutes ago",
      workflow: "Lead Generation"
    },
    {
      id: 2,
      type: "lead",
      message: "New lead: Sarah Chen showed interest",
      time: "15 minutes ago",
      workflow: "Product Mention"
    },
    {
      id: 3,
      type: "reply",
      message: "Replied to @techstartup about automation",
      time: "1 hour ago",
      workflow: "Customer Support"
    },
    {
      id: 4,
      type: "lead",
      message: "New lead: Mike Wilson requested demo",
      time: "2 hours ago",
      workflow: "Lead Generation"
    },
  ];

  const workflows = [
    {
      name: "Lead Generation",
      status: "Active",
      replies: 45,
      leads: 12,
      lastActive: "2 minutes ago"
    },
    {
      name: "Customer Support",
      status: "Active", 
      replies: 23,
      leads: 3,
      lastActive: "1 hour ago"
    },
    {
      name: "Product Mentions",
      status: "Paused",
      replies: 67,
      leads: 8,
      lastActive: "1 day ago"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <ScrollAnimationWrapper>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Welcome back, John!</h2>
            <p className="text-muted-foreground mt-1">Manage your Twitter bot and track your automation performance.</p>
          </div>
          <Button variant="hero" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Workflow
          </Button>
        </div>
      </ScrollAnimationWrapper>

      {/* Twitter Bot Management Section */}
      <ScrollAnimationWrapper delay={100}>
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-foreground">Twitter Bot Management</h3>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <BotControlPanel config={botConfig} />
            <BotStatistics />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <BotConfiguration 
              config={botConfig} 
              onConfigChange={setBotConfig} 
            />
            <BotLogs />
          </div>
        </div>
      </ScrollAnimationWrapper>

      {/* Stats Grid */}
      <ScrollAnimationWrapper delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name} className="p-6 bg-gradient-card border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.changeType === 'positive' ? 'text-success' : 'text-destructive'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollAnimationWrapper>

      <ScrollAnimationWrapper delay={300}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Workflows */}
          <Card className="p-6 bg-card border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Active Workflows</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {workflows.map((workflow, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-foreground">{workflow.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        workflow.status === 'Active' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {workflow.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{workflow.replies} replies</span>
                      <span>{workflow.leads} leads</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {workflow.lastActive}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 bg-card border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/40">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-muted/20 rounded-lg transition-colors">
                  <div className="p-2 bg-primary/10 rounded-full mt-0.5">
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{activity.workflow}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </ScrollAnimationWrapper>

      {/* Quick Actions */}
      <ScrollAnimationWrapper delay={400}>
        <Card className="p-6 bg-gradient-card border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/40">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Target className="w-6 h-6" />
              Create New Workflow
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="w-6 h-6" />
              View Leads
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="w-6 h-6" />
              Schedule Posts
            </Button>
          </div>
        </Card>
      </ScrollAnimationWrapper>
    </div>
  );
};

export default DashboardOverview;