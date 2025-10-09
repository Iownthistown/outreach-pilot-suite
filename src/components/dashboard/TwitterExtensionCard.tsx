import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Twitter,
  Chrome,
  CheckCircle,
  AlertTriangle,
  Clock,
  Monitor,
  Shield,
  Loader2,
  RefreshCw
} from "lucide-react";
import { ExtensionStatus } from "@/hooks/useExtensionStatus";
import { formatDistanceToNow } from "date-fns";
import { useTwitter } from "@/hooks/useTwitter";

interface TwitterExtensionCardProps {
  extensionStatus: ExtensionStatus;
  loading: boolean;
  onDisconnect?: () => void;
}

const TwitterExtensionCard = ({ 
  extensionStatus, 
  loading,
  onDisconnect 
}: TwitterExtensionCardProps) => {
  const { 
    twitterData, 
    loading: twitterLoading, 
    fetchTwitterData,
    isConnected: twitterConnected 
  } = useTwitter();

  const formatLastConnected = (timestamp?: string) => {
    if (!timestamp) return "Never";
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  const getLastSyncText = () => {
    if (!twitterData?.last_sync) return "Never synced";
    const lastSync = new Date(twitterData.last_sync);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Synced recently";
    if (diffHours === 1) return "Last synced 1 hour ago";
    if (diffHours < 24) return `Last synced ${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Last synced ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <Card className="p-6">
      {/* Twitter Connection Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Twitter className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-foreground">Twitter Connection</h2>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center gap-3">
            {twitterLoading ? (
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : twitterData?.profile_image_url ? (
              <img 
                src={twitterData.profile_image_url} 
                alt="Twitter profile" 
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Twitter className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              {twitterLoading ? (
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
              ) : (
                <>
                  <p className="font-medium text-foreground">
                    {twitterConnected && twitterData?.handle 
                      ? `Connected to @${twitterData.handle}` 
                      : "Not connected"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {twitterConnected 
                      ? getLastSyncText()
                      : "Connect your Twitter account to start using the bot"}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!twitterLoading && twitterConnected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchTwitterData}
                className="p-2"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            )}
            <Badge variant={twitterConnected ? "default" : "secondary"}>
              {twitterLoading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Loading
                </>
              ) : twitterConnected ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Status Checks */}
        {twitterConnected && (
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Chrome Extension connected
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              API permissions granted
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Extension sync active
            </p>
          </div>
        )}
      </div>

      {/* Chrome Extension Section */}
      <div className="pt-6 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <Chrome className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Chrome Extension</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  extensionStatus.isConnected 
                    ? 'bg-green-500/10' 
                    : 'bg-muted'
                }`}>
                  <Chrome className={`w-5 h-5 ${
                    extensionStatus.isConnected 
                      ? 'text-green-500' 
                      : 'text-muted-foreground'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {extensionStatus.isConnected ? 'Connected' : 'Disconnected'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Extension status
                  </p>
                </div>
              </div>
              <Badge variant={extensionStatus.isConnected ? "default" : "secondary"}>
                {extensionStatus.isConnected ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Inactive
                  </>
                )}
              </Badge>
            </div>

            {/* Extension Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Last Connected</p>
                  <p className="font-medium text-foreground">
                    {formatLastConnected(extensionStatus.lastConnected)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Version</p>
                  <p className="font-medium text-foreground">
                    {extensionStatus.extensionVersion || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Connection Method</p>
                  <p className="font-medium text-foreground">
                    {extensionStatus.connectionMethod || 'manual'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Session Origin</p>
                  <p className="font-medium text-foreground">
                    {extensionStatus.sessionOrigin || 'website'}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            {extensionStatus.isConnected && extensionStatus.activeSessions && extensionStatus.activeSessions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Active Sessions ({extensionStatus.activeSessions.length})
                </p>
                <div className="space-y-2">
                  {extensionStatus.activeSessions.slice(0, 3).map((session, index) => (
                    <div 
                      key={index}
                      className="text-xs p-2 bg-muted/50 rounded flex items-center justify-between"
                    >
                      <span className="text-muted-foreground">
                        Session {index + 1}
                      </span>
                      <span className="text-foreground">
                        {formatLastConnected(session.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Auto-login indicator */}
            {extensionStatus.autoLoginEnabled && (
              <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded text-sm">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-blue-500">Auto-login enabled</span>
              </div>
            )}

            {/* Disconnect Button */}
            {extensionStatus.isConnected && onDisconnect && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onDisconnect}
                className="w-full"
              >
                Disconnect Extension
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TwitterExtensionCard;
