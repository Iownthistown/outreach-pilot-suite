import { Button } from "@/components/ui/button";
import { Twitter, Shield, Zap, Loader2 } from "lucide-react";

interface ConnectTwitterStepProps {
  onNext: () => void;
  loading?: boolean;
}

const ConnectTwitterStep = ({ onNext, loading = false }: ConnectTwitterStepProps) => {
  return (
    <div className="text-center space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="mx-auto w-20 h-20 bg-[#1DA1F2]/10 rounded-full flex items-center justify-center">
          <Twitter className="w-10 h-10 text-[#1DA1F2]" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Let's connect your Twitter
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Connect your Twitter account to start creating AI-powered replies that boost engagement and grow your audience.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-6 my-8">
        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Instant Replies</h3>
          <p className="text-sm text-muted-foreground">
            Generate contextual responses in seconds
          </p>
        </div>
        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Secure & Private</h3>
          <p className="text-sm text-muted-foreground">
            Your data is encrypted and never shared
          </p>
        </div>
        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Twitter className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Grow Faster</h3>
          <p className="text-sm text-muted-foreground">
            Increase engagement and followers
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-4">
        <Button
          onClick={onNext}
          disabled={loading}
          size="lg"
          className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white border-0 disabled:opacity-50 transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Twitter className="w-5 h-5 mr-2" />
              Connect Twitter Account
            </>
          )}
        </Button>
        {loading && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground animate-pulse">
              Connecting to Twitter...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectTwitterStep;