import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Tables } from '@/integrations/supabase/types';

type User = Tables<'users'>;
type ExtensionSession = Tables<'extension_sessions'>;

export interface ExtensionStatus {
  isConnected: boolean;
  lastConnected: string | null;
  extensionVersion: string | null;
  connectionMethod: 'extension' | 'manual';
  sessionOrigin: 'extension' | 'website';
  autoLoginEnabled: boolean;
  activeSessions: ExtensionSession[];
}

export const useExtensionStatus = () => {
  const { user, loading: authLoading } = useAuth();
  const [extensionStatus, setExtensionStatus] = useState<ExtensionStatus>({
    isConnected: false,
    lastConnected: null,
    extensionVersion: null,
    connectionMethod: 'manual',
    sessionOrigin: 'website',
    autoLoginEnabled: false,
    activeSessions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExtensionStatus = useCallback(async () => {
    if (!user) return;
    
    try {

      // Fetch user extension status
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Fetch active extension sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('extension_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (sessionsError) throw sessionsError;

      setExtensionStatus({
        isConnected: userData?.extension_connected || false,
        lastConnected: userData?.extension_last_connected || null,
        extensionVersion: userData?.extension_version || null,
        connectionMethod: (userData?.connection_method as 'extension' | 'manual') || 'manual',
        sessionOrigin: (userData?.session_origin as 'extension' | 'website') || 'website',
        autoLoginEnabled: userData?.auto_login_enabled || false,
        activeSessions: sessions || [],
      });

      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch extension status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateExtensionStatus = useCallback(async (
    extensionVersion?: string,
    sessionToken?: string,
    browserInfo?: string
  ) => {
    if (!user) throw new Error('User not authenticated');
    
    try {

      const { data, error } = await supabase.rpc('update_extension_status', {
        p_user_id: user.id,
        p_extension_version: extensionVersion,
        p_session_token: sessionToken,
        p_browser_info: browserInfo,
      });

      if (error) throw error;

      // Refresh status after update
      await fetchExtensionStatus();
      
      return data;
    } catch (err: any) {
      console.error('Failed to update extension status:', err);
      throw err;
    }
  }, [fetchExtensionStatus, user]);

  const disconnectExtension = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {

      const { data, error } = await supabase.rpc('disconnect_extension', {
        p_user_id: user.id,
      });

      if (error) throw error;

      // Refresh status after disconnect
      await fetchExtensionStatus();
      
      return data;
    } catch (err: any) {
      console.error('Failed to disconnect extension:', err);
      throw err;
    }
  }, [fetchExtensionStatus, user]);

  // Set up real-time subscription for user updates
  useEffect(() => {
    if (authLoading || !user) return;
    
    const setupSubscription = async () => {
      fetchExtensionStatus();

      // Subscribe to user table changes
      const userSubscription = supabase
        .channel('user_extension_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${user.id}`,
          },
          () => {
            fetchExtensionStatus();
          }
        )
        .subscribe();

      // Subscribe to extension sessions changes
      const sessionSubscription = supabase
        .channel('extension_session_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'extension_sessions',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchExtensionStatus();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(userSubscription);
        supabase.removeChannel(sessionSubscription);
      };
    };

    setupSubscription();
  }, [fetchExtensionStatus, user, authLoading]);

  // Listen for Chrome extension events
  useEffect(() => {
    const handleExtensionConnect = (event: any) => {
      const { extensionVersion, sessionToken, browserInfo } = event.detail || {};
      updateExtensionStatus(extensionVersion, sessionToken, browserInfo);
    };

    const handleExtensionDisconnect = () => {
      disconnectExtension();
    };

    window.addEventListener('costrasExtensionConnected', handleExtensionConnect);
    window.addEventListener('costrasExtensionDisconnected', handleExtensionDisconnect);

    return () => {
      window.removeEventListener('costrasExtensionConnected', handleExtensionConnect);
      window.removeEventListener('costrasExtensionDisconnected', handleExtensionDisconnect);
    };
  }, [updateExtensionStatus, disconnectExtension]);

  return {
    extensionStatus,
    loading,
    error,
    updateExtensionStatus,
    disconnectExtension,
    refetch: fetchExtensionStatus,
  };
};