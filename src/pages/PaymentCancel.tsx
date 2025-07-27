import { useNavigate } from "react-router-dom";
import { X, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PaymentCancel = () => {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate("/pricing");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full p-8 text-center bg-card border border-primary/20 shadow-xl">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <X className="w-10 h-10 text-destructive" />
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Betaling Geannuleerd
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Je betaling is geannuleerd. Geen zorgen, er is niets gefactureerd.
        </p>

        {/* Why Costras */}
        <div className="bg-background/50 rounded-lg p-6 mb-8 text-left">
          <h3 className="text-lg font-semibold text-foreground mb-4">Waarom Costras kiezen?</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Verhoog je Twitter engagement met AI</span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Automatiseer replies en likes intelligent</span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">7 dagen gratis proberen</span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">Cancel anytime, geen verborgen kosten</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="hero" 
            size="lg"
            onClick={handleRetryPayment}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Probeer Opnieuw
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/")}
          >
            Terug naar Home
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-primary/20">
          <p className="text-sm text-muted-foreground">
            Heb je vragen over onze pricing of features?
            <br />
            Neem contact met ons op via support@costras.com
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentCancel;