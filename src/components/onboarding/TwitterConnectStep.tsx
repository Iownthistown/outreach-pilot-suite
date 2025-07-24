import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Twitter, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface TwitterConnectStepProps {
  onNext: () => void;
  loading?: boolean;
}

const TwitterConnectStep = ({ onNext, loading = false }: TwitterConnectStepProps) => {
  const [connectionStatus, setConnectionStatus] = useState<'waiting' | 'connecting' | 'connected' | 'error'>('waiting');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Listen for events from the Chrome extension
    const handleTwitterConnected = (event: any) => {
      console.log('Twitter connected event received:', event);
      setConnectionStatus('connected');
      
      // Store connection status
      localStorage.setItem('costras_twitter_connected', 'true');
      localStorage.setItem('onboarding_step', '4');
      
      // Auto-advance to next step after a short delay
      setTimeout(() => {
        onNext();
      }, 2000);
    };

    const handleConnectionError = (event: any) => {
      console.error('Twitter connection error:', event);
      setConnectionStatus('error');
      setErrorMessage(event.detail?.message || 'Failed to connect Twitter account');
    };

    const handleExtensionReady = (event: any) => {
      console.log('Extension ready:', event);
      setConnectionStatus('connecting');
    };

    // Add event listeners for extension events
    window.addEventListener('costrasTwitterConnected', handleTwitterConnected);
    window.addEventListener('costrasConnectionSuccess', handleTwitterConnected);
    window.addEventListener('costrasConnectionError', handleConnectionError);
    window.addEventListener('costrasExtensionReady', handleExtensionReady);

    // Check if already connected
    const isConnected = localStorage.getItem('costras_twitter_connected') === 'true';
    if (isConnected) {
      setConnectionStatus('connected');
    }

    return () => {
      window.removeEventListener('costrasTwitterConnected', handleTwitterConnected);
      window.removeEventListener('costrasConnectionSuccess', handleTwitterConnected);
      window.removeEventListener('costrasConnectionError', handleConnectionError);
      window.removeEventListener('costrasExtensionReady', handleExtensionReady);
    };
  }, [onNext]);

  const handleTryAgain = () => {
    setConnectionStatus('waiting');
    setErrorMessage('');
  };

  const renderStatusIcon = () => {
    switch (connectionStatus) {
      case 'waiting':
        return <Clock className="w-8 h-8 text-muted-foreground" />;
      case 'connecting':
        return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>;
      case 'connected':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Clock className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const renderStatusBadge = () => {
    switch (connectionStatus) {
      case 'waiting':
        return <Badge variant="secondary">Waiting for connection</Badge>;
      case 'connecting':
        return <Badge variant="outline">Connecting...</Badge>;
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connected!</Badge>;
      case 'error':
        return <Badge variant="destructive">Connection failed</Badge>;
      default:
        return <Badge variant="secondary">Waiting</Badge>;
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Connect Your Twitter/X Account</h2>
        <p className="text-muted-foreground">
          Use the COSTRAS Chrome extension to securely connect your Twitter/X account
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {renderStatusIcon()}
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Twitter className="w-5 h-5 text-blue-500" />
            Twitter/X Connection
          </CardTitle>
          <CardDescription>
            {renderStatusBadge()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {connectionStatus === 'waiting' && (
            <div className="space-y-4">
              <div className="p-4 border-2 border-dashed rounded-lg text-center space-y-2">
                <div className="text-2xl">🚀</div>
                <p className="text-sm font-medium">Click the COSTRAS icon in your browser</p>
                <p className="text-xs text-muted-foreground">
                  Look for the COSTRAS extension icon in your browser's toolbar and click it to connect your Twitter/X account
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>COSTRAS extension must be installed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                  <span>Click the extension icon in your browser</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                  <span>Follow the prompts to connect Twitter/X</span>
                </div>
              </div>
            </div>
          )}

          {connectionStatus === 'connecting' && (
            <div className="text-center space-y-4">
              <div className="p-6 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Connecting to Twitter/X...
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Please complete the authentication in the extension popup
                </p>
              </div>
            </div>
          )}

          {connectionStatus === 'connected' && (
            <div className="text-center space-y-4">
              <div className="p-6 border rounded-lg bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Twitter/X account connected successfully!
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="text-center space-y-4">
              <div className="p-6 border rounded-lg bg-red-50 dark:bg-red-950/20">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  Connection failed
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {errorMessage || 'Please try again or contact support'}
                </p>
              </div>
              
              <Button 
                onClick={handleTryAgain}
                variant="outline"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          )}

          {connectionStatus !== 'connected' && (
            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                className="w-full text-xs text-muted-foreground"
              >
                Skip this step (you can connect later)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TwitterConnectStep;