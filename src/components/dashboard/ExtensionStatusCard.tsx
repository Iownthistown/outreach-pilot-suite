import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Chrome,
  Wifi,
  WifiOff,
  Clock,
  Monitor,
  Shield,
  ExternalLink
} from "lucide-react";
import { ExtensionStatus } from "@/hooks/useExtensionStatus";

interface ExtensionStatusCardProps {
  extensionStatus: ExtensionStatus;
  loading: boolean;
  onDisconnect?: () => void;
}

const ExtensionStatusCard = ({ 
  extensionStatus, 
  loading, 
  onDisconnect 
}: ExtensionStatusCardProps) => {
  const formatLastConnected = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 24) {
      return date.toLocaleDateString();
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-primary/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${
            extensionStatus.isConnected 
              ? 'bg-success/20 text-success' 
              : 'bg-muted/20 text-muted-foreground'
          }`}>
            <Chrome className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Chrome Extension</h3>
            <div className="flex items-center gap-2 mt-1">
              {extensionStatus.isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-success" />
                  <Badge variant="default" className="bg-success/20 text-success border-success/30">
                    Connected
                  </Badge>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="outline" className="text-muted-foreground">
                    Disconnected
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
        
        {extensionStatus.isConnected && onDisconnect && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onDisconnect}
            disabled={loading}
          >
            Disconnect
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Connection Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Last Connected:</span>
            <span className="text-foreground font-medium">
              {formatLastConnected(extensionStatus.lastConnected)}
            </span>
          </div>
          
          {extensionStatus.extensionVersion && (
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Version:</span>
              <span className="text-foreground font-medium">
                {extensionStatus.extensionVersion}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Connection Method:</span>
            <Badge variant="secondary" className="text-xs">
              {extensionStatus.connectionMethod}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Session Origin:</span>
            <Badge variant="secondary" className="text-xs">
              {extensionStatus.sessionOrigin}
            </Badge>
          </div>
        </div>

        {/* Active Sessions */}
        {extensionStatus.activeSessions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Active Sessions ({extensionStatus.activeSessions.length})
            </h4>
            <div className="space-y-2">
              {extensionStatus.activeSessions.slice(0, 3).map((session) => (
                <div 
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-foreground">
                      {session.browser_info || 'Chrome Browser'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatLastConnected(session.last_activity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auto-login Status */}
        {extensionStatus.autoLoginEnabled && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              Auto-login enabled via extension
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExtensionStatusCard;