import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  status: string;
  trial_end: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing'])
          .maybeSingle();

        if (error) {
          console.error('Error fetching subscription:', error);
        }

        setSubscription((data as any) || null);
      } catch (error) {
        console.error('Subscription fetch error:', error);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return {
    subscription,
    loading,
    hasPlan: !!subscription,
    planType: subscription?.plan_type || null,
    isTrial: subscription?.status === 'trialing',
    isActive: subscription?.status === 'active'
  };
};