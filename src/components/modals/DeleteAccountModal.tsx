import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteAccount } from "@/services/accountService";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountModal({ open, onOpenChange }: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userProvider, setUserProvider] = useState<string>("");
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserProvider = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const provider = session.user.app_metadata?.provider || 'email';
        setUserProvider(provider);
      }
    };
    
    if (open && user) {
      getUserProvider();
    }
  }, [open, user]);

  const isGoogleUser = userProvider === 'google';

  const handleClose = () => {
    setPassword("");
    setError("");
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleDeleteAccount = async () => {
    // Only check password for non-Google users
    if (!isGoogleUser && !password.trim()) {
      setError("Password is required");
      return;
    }

    if (!user?.id) {
      setError("User not found");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await deleteAccount(user.id, isGoogleUser ? undefined : password);
      
      // Clear local storage and sign out
      localStorage.clear();
      await signOut();
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
        variant: "default",
      });
      
      // Redirect to home page
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("Delete account error:", err);
      
      if (err.status === 403) {
        setError("Invalid password. Please try again.");
      } else if (err.status === 404) {
        setError("Account not found.");
      } else if (err.message?.includes("password")) {
        setError("Invalid password. Please try again.");
      } else if (err.message?.includes("network") || err.message?.includes("fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Failed to delete account. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription className="text-left">
            This action cannot be undone. This will permanently delete your account,
            remove all your data, and disconnect your Twitter integration.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!isGoogleUser && (
            <div className="space-y-2">
              <Label htmlFor="delete-password">
                Enter your password to confirm deletion
              </Label>
              <Input
                id="delete-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
                className={error ? "border-destructive" : ""}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          )}
          
          {isGoogleUser && error && (
            <div className="space-y-2">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive font-medium">Warning:</p>
            <ul className="text-sm text-destructive/80 mt-1 space-y-1">
              <li>• All your bot configurations will be lost</li>
              <li>• Your Twitter connection will be permanently removed</li>
              <li>• All analytics and activity history will be deleted</li>
              <li>• This action cannot be reversed</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isLoading || (!isGoogleUser && !password.trim())}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}