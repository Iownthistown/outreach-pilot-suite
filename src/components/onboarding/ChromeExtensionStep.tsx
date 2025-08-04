import { Button } from "@/components/ui/button";
import { Chrome, Shield, Lock, Loader2, CheckCircle, Twitter, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChromeExtensionStepProps {
  onNext: () => void;
  loading?: boolean;
  extensionInstalled?: boolean;
  twitterConnected?: boolean;
  onInstall?: () => void;
}

interface TwitterUser {
  username: string;
  displayName: string;
  profileImage: string;
}

const ChromeExtensionStep = ({ 
  onNext, 
  loading = false, 
  extensionInstalled = false,
  twitterConnected = false,
  onInstall 
}: ChromeExtensionStepProps) => {
  const [showDetecting, setShowDetecting] = useState(false);
  const [isWaitingForTwitter, setIsWaitingForTwitter] = useState(false);
  const [twitterUser, setTwitterUser] = useState<TwitterUser | null>(null);

  // Listen for Twitter connection events
  useEffect(() => {
    const handleTwitterConnected = (event: any) => {
      console.log('Twitter connected:', event.detail);
      const userData = event.detail;
      if (userData) {
        setTwitterUser({
          username: userData.username || userData.handle || 'user',
          displayName: userData.displayName || userData.name || userData.username || 'User',
          profileImage: userData.profileImage || userData.avatar || ''
        });
      }
      setIsWaitingForTwitter(false);
    };

    const handleConnectionSuccess = (event: any) => {
      console.log('Connection success:', event.detail);
      handleTwitterConnected(event);
    };

    window.addEventListener('costrasTwitterConnected', handleTwitterConnected);
    window.addEventListener('costrasConnectionSuccess', handleConnectionSuccess);

    // Check if already connected
    const isConnected = localStorage.getItem('costras_twitter_connected') === 'true';
    if (isConnected && !twitterUser) {
      // Try to get stored user data
      const storedUserData = localStorage.getItem('costras_twitter_user');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setTwitterUser({
            username: userData.username || userData.handle || 'user',
            displayName: userData.displayName || userData.name || userData.username || 'User',
            profileImage: userData.profileImage || userData.avatar || ''
          });
        } catch (e) {
          console.error('Failed to parse stored user data:', e);
        }
      }
    }

    return () => {
      window.removeEventListener('costrasTwitterConnected', handleTwitterConnected);
      window.removeEventListener('costrasConnectionSuccess', handleConnectionSuccess);
    };
  }, [twitterUser]);

  useEffect(() => {
    if (loading) {
      setShowDetecting(true);
    }
  }, [loading]);

  // Automatically start waiting for Twitter connection when extension is installed
  useEffect(() => {
    if (extensionInstalled && !twitterConnected && !isWaitingForTwitter) {
      setIsWaitingForTwitter(true);
    }
  }, [extensionInstalled, twitterConnected, isWaitingForTwitter]);
  // Determine which phase to show
  const showTwitterPhase = extensionInstalled || isWaitingForTwitter;
  const isTwitterConnected = twitterConnected || !!twitterUser;

  return (
    <div className="text-center space-y-8">
      {/* Header - Phase 1: Extension Download */}
      {!showTwitterPhase && (
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500/10 to-yellow-500/10 rounded-full flex items-center justify-center">
            <Chrome className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Download the Chrome Extension
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            The COSTRAS Chrome extension is your gateway to AI-powered Twitter/X enhancement. It seamlessly integrates with your browser for instant access to all features.
          </p>
        </div>
      )}

      {/* Header - Phase 2: Twitter Connection */}
      {showTwitterPhase && !isTwitterConnected && (
        <div className="space-y-4 animate-fade-in">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full flex items-center justify-center">
            <Twitter className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Connect Your Twitter Account
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Now that the extension is installed, connect your Twitter/X account to start using AI-powered automation.
          </p>
        </div>
      )}

      {/* Header - Phase 2: Success State */}
      {showTwitterPhase && isTwitterConnected && twitterUser && (
        <div className="space-y-4 animate-fade-in">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Account Connected Successfully!
          </h1>
          <div className="flex items-center justify-center space-x-4 bg-gradient-card/50 rounded-xl p-6 border border-border/50 max-w-md mx-auto">
            <Avatar className="w-12 h-12">
              <AvatarImage src={twitterUser.profileImage} alt={twitterUser.displayName} />
              <AvatarFallback>
                <User className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-semibold text-foreground">{twitterUser.displayName}</p>
              <p className="text-sm text-muted-foreground">@{twitterUser.username}</p>
            </div>
          </div>
        </div>
      )}

      {/* Features - Phase 1 Only */}
      {!showTwitterPhase && (
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
      )}

      {/* Twitter Connection Instructions - Phase 2 */}
      {showTwitterPhase && !isTwitterConnected && (
        <div className="bg-gradient-card/50 rounded-xl p-6 border border-border/50 animate-fade-in">
          <h3 className="font-semibold text-foreground mb-4">How to Connect:</h3>
          <div className="space-y-3 text-sm text-left">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">1</span>
              <span className="text-muted-foreground">Open Twitter/X in a new tab</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">2</span>
              <span className="text-muted-foreground">Look for the COSTRAS extension icon in your browser</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">3</span>
              <span className="text-muted-foreground">Click the extension and follow the connection steps</span>
            </div>
          </div>
        </div>
      )}

      {/* Installation Steps - Phase 1 Only */}
      {!showTwitterPhase && (
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
      )}

      {/* Extension Detection Status - Phase 1 */}
      {showDetecting && !extensionInstalled && !showTwitterPhase && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <div className="text-center">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Detecting Chrome Extension...
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Install the extension and we'll automatically detect it
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Extension Success - Transitioning to Twitter */}
      {extensionInstalled && !isTwitterConnected && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div className="text-center">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Extension Installed Successfully!
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Now let's connect your Twitter account
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Twitter Connection Detection - Phase 2 */}
      {showTwitterPhase && isWaitingForTwitter && !isTwitterConnected && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <div className="text-center">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Waiting for Twitter Connection...
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Use the Chrome extension to connect your account
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="space-y-4">
        {/* Phase 1: Extension Installation */}
        {!extensionInstalled && !showTwitterPhase && (
          <Button
            onClick={onInstall || (() => {
              window.open('https://chromewebstore.google.com/detail/twitter-bot-connector/mnegdfmbhfmahjhhgibhpabkmobleikk', '_blank');
              setShowDetecting(true);
            })}
            disabled={loading}
            size="lg"
            className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 rounded-xl disabled:opacity-50 transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Installing...
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5 mr-2" />
                Add to Chrome
              </>
            )}
          </Button>
        )}

        {/* Phase 2: Twitter Connection */}
        {showTwitterPhase && !isTwitterConnected && (
          <Button
            onClick={() => {
              window.open('https://x.com', '_blank');
              setIsWaitingForTwitter(true);
            }}
            size="lg"
            className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-xl"
          >
            <Twitter className="w-5 h-5 mr-2" />
            Open Twitter & Connect
          </Button>
        )}

        {/* Phase 2: Success - Continue */}
        {isTwitterConnected && (
          <Button
            onClick={onNext}
            size="lg"
            className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white border-0 rounded-xl animate-fade-in"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Continue to Account Analysis
          </Button>
        )}
        
        {/* Helper Text */}
        {!showTwitterPhase && (
          <p className="text-xs text-muted-foreground">
            Free extension • No subscription required • Auto-detected
          </p>
        )}
        
        {showTwitterPhase && !isTwitterConnected && (
          <p className="text-xs text-muted-foreground">
            Connect your account using the extension while on Twitter/X
          </p>
        )}

        {isTwitterConnected && (
          <p className="text-xs text-muted-foreground text-green-600">
            Account connected successfully • Ready to proceed
          </p>
        )}
        
        {/* Skip Options */}
        {showDetecting && !extensionInstalled && !showTwitterPhase && (
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              Having trouble? <button 
                onClick={onNext}
                className="text-primary hover:underline"
              >
                Skip this step
              </button>
            </p>
          </div>
        )}

        {isWaitingForTwitter && !isTwitterConnected && (
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              Having trouble connecting? <button 
                onClick={onNext}
                className="text-primary hover:underline"
              >
                Skip this step
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChromeExtensionStep;