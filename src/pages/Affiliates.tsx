import { ArrowLeft, Clock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Affiliates = () => {
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
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Affiliate Program
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our affiliate program is currently in development and will be launching soon!
            </p>
          </div>

          {/* Content */}
          <div className="bg-card border border-primary/20 rounded-2xl p-8 shadow-card backdrop-blur-sm mb-12">
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Coming Soon</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We're working hard to create an amazing affiliate program that will allow you to earn by sharing COSTRAS with your network. Stay tuned for updates!
                </p>
              </div>

              <div className="bg-gradient-card/50 rounded-xl p-6 border border-border/50">
                <h3 className="font-semibold text-foreground mb-4">What to Expect:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Competitive commission rates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Easy-to-use tracking dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Marketing materials provided</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Dedicated affiliate support</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground mb-6">
                  Want to be notified when our affiliate program launches? Get in touch with us!
                </p>
                <Link to="/contact">
                  <Button size="lg" className="px-8 py-3 text-lg">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Affiliates;