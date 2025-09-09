import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

// AI-powered response function using OpenRouter with DeepSeek V3.1
const getBotResponse = async (userMessage: string): Promise<string> => {
  try {
    console.log('Sending message to chatbot:', userMessage);
    
    const { data, error } = await supabase.functions.invoke('costras-chatbot', {
      body: { message: userMessage }
    });

    console.log('Chatbot response:', { data, error });

    if (error) {
      console.error('Error calling chatbot function:', error);
      return "I'm having trouble processing your request right now. Please try again or contact support at costras.com.";
    }

    if (data?.error) {
      console.error('Error from chatbot function:', data.error);
      return "I'm having trouble processing your request right now. Please try again or contact support at costras.com.";
    }

    return data?.response || "I'm sorry, I didn't get a response. Please try again or contact support at costras.com.";
  } catch (error) {
    console.error('Error in getBotResponse:', error);
    return "I'm experiencing technical difficulties. Please try again or visit costras.com for support.";
  }
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
    const messageToSend = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponseText = await getBotResponse(messageToSend);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble right now. Please try again or visit costras.com for support.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-glow hover:shadow-button transition-all duration-300"
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