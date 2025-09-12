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
    <div className="h-full flex flex-col text-center overflow-hidden">
      {/* Compact Header - Fixed Height */}
      <div className="flex-shrink-0 h-20 sm:h-24 flex flex-col justify-center">
        {/* Phase 1: Extension Download */}
        {!showTwitterPhase && (
          <div className="space-y-2">
            <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500/10 to-yellow-500/10 rounded-full flex items-center justify-center">
              <Chrome className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Install Chrome Extension
            </h1>
          </div>
        )}

        {/* Phase 2: Twitter Connection */}
        {showTwitterPhase && !isTwitterConnected && (
          <div className="space-y-2 animate-fade-in">
            <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full flex items-center justify-center">
              <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Connect Twitter Account
            </h1>
          </div>
        )}

        {/* Phase 3: Success State */}
        {isTwitterConnected && twitterUser && (
          <div className="space-y-2 animate-fade-in">
            <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Successfully Connected!
            </h1>
            <div className="flex items-center justify-center space-x-2 bg-gradient-card/50 rounded-lg p-2 border border-border/50 max-w-xs mx-auto">
              <Avatar className="w-8 h-8">
                <AvatarImage src={twitterUser.profileImage} alt={twitterUser.displayName} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">{twitterUser.displayName}</p>
                <p className="text-xs text-muted-foreground">@{twitterUser.username}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Fixed Height, No Scroll */}
      <div className="flex-1 min-h-0 flex flex-col justify-center space-y-3 overflow-hidden">
        {/* Installation Steps - Phase 1 */}
        {!showTwitterPhase && (
          <div className="bg-muted/20 rounded-lg p-3 space-y-2">
            <h3 className="font-semibold text-foreground text-sm">Installation Steps:</h3>
            <div className="space-y-1.5 text-xs text-left">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">1</span>
                <span className="text-muted-foreground">Click "Add to Chrome" below</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">2</span>
                <span className="text-muted-foreground">Install from Chrome Web Store</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">3</span>
                <span className="text-muted-foreground">Pin extension to toolbar</span>
              </div>
            </div>
          </div>
        )}

        {/* Twitter Connection Steps - Phase 2 */}
        {showTwitterPhase && !isTwitterConnected && (
          <div className="bg-gradient-card/50 rounded-lg p-3 border border-border/50 animate-fade-in">
            <h3 className="font-semibold text-foreground mb-2 text-sm">Connection Steps:</h3>
            <div className="space-y-1.5 text-xs text-left">
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">1</span>
                <span className="text-muted-foreground">Open Twitter/X</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">2</span>
                <span className="text-muted-foreground">Click COSTRAS extension</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">3</span>
                <span className="text-muted-foreground">Follow connection steps</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages - Compact */}
        {showDetecting && !extensionInstalled && !showTwitterPhase && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 animate-fade-in">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
              <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                Detecting extension...
              </p>
            </div>
          </div>
        )}

        {extensionInstalled && !isTwitterConnected && (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-2 animate-fade-in">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-600" />
              <p className="text-xs font-medium text-green-900 dark:text-green-100">
                Extension installed! Connect Twitter.
              </p>
            </div>
          </div>
        )}

        {showTwitterPhase && isWaitingForTwitter && !isTwitterConnected && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 animate-fade-in">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
              <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                Waiting for Twitter connection...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex-shrink-0 h-24 sm:h-28 flex flex-col justify-center space-y-2">
        {/* Phase 1: Extension Installation */}
        {!extensionInstalled && !showTwitterPhase && (
          <Button
            onClick={onInstall || (() => {
              window.open('https://chromewebstore.google.com/detail/twitter-bot-connector/mnegdfmbhfmahjhhgibhpabkmobleikk', '_blank');
              setShowDetecting(true);
            })}
            disabled={loading}
            size="lg"
            className="w-full px-6 py-3 font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 rounded-lg disabled:opacity-50 transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Installing...
              </>
            ) : (
              <>
                <Chrome className="w-4 h-4 mr-2" />
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
            className="w-full px-6 py-3 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-lg"
          >
            <Twitter className="w-4 h-4 mr-2" />
            Open Twitter & Connect
          </Button>
        )}

        {/* Phase 3: Success - Continue */}
        {isTwitterConnected && (
          <Button
            onClick={onNext}
            size="lg"
            className="w-full px-6 py-3 font-semibold bg-green-600 hover:bg-green-700 text-white border-0 rounded-lg animate-fade-in"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Continue Setup
          </Button>
        )}
        
        {/* Helper Text */}
        <div className="text-center space-y-1">
          {!showTwitterPhase && (
            <p className="text-xs text-muted-foreground">
              Free extension • Auto-detected
            </p>
          )}
          
          {showTwitterPhase && !isTwitterConnected && (
            <p className="text-xs text-muted-foreground">
              Connect via extension on Twitter/X
            </p>
          )}

          {isTwitterConnected && (
            <p className="text-xs text-green-600">
              Successfully connected • Ready to proceed
            </p>
          )}
        </div>
        
        {/* Skip Options */}
        {(showDetecting || isWaitingForTwitter) && !isTwitterConnected && (
          <div className="text-center">
            <button 
              onClick={onNext}
              className="text-xs text-primary hover:underline"
            >
              Skip this step
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChromeExtensionStep;