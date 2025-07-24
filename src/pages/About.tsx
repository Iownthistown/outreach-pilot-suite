import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About COSTRAS
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Revolutionizing Twitter/X engagement through intelligent automation and authentic interactions
            </p>
          </div>

          {/* Content */}
          <div className="bg-card border border-primary/20 rounded-2xl p-8 shadow-card backdrop-blur-sm mb-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  COSTRAS was built to solve a fundamental problem: how to maintain meaningful engagement on Twitter/X while scaling your presence. We believe that automation should enhance human connection, not replace it.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">What We Do</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our AI-powered platform enables professionals, entrepreneurs, and companies to automate their Twitter/X interactions while preserving their unique voice and authentic relationships. From intelligent replies to strategic engagement, COSTRAS handles the repetitive tasks so you can focus on creating meaningful content.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose COSTRAS</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Intelligent Automation</h3>
                    <p className="text-muted-foreground">Advanced AI that understands context and maintains your personal brand voice.</p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Authentic Engagement</h3>
                    <p className="text-muted-foreground">Build genuine relationships through meaningful interactions, not generic responses.</p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Time Freedom</h3>
                    <p className="text-muted-foreground">Reclaim hours of your day while maintaining consistent Twitter/X presence.</p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Growth Focus</h3>
                    <p className="text-muted-foreground">Scale your influence and reach without compromising on quality.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/signup">
              <Button size="lg" className="px-8 py-3 text-lg">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;