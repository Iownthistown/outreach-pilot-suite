import { Button } from "@/components/ui/button";
import { Chrome, Shield, Lock, Loader2, CheckCircle, Twitter, User, ArrowUpRight, ArrowRight } from "lucide-react";
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
    <div className="h-full flex flex-col text-center overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Header - Premium Design */}
      <div className="flex-shrink-0 h-24 sm:h-28 flex flex-col justify-center relative z-10">
        {/* Phase 1: Extension Download */}
        {!showTwitterPhase && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex justify-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Chrome className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-orange-600 bg-clip-text text-transparent">
                Install Chrome Extension
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mt-2">
                Add COSTRAS to your browser in seconds
              </p>
            </div>
          </div>
        )}

        {/* Phase 2: Twitter Connection */}
        {showTwitterPhase && !isTwitterConnected && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex justify-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Twitter className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-blue-600 bg-clip-text text-transparent">
                Connect Your Twitter
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mt-2">
                Link your Twitter account for automation
              </p>
            </div>
          </div>
        )}

        {/* Phase 3: Success State */}
        {isTwitterConnected && twitterUser && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex justify-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-green-600 bg-clip-text text-transparent">
                Successfully Connected!
              </h1>
              <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-3 border border-green-200/50 dark:border-green-800/30 max-w-sm mx-auto mt-3">
                <Avatar className="w-10 h-10 ring-2 ring-green-500/30">
                  <AvatarImage src={twitterUser.profileImage} alt={twitterUser.displayName} />
                  <AvatarFallback className="bg-green-100 text-green-700">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold text-green-900 dark:text-green-100 text-sm">{twitterUser.displayName}</p>
                  <p className="text-xs text-green-700 dark:text-green-300">@{twitterUser.username}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Clear Instructions */}
      <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden relative z-10">
        {/* Installation Steps - Phase 1 */}
        {!showTwitterPhase && (
          <div className="max-w-lg mx-auto px-4">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl p-6 border border-orange-200/50 dark:border-orange-800/30 shadow-lg">
              <h3 className="font-bold text-orange-900 dark:text-orange-100 text-lg mb-4 flex items-center gap-2">
                <Chrome className="w-5 h-5" />
                Installation Steps
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-orange-200/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm">Click "Add to Chrome" below</p>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">Opens Chrome Web Store automatically</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-orange-200/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm">Click "Add to Chrome" in store</p>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">Browser will install the extension</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-orange-200/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm">Pin extension to toolbar</p>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">For easy access (optional but recommended)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Twitter Connection Steps - Phase 2 */}
        {showTwitterPhase && !isTwitterConnected && (
          <div className="max-w-lg mx-auto px-4 animate-fade-in">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/30 shadow-lg">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 text-lg mb-4 flex items-center gap-2">
                <Twitter className="w-5 h-5" />
                Twitter Connection Steps
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-blue-200/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Go to Twitter/X</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Click "Open Twitter" button below</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-blue-200/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Click COSTRAS extension icon</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Look for the COSTRAS icon in your browser toolbar</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-blue-200/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Follow popup wizard</p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Grant permissions and complete setup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages - Enhanced */}
        {showDetecting && !extensionInstalled && !showTwitterPhase && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mt-4 animate-fade-in shadow-lg">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Detecting extension...
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Install the extension and we'll automatically detect it
                </p>
              </div>
            </div>
          </div>
        )}

        {extensionInstalled && !isTwitterConnected && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mt-4 animate-fade-in shadow-lg">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="text-center">
                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                  Extension installed successfully!
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Now let's connect your Twitter account
                </p>
              </div>
            </div>
          </div>
        )}

        {showTwitterPhase && isWaitingForTwitter && !isTwitterConnected && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mt-4 animate-fade-in shadow-lg">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                  Waiting for Twitter connection...
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Complete the connection in the extension popup
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Premium Design */}
      <div className="flex-shrink-0 h-28 flex flex-col justify-center space-y-3 relative z-10">
        {/* Phase 1: Extension Installation */}
        {!extensionInstalled && !showTwitterPhase && (
          <Button
            onClick={onInstall || (() => {
              window.open('https://chromewebstore.google.com/detail/twitter-bot-connector/mnegdfmbhfmahjhhgibhpabkmobleikk', '_blank');
              setShowDetecting(true);
            })}
            disabled={loading}
            size="lg"
            className="w-full max-w-md mx-auto h-14 text-lg font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white border-0 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                <span>Installing...</span>
              </>
            ) : (
              <>
                <Chrome className="w-6 h-6 mr-3" />
                <span>Add to Chrome</span>
                <ArrowUpRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
            className="w-full max-w-md mx-auto h-14 text-lg font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white border-0 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <Twitter className="w-6 h-6 mr-3" />
            <span>Open Twitter & Connect</span>
            <ArrowUpRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Button>
        )}

        {/* Phase 3: Success - Continue */}
        {isTwitterConnected && (
          <Button
            onClick={onNext}
            size="lg"
            className="w-full max-w-md mx-auto h-14 text-lg font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white border-0 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group animate-fade-in"
          >
            <CheckCircle className="w-6 h-6 mr-3" />
            <span>Continue Setup</span>
            <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
        
        {/* Helper Text */}
        <div className="text-center space-y-2">
          {!showTwitterPhase && (
            <p className="text-xs text-muted-foreground">
              Free extension • Secure & private • Auto-detected
            </p>
          )}
          
          {showTwitterPhase && !isTwitterConnected && (
            <p className="text-xs text-muted-foreground">
              Connect your account using the extension on Twitter/X
            </p>
          )}

          {isTwitterConnected && (
            <p className="text-xs text-green-600 font-medium">
              ✓ Account connected successfully • Ready to proceed
            </p>
          )}
        </div>
        
        {/* Skip Options */}
        {(showDetecting || isWaitingForTwitter) && !isTwitterConnected && (
          <div className="text-center">
            <button 
              onClick={onNext}
              className="text-xs text-primary hover:underline transition-colors"
            >
              Skip this step for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChromeExtensionStep;