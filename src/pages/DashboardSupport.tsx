import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  Settings,
  Send
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const DashboardSupport = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [botStatus, setBotStatus] = useState<'checking' | 'healthy' | 'issues'>('healthy');

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How does the bot work?",
      answer: "Our AI-powered bot automatically engages with your Twitter audience by liking relevant tweets, following users in your niche, and replying to conversations. It uses advanced machine learning to understand your brand voice and target the right audience.",
      category: "General"
    },
    {
      id: 2,
      question: "What are the daily limits?",
      answer: "Daily limits vary by plan: Starter (30 replies/day), Pro (70 replies/day), Custom (unlimited). Actions include likes, follows, and replies. These limits help maintain healthy engagement patterns and comply with Twitter's guidelines.",
      category: "Limits"
    },
    {
      id: 3,
      question: "How do I connect my Twitter account?",
      answer: "Go to Settings > Twitter Connection and click 'Connect Twitter'. You'll be redirected to Twitter to authorize our app. Once connected, your bot will start working automatically based on your plan settings. You can also follow our onboarding guide.",
      category: "Setup"
    },
    {
      id: 4,
      question: "Is my account safe?",
      answer: "Absolutely! We use OAuth for secure authentication and never store your Twitter password. Our bot follows Twitter's API guidelines and rate limits to ensure your account remains in good standing. We also use enterprise-grade encryption for all data.",
      category: "Security"
    },
    {
      id: 5,
      question: "Can I customize what the bot does?",
      answer: "Yes! While we've simplified the interface, you can still influence your bot's behavior through your engagement patterns. The AI learns from your preferences and adapts over time. Enterprise users get access to custom prompts and advanced settings.",
      category: "Customization"
    },
    {
      id: 6,
      question: "How quickly will I see results?",
      answer: "Most users see increased engagement within 24-48 hours. Follower growth typically becomes noticeable within a week of consistent bot activity. Results depend on your niche, content quality, and plan level.",
      category: "Results"
    }
  ];

  const handleBotCheck = () => {
    setBotStatus('checking');
    // Simulate bot health check
    setTimeout(() => {
      setBotStatus('healthy');
    }, 2000);
  };

  const getBotStatusInfo = () => {
    switch (botStatus) {
      case 'checking':
        return {
          icon: <Clock className="w-5 h-5 text-warning animate-spin" />,
          text: "Checking bot status...",
          badge: "Checking",
          color: "secondary"
        };
      case 'healthy':
        return {
          icon: <CheckCircle className="w-5 h-5 text-success" />,
          text: "Your bot is working perfectly!",
          badge: "Healthy",
          color: "default"
        };
      case 'issues':
        return {
          icon: <AlertCircle className="w-5 h-5 text-destructive" />,
          text: "We detected some issues with your bot",
          badge: "Issues Found",
          color: "destructive"
        };
      default:
        return {
          icon: <CheckCircle className="w-5 h-5 text-success" />,
          text: "Your bot is working perfectly!",
          badge: "Healthy",
          color: "default"
        };
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Support Center</h1>
          <p className="text-muted-foreground">Get help and find answers to common questions</p>
        </div>

        {/* Bot Status Check */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Bot Health Check</h2>
            <Button 
              onClick={handleBotCheck}
              disabled={botStatus === 'checking'}
              variant="outline"
            >
              {botStatus === 'checking' ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Run Diagnosis
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            {getBotStatusInfo().icon}
            <div className="flex-1">
              <p className="text-foreground font-medium">{getBotStatusInfo().text}</p>
              <p className="text-sm text-muted-foreground">Last checked: 2 minutes ago</p>
            </div>
            <Badge variant={getBotStatusInfo().color as any}>
              {getBotStatusInfo().badge}
            </Badge>
          </div>
        </Card>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Email Support</h3>
                <p className="text-sm text-muted-foreground">Send us a detailed message</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              We respond within 2 hours during business hours
            </p>
            <Button 
              className="w-full"
              onClick={() => window.location.href = '/contact'}
            >
              Send Email
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#0088cc]/20 rounded-full">
                <Send className="w-6 h-6 text-[#0088cc]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Telegram Support</h3>
                <p className="text-sm text-muted-foreground">Join our community for quick help</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Get instant answers from our team and community
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open('https://t.me/CostrasAI', '_blank')}
            >
              Join Telegram
            </Button>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq) => (
              <Collapsible
                key={faq.id}
                open={openFAQ === faq.id}
                onOpenChange={(open) => setOpenFAQ(open ? faq.id : null)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/30 rounded-lg transition-colors">
                    <div className="flex items-center gap-3 text-left">
                      <Badge variant="outline" className="text-xs">
                        {faq.category}
                      </Badge>
                      <span className="font-medium text-foreground">{faq.question}</span>
                    </div>
                    {openFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pt-3 text-muted-foreground">
                    {faq.answer}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = '/dashboard/settings'}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Account Settings</p>
                <p className="text-xs text-muted-foreground">Manage your account</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = '/privacy'}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Privacy Policy</p>
                <p className="text-xs text-muted-foreground">Learn about data protection</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = '/onboarding'}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Getting Started</p>
                <p className="text-xs text-muted-foreground">Setup guide</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSupport;