import { Button } from "@/components/ui/button";
import { ArrowRight, Settings, Workflow, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorksSection = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      icon: Settings,
      title: "Configure Your Profile",
      description: "Quick setup in under a minute. We learn your style & audience",
      details: "Our intelligent system instantly analyzes your content and social presence to understand your unique voice, messaging style, and target demographics. Zero complex setup required."
    },
    {
      number: "2", 
      icon: Workflow,
      title: "Build Automation",
      description: "Select templates & activate",
      details: "Pick from proven automation templates or build custom flows. Define your engagement strategy, set response preferences, and let our AI execute your vision."
    },
    {
      number: "3",
      icon: BarChart,
      title: "Monitor Growth",
      description: "Scale your presence effortlessly",
      details: "A true hands-off solution. Quick initial configuration enables continuous brand growth on autopilot. Track performance and engagement insights from your dashboard."
    }
  ];

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            How COSTRAS Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Configure once, automate forever, and eliminate repetitive social tasks.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                </div>
                <p className="text-lg text-muted-foreground">{step.description}</p>
                <p className="text-foreground">{step.details}</p>
              </div>

              {/* Visual */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div className="bg-gradient-card border border-primary/20 rounded-2xl p-8 shadow-card transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/40 cursor-pointer group">
                  <div className="flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <step.icon className="w-12 h-12 text-primary-foreground" />
                    </div>
                  </div>
                  
                  {/* Mock interface based on step */}
                  <div className="mt-8">
                    {index === 0 && (
                      <div className="space-y-4">
                        <div className="bg-muted/30 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-primary rounded-full"></div>
                            <span className="text-foreground font-medium">Analyzing brand voice...</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full w-3/4"></div>
                            </div>
                            <p className="text-sm text-muted-foreground">Processing website content and social profiles</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {index === 1 && (
                      <div className="space-y-4">
                        <div className="bg-muted/30 rounded-lg p-4">
                          <p className="text-foreground font-medium mb-3">Workflow Templates</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-primary/10 rounded border border-primary/20">
                              <span className="text-sm text-foreground">Lead Generation</span>
                              <span className="text-xs text-primary">Active</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                              <span className="text-sm text-muted-foreground">Customer Support</span>
                              <span className="text-xs text-muted-foreground">Draft</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                              <span className="text-sm text-muted-foreground">Brand Mention</span>
                              <span className="text-xs text-muted-foreground">Draft</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {index === 2 && (
                      <div className="space-y-4">
                        <div className="bg-muted/30 rounded-lg p-4">
                          <p className="text-foreground font-medium mb-3">Live Results</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">47</p>
                              <p className="text-xs text-muted-foreground">Replies Today</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-success">12</p>
                              <p className="text-xs text-muted-foreground">Leads Generated</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="hero" size="lg" onClick={handleGetStarted} className="group">
            Get Started for Free Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;