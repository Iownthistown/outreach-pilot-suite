import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Twitter, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/dashboard");
  };
  return <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_50%)] opacity-10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
                <Star className="w-4 h-4 text-primary fill-current" />
                <span className="text-foreground font-medium">#1 AI Social Media Automation</span>
              </div>

              {/* Main heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                  Automated Engagement For{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-primary animate-glow">Social Media </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Intelligent automation that creates natural interactions, maintains consistency, and amplifies your social presence effortlessly.
                </p>
              </div>

               {/* Benefits */}
               <div className="space-y-3">
                 <div className="flex items-center gap-3 text-foreground">
                   <TrendingUp className="w-5 h-5 text-success" />
                   <span>Amplify Reach: Maximize your social media impact</span>
                 </div>
                 <div className="flex items-center gap-3 text-foreground">
                   <Users className="w-5 h-5 text-success" />
                   <span>Effortless Management: Automate while you focus on growth</span>
                 </div>
                 <div className="flex items-center gap-3 text-foreground">
                   <Twitter className="w-5 h-5 text-success" />
                   <span>Build Community: Connect authentically across platforms</span>
                 </div>
               </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="hero" size="lg" onClick={handleGetStarted} className="group">
                    Get Started For FREE
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Watch Demo
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">No credit card required.</p>
              </div>
            </div>

            {/* Right side - Dashboard Preview */}
            <div className="relative">
              <div className="bg-card border border-primary/20 rounded-2xl p-6 shadow-card backdrop-blur-sm">
                {/* Mock Twitter interface */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Twitter className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Alex Johnson</p>
                      <p className="text-sm text-muted-foreground">@alexjohnson · 2h</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4 mb-4">
                    <p className="text-foreground">Just launched my new SaaS project! Any tips for getting the first customers?</p>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground text-sm font-bold">Y</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground mb-2">
                          Excellent point! Building a community first is key. I've found that authentic engagement with your ideal customers works wonders. 
                          There's a great automation tool I use that keeps me connected to these conversations. Would love to discuss further!
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="hover:text-foreground cursor-pointer">💬 Reply</span>
                          <span className="hover:text-foreground cursor-pointer">🔄 Retweet</span>
                          <span className="hover:text-foreground cursor-pointer">❤️ Like</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-primary">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span>AI-generated reply</span>
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -top-6 -right-6 bg-card border border-primary/20 rounded-xl p-4 shadow-card backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">25M+</p>
                  <p className="text-sm text-muted-foreground">Social Interactions</p>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-card border border-primary/20 rounded-xl p-4 shadow-card backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">75K+</p>
                  <p className="text-sm text-muted-foreground">Automated Responses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;