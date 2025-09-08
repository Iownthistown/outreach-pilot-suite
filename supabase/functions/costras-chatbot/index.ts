import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const COSTRAS_KNOWLEDGE = `
# COSTRAS.COM CHATBOT KNOWLEDGE BASE

## BUSINESS OVERVIEW
Business Name: Costras
Website: https://www.costras.com
About: Costras is an innovative AI-powered Twitter (X) outreach automation platform that helps users generate leads and engage prospects 24/7 with human-like interactions.

## CORE PRODUCTS & SERVICES

### AI-Powered Twitter Outreach Automation
• 24/7 Lead Generation: Automated Twitter engagement that runs around the clock
• Human-like Interactions: AI-generated responses that sound natural and authentic
• Multi-Account Support: Handle multiple Twitter accounts with different niches
• Stealth Technology: Advanced anti-detection mechanisms to avoid suspension

### Advanced AI Account Analysis
• 5 AI Models: GPT-5, Grok-4, Llama-4-Maverick, Gemini-2.5-Pro, Llama-3.3-70b
• Niche Detection: Automatically identifies account niches (crypto, fitness, tech, marketing, etc.)
• Personality Profiling: Analyzes communication style and engagement patterns
• Content Analysis: Studies posting patterns and engagement triggers
• Custom Prompt Generation: Creates personalized prompts for each account

### Chrome Extension Integration
• Seamless Setup: Easy installation and connection to Twitter accounts
• Real-time Monitoring: Live status updates and performance tracking
• Secure Authentication: Safe and encrypted connection to your accounts
• Profile Management: Automatic extraction of account information

## SUPPORTED NICHES
• Crypto/Trading: Bitcoin, blockchain, DeFi, NFT analysis
• Fitness/Health: Workout motivation, nutrition tips, progress tracking
• Technology/Development: Programming insights, software development, AI discussions
• Marketing/Business: Growth strategies, entrepreneurship, startup advice
• Finance/Investment: Market analysis, investment strategies, financial planning
• Lifestyle/Wellness: Daily routines, wellness tips, life optimization
• OnlyFans/Content Creation: Content strategy, audience engagement, monetization
• Coffee/Barista: Coffee culture, brewing techniques, cafe business

## KEY FEATURES

### AI-Powered Analysis
• Automatically analyzes your Twitter account content and engagement patterns
• Detects your niche and creates specialized prompts for that industry
• Generates human-like responses that match your account's tone and style
• Continuously learns and improves based on engagement results

### 24/7 Automation
• Runs continuously to engage with prospects even when you're offline
• Generates leads around the clock, maximizing your business opportunities
• Maintains consistent engagement without manual intervention
• Optimizes timing for maximum response rates

### Multi-Account Management
• Handle multiple Twitter accounts with different niches
• Each account gets personalized analysis and prompts
• Separate tracking and analytics for each account
• Easy switching between different account strategies

### Advanced Security
• Enterprise-grade security with encrypted connections
• Chrome Web Store approved extension
• Secure authentication and data protection
• Anti-detection technology to prevent account suspension

## BUSINESS BENEFITS

### Time Savings
• Eliminates manual Twitter engagement work
• Frees up time for strategic business activities
• Automates repetitive tasks and follow-ups
• Reduces need for social media management

### Higher Conversion Rates
• AI-optimized responses for better engagement
• Niche-specific messaging that resonates with your audience
• Professional, human-like interactions
• Data-driven optimization for better results

### Professional Results
• Maintains consistent brand voice across all interactions
• Generates high-quality, relevant responses
• Avoids spam-like behavior with intelligent engagement
• Builds genuine connections with prospects

### Real-time Analytics
• Track performance and engagement metrics
• Monitor lead generation and conversion rates
• Analyze which strategies work best
• Optimize campaigns based on real data

## HOW IT WORKS

### Simple Setup Process
1. Install Chrome Extension
2. Connect your Twitter account
3. AI analyzes your account and niche
4. System generates personalized prompts
5. Automation begins with optimized engagement

### AI Analysis Process
• Scrapes your Twitter profile and recent content
• Analyzes your posting patterns and engagement style
• Identifies your niche and target audience
• Creates customized prompts for your specific industry
• Generates multiple response variations for testing

### Automation Features
• Intelligent following based on your niche
• Smart liking of relevant content
• Personalized replies to prospects
• Strategic engagement timing
• Continuous optimization based on results

## TROUBLESHOOTING GUIDES

### Dashboard Issues
If dashboard isn't loading:
• Clear browser cache and cookies
• Disable browser extensions temporarily
• Try incognito/private window
• Check internet connection
• Log out and log back in
• Contact support if issue persists

### Payment Issues
For payment problems:
• Check payment method validity and funds
• Verify billing information accuracy
• Try different payment method
• Check for bank restrictions
• Clear browser cache and retry
• Contact billing support with transaction details

### Extension Issues
For Chrome extension problems:
• Check if extension is enabled
• Disable and re-enable extension
• Remove and reinstall from Chrome Web Store
• Update Chrome browser
• Restart browser
• Use latest official version

### Login Issues
For authentication problems:
• Reset password
• Check caps lock
• Clear browser cache and cookies
• Disable browser extensions
• Try different browser
• Use 'Forgot Password' option

## VALUE PROPOSITION

### For Individual Users
• Save 10+ hours per week on Twitter engagement
• Generate more qualified leads automatically
• Maintain professional presence 24/7
• Focus on high-value business activities

### For Businesses
• Scale Twitter outreach without hiring staff
• Maintain consistent brand voice across accounts
• Generate leads outside business hours
• Track ROI with detailed analytics

### For Agencies
• Manage multiple client accounts efficiently
• Provide white-label Twitter automation services
• Scale operations without proportional cost increases
• Deliver consistent results for clients

## FREQUENTLY ASKED QUESTIONS

Q: What does Costras.com do?
A: Costras provides AI-powered Twitter outreach tools to automate replies, generate leads, and interact with potential customers in a natural, human-like way.

Q: How does the AI analysis work?
A: Our system analyzes your Twitter account content, posting patterns, and engagement style to identify your niche and create personalized prompts that sound like you.

Q: Is the outreach personalized?
A: Yes, all responses are powered by AI and crafted to mimic your natural tone and style, providing compelling and authentic conversations.

Q: Can Costras run 24/7?
A: Yes, the platform is designed to generate leads and automate replies around the clock without pause, maximizing your business opportunities.

Q: Does Costras replace manual Twitter work?
A: Costras greatly reduces the need for manual engagement, freeing up time and resources for more strategic work while maintaining professional results.

Q: What platforms does Costras work with?
A: The service currently specializes in Twitter (X) automation with plans for expansion to other social platforms.

Q: How secure is the platform?
A: Costras uses enterprise-grade security with encrypted connections, Chrome Web Store approved extension, and advanced anti-detection technology.

Q: Can I manage multiple accounts?
A: Yes, you can handle multiple Twitter accounts with different niches, each getting personalized analysis and prompts.

Q: What kind of results can I expect?
A: Users typically see 25% increase in reply engagement, 40% increase in follow success rates, and 30% increase in like-to-follow conversion.

Q: How do I get started?
A: Simply install the Chrome extension, connect your Twitter account, and let our AI analyze your account to begin automated engagement.
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    console.log('Received message:', message);

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1',
        messages: [
          {
            role: 'system',
            content: `You are a helpful customer support chatbot for Costras.com. Use the following knowledge base to answer questions accurately and helpfully. Always be friendly, expert, and clear about Costras's capabilities.

${COSTRAS_KNOWLEDGE}

Instructions:
• Always be friendly, expert, and clear about Costras's capabilities
• Emphasize the AI-powered nature and 24/7 automation features
• Highlight the human-like interactions and niche-specific optimization
• Mention the Chrome extension and seamless setup process
• For pricing, trials, or sign-up: direct users to the official Costras.com site
• When asked about technical details: suggest contacting support via official channels
• If questions go beyond Twitter/X automation: explain the platform's specialized focus
• If unsure about queries: offer to forward to human support
• Focus on business benefits and time savings rather than technical details
• Keep responses concise and helpful
• Always direct users to the website for detailed information and sign-up`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received:', data);
    
    const botResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: botResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in costras-chatbot function:', error);
    return new Response(JSON.stringify({ 
      error: 'Sorry, I encountered an error. Please try again or contact support at costras.com.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});