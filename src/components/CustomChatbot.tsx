import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const KNOWLEDGE_BASE = {
  // Core business info
  businessName: "Costras",
  website: "https://www.costras.com",
  description: "Costras is an innovative AI-powered Twitter (X) outreach automation platform that helps users generate leads and engage prospects 24/7 with human-like interactions.",
  
  // Key features
  features: [
    "24/7 Lead Generation: Automated Twitter engagement that runs around the clock",
    "Human-like Interactions: AI-generated responses that sound natural and authentic", 
    "Multi-Account Support: Handle multiple Twitter accounts with different niches",
    "Stealth Technology: Advanced anti-detection mechanisms to avoid suspension",
    "5 AI Models: GPT-5, Grok-4, Llama-4-Maverick, Gemini-2.5-Pro, Llama-3.3-70b",
    "Chrome Extension Integration: Seamless setup and connection to Twitter accounts"
  ],
  
  // Supported niches
  niches: [
    "Crypto/Trading", "Fitness/Health", "Technology/Development", "Marketing/Business",
    "Finance/Investment", "Lifestyle/Wellness", "OnlyFans/Content Creation", "Coffee/Barista"
  ],
  
  // Benefits
  benefits: [
    "Save 10+ hours per week on Twitter engagement",
    "Generate more qualified leads automatically", 
    "Maintain professional presence 24/7",
    "25% increase in reply engagement",
    "40% increase in follow success rates",
    "30% increase in like-to-follow conversion"
  ]
};

const getBotResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  // Greeting responses
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! I'm here to help you learn about Costras - your AI-powered Twitter outreach automation platform. How can I assist you today?";
  }
  
  // What is Costras
  if (message.includes('what is costras') || message.includes('what does costras do')) {
    return `${KNOWLEDGE_BASE.description}\n\nKey features include:\n• ${KNOWLEDGE_BASE.features.slice(0, 3).join('\n• ')}\n\nWould you like to know more about any specific feature?`;
  }
  
  // Features
  if (message.includes('feature') || message.includes('capabilities')) {
    return `Costras offers powerful features:\n\n• ${KNOWLEDGE_BASE.features.join('\n• ')}\n\nWhich feature interests you most?`;
  }
  
  // AI models
  if (message.includes('ai model') || message.includes('gpt') || message.includes('analysis')) {
    return "Costras uses 5 advanced AI models (GPT-5, Grok-4, Llama-4-Maverick, Gemini-2.5-Pro, Llama-3.3-70b) to:\n\n• Analyze your Twitter account and content\n• Detect your niche automatically\n• Create personalized prompts for your industry\n• Generate human-like responses that match your tone\n\nThis ensures authentic engagement that sounds like you!";
  }
  
  // Pricing/cost
  if (message.includes('price') || message.includes('cost') || message.includes('plan')) {
    return "For detailed pricing information and to explore our plans, please visit our official website at costras.com. You'll find comprehensive pricing options tailored to different needs!";
  }
  
  // How it works
  if (message.includes('how') && (message.includes('work') || message.includes('setup'))) {
    return "Getting started with Costras is simple:\n\n1. Install our Chrome extension\n2. Connect your Twitter account securely\n3. Our AI analyzes your account and niche\n4. System generates personalized prompts\n5. Automation begins with optimized engagement\n\nThe whole process takes just minutes to set up!";
  }
  
  // Niches
  if (message.includes('niche') || message.includes('industry')) {
    return `Costras supports 8 specialized niches:\n\n• ${KNOWLEDGE_BASE.niches.join('\n• ')}\n\nOur AI automatically detects your niche and creates custom prompts for maximum engagement in your specific industry.`;
  }
  
  // Results/benefits
  if (message.includes('result') || message.includes('benefit') || message.includes('save')) {
    return `Costras users typically see amazing results:\n\n• ${KNOWLEDGE_BASE.benefits.join('\n• ')}\n\nPlus, you'll free up time for strategic business activities while maintaining a professional 24/7 presence!`;
  }
  
  // Security
  if (message.includes('safe') || message.includes('secure') || message.includes('ban')) {
    return "Security is our top priority! Costras features:\n\n• Enterprise-grade security with encrypted connections\n• Chrome Web Store approved extension\n• Advanced anti-detection technology\n• Secure authentication and data protection\n\nOur stealth technology helps prevent account suspension while maintaining authentic engagement.";
  }
  
  // Chrome extension
  if (message.includes('chrome') || message.includes('extension') || message.includes('install')) {
    return "Our Chrome extension provides:\n\n• Seamless setup and Twitter account connection\n• Real-time monitoring and performance tracking\n• Secure authentication with encrypted connections\n• Automatic profile management and data extraction\n\nIt's available on the Chrome Web Store and installs in seconds!";
  }
  
  // Multiple accounts
  if (message.includes('multiple account') || message.includes('several account')) {
    return "Yes! Costras supports multiple Twitter accounts:\n\n• Handle different accounts with unique niches\n• Each account gets personalized analysis and prompts\n• Separate tracking and analytics for each account\n• Easy switching between different strategies\n\nPerfect for agencies or users managing multiple brands!";
  }
  
  // Contact/support
  if (message.includes('contact') || message.includes('support') || message.includes('help')) {
    return "For technical support or detailed questions, please:\n\n• Visit our website at costras.com\n• Use the official support channels\n• Contact our team for personalized assistance\n\nI'm here for general questions about Costras features and capabilities!";
  }
  
  // Default response
  return "I'm here to help you learn about Costras! You can ask me about:\n\n• How Costras works and its features\n• Supported niches and AI capabilities\n• Benefits and results you can expect\n• Security and setup process\n• Multi-account management\n\nFor detailed information, pricing, or to get started, visit costras.com. What would you like to know?";
};

export const CustomChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Costras AI assistant. I can help you learn about our Twitter automation platform. Ask me anything about features, benefits, or how it works!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-primary shadow-glow hover:shadow-button transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 bg-card border-border shadow-card animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-primary rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary-foreground" />
              <span className="font-semibold text-primary-foreground">Costras Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 h-64 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {message.isBot && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg text-sm whitespace-pre-line ${
                      message.isBot
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                  {!message.isBot && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Costras features..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};