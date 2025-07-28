import { useState, useEffect } from 'react';
import { apiService, TwitterUserInfo } from '@/lib/apiService';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useTwitter = () => {
  const [twitterData, setTwitterData] = useState<TwitterUserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTwitterData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check Supabase for cached data
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('twitter_handle, twitter_display_name, twitter_profile_image_url, twitter_connected_at, twitter_last_sync')
        .eq('id', user.id)
        .single();

      if (dbError && dbError.code !== 'PGRST116') {
        throw dbError;
      }

      if (userData?.twitter_handle) {
        setTwitterData({
          handle: userData.twitter_handle,
          display_name: userData.twitter_display_name || '',
          profile_image_url: userData.twitter_profile_image_url || '',
          connected_at: userData.twitter_connected_at || '',
          last_sync: userData.twitter_last_sync || '',
          is_connected: true
        });
      } else {
        // Try to fetch from API if not in local DB
        try {
          const apiData = await apiService.getTwitterUserInfo();
          setTwitterData(apiData);
          
          // Update local database with API data
          if (apiData.is_connected) {
            await supabase
              .from('users')
              .upsert({
                id: user.id,
                email: user.email,
                twitter_handle: apiData.handle,
                twitter_display_name: apiData.display_name,
                twitter_profile_image_url: apiData.profile_image_url,
                twitter_connected_at: apiData.connected_at,
                twitter_last_sync: apiData.last_sync
              });
          }
        } catch (apiError) {
          // If API fails, user is not connected
          setTwitterData({
            handle: '',
            display_name: '',
            profile_image_url: '',
            connected_at: '',
            last_sync: '',
            is_connected: false
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load Twitter data');
      setTwitterData({
        handle: '',
        display_name: '',
        profile_image_url: '',
        connected_at: '',
        last_sync: '',
        is_connected: false
      });
    } finally {
      setLoading(false);
    }
  };

  const connectTwitter = async (authToken: string, ct0Token: string) => {
    try {
      const result = await apiService.connectTwitter(authToken, ct0Token);
      
      // Update local state
      setTwitterData(result);
      
      // Update database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email,
            twitter_handle: result.handle,
            twitter_display_name: result.display_name,
            twitter_profile_image_url: result.profile_image_url,
            twitter_connected_at: result.connected_at,
            twitter_last_sync: result.last_sync
          });
      }

      toast({
        title: "Twitter Connected",
        description: `Successfully connected to @${result.handle}`,
      });

      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to connect Twitter';
      setError(errorMsg);
      toast({
        title: "Connection Failed",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    }
  };

  const disconnectTwitter = async () => {
    try {
      await apiService.disconnectTwitter();
      
      // Update local state
      setTwitterData({
        handle: '',
        display_name: '',
        profile_image_url: '',
        connected_at: '',
        last_sync: '',
        is_connected: false
      });
      
      // Clear database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('users')
          .update({
            twitter_handle: null,
            twitter_display_name: null,
            twitter_profile_image_url: null,
            twitter_connected_at: null,
            twitter_last_sync: null,
            twitter_auth_token: null,
            twitter_ct0_token: null
          })
          .eq('id', user.id);
      }

      toast({
        title: "Twitter Disconnected",
        description: "Your Twitter account has been disconnected.",
        variant: "destructive",
      });
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to disconnect Twitter';
      setError(errorMsg);
      toast({
        title: "Disconnection Failed",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchTwitterData();
  }, []);

  return {
    twitterData,
    loading,
    error,
    fetchTwitterData,
    connectTwitter,
    disconnectTwitter,
    isConnected: twitterData?.is_connected || false
  };
};