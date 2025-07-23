import { Button } from "@/components/ui/button";
import { Chrome, Download, Shield, Lock } from "lucide-react";

interface ChromeExtensionStepProps {
  onNext: () => void;
}

const ChromeExtensionStep = ({ onNext }: ChromeExtensionStepProps) => {
  return (
    <div className="text-center space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500/10 to-yellow-500/10 rounded-full flex items-center justify-center">
          <Chrome className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Download the Chrome Extension
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          The Qura Chrome extension is your gateway to AI-powered social media enhancement. It seamlessly integrates with your browser for instant access to all features.
        </p>
      </div>

      {/* Features */}
      <div className="bg-gradient-card/50 rounded-xl p-6 border border-border/50">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-foreground">Secure & Private</h4>
              <p className="text-sm text-muted-foreground">Your data stays safe with end-to-end encryption</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-foreground">Privacy First</h4>
              <p className="text-sm text-muted-foreground">We never access your personal information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Steps */}
      <div className="bg-muted/20 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Quick Installation:</h3>
        <div className="space-y-3 text-sm text-left">
          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">1</span>
            <span className="text-muted-foreground">Click "Add to Chrome" below</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">2</span>
            <span className="text-muted-foreground">Confirm installation in the popup</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">3</span>
            <span className="text-muted-foreground">Pin the extension for easy access</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-4">
        <Button
          onClick={() => {
            window.open('https://chromewebstore.google.com/detail/twitter-bot-connector/mnegdfmbhfmahjhhgibhpabkmobleikk', '_blank');
            onNext();
          }}
          size="lg"
          className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 rounded-xl"
        >
          <Chrome className="w-5 h-5 mr-2" />
          Add to Chrome
        </Button>
        <p className="text-xs text-muted-foreground">
          Free extension • No subscription required
        </p>
      </div>
    </div>
  );
};

export default ChromeExtensionStep;