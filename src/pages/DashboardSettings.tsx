import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  User,
  Twitter,
  Bell,
  Shield,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Download,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const DashboardSettings = () => {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    dailySummary: false,
    errorAlerts: true
  });
  const [isConnected, setIsConnected] = useState(true);
  const { toast } = useToast();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: "Error",
        description: "Please fill in both current and new password.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDisconnectTwitter = () => {
    setIsConnected(false);
    toast({
      title: "Twitter disconnected",
      description: "Your Twitter account has been disconnected.",
      variant: "destructive",
    });
  };

  const handleReconnectTwitter = () => {
    setIsConnected(true);
    toast({
      title: "Twitter connected",
      description: "Your Twitter account has been reconnected successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export started",
      description: "Your data export will be ready shortly. We'll send you an email when it's ready.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and security settings</p>
        </div>

        {/* Profile Information */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
          </div>
          
          <div className="space-y-6">
            {/* Email Display */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                value={user?.email || ""} 
                type="email" 
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed here. Contact support if needed.
              </p>
            </div>

            {/* Password Change */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input 
                      id="current-password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                onClick={handleChangePassword}
                disabled={isChangingPassword || !currentPassword || !newPassword}
              >
                {isChangingPassword ? "Updating..." : "Change Password"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Twitter Connection */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Twitter className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-foreground">Twitter Connection</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {isConnected ? "Connected to @johndoe" : "Not connected"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isConnected ? "Last synced 2 hours ago" : "Connect your Twitter account to start using the bot"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? (
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
                {isConnected ? (
                  <Button variant="outline" size="sm" onClick={handleDisconnectTwitter}>
                    Disconnect
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleReconnectTwitter}>
                    Connect Twitter
                  </Button>
                )}
              </div>
            </div>

            {isConnected && (
              <div className="text-sm text-muted-foreground">
                <p>✓ OAuth authentication active</p>
                <p>✓ API permissions granted</p>
                <p>✓ Real-time sync enabled</p>
              </div>
            )}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Notification Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about your bot activity</p>
              </div>
              <Switch 
                checked={notifications.email}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, email: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Daily Summary</p>
                <p className="text-sm text-muted-foreground">Get a daily report of bot performance</p>
              </div>
              <Switch 
                checked={notifications.dailySummary}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, dailySummary: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Error Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when issues occur</p>
              </div>
              <Switch 
                checked={notifications.errorAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, errorAlerts: checked }))
                }
              />
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Privacy & Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">Export Your Data</p>
                <p className="text-sm text-muted-foreground">Download all your account data and bot activity</p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <div>
                <p className="font-medium text-foreground">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSettings;