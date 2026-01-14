import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to send signup notification
async function sendSignupNotification(user: User, provider: string) {
  try {
    const response = await supabase.functions.invoke('notify-new-signup', {
      body: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name,
        provider: provider
      }
    });
    
    if (response.error) {
      console.error('Failed to send signup notification:', response.error);
    } else {
      console.log('Signup notification sent successfully');
    }
  } catch (error) {
    console.error('Error sending signup notification:', error);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const notifiedUsers = useRef<Set<string>>(new Set())

  useEffect(() => {
    let mounted = true;
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Session retrieval error:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, !!session);
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Send notification for new signups (SIGNED_IN after OAuth or after email verification)
          if (event === 'SIGNED_IN' && session?.user) {
            const userId = session.user.id;
            const createdAt = new Date(session.user.created_at);
            const now = new Date();
            const isNewUser = (now.getTime() - createdAt.getTime()) < 60000; // Created within last 60 seconds
            
            // Only notify if user is new and we haven't already notified for this user
            if (isNewUser && !notifiedUsers.current.has(userId)) {
              notifiedUsers.current.add(userId);
              const provider = session.user.app_metadata?.provider || 'email';
              await sendSignupNotification(session.user, provider);
            }
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    console.log('Starting Google OAuth flow...');
    console.log('Redirect URL:', `${window.location.origin}/auth/callback`);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/userinfo.email',
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
    
    console.log('Google OAuth initiated successfully');
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
    
    // Send notification immediately after signup (before email verification)
    if (data.user) {
      await sendSignupNotification(data.user, 'email');
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}