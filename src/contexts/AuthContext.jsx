import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const AuthContext = createContext(null);

// TEMPORARY DEVELOPMENT BYPASS: Skips login/signup in development mode (localhost)
// In production (Vercel), this is false and normal Supabase authentication is used
const BYPASS_AUTH = import.meta.env.DEV === true;

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (BYPASS_AUTH) {
      setSession({
        user: {
          id: 'dev-user-id',
          email: 'dev-operator@orixus.io',
          isMock: true,
          user_metadata: { display_name: 'Dev Operator' },
        },
      });
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: initial } }) => {
      if (mounted) {
        setSession(initial);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email, password) => {
    if (BYPASS_AUTH) {
      const mockData = {
        user: {
          id: 'dev-user-id',
          email: email,
          isMock: true,
          user_metadata: { display_name: 'Dev Operator' },
        },
      };
      setSession(mockData);
      return mockData;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (BYPASS_AUTH) {
      const mockData = {
        user: {
          id: 'dev-user-id',
          email: email,
          isMock: true,
          user_metadata: { display_name: 'Dev Operator' },
        },
      };
      setSession(mockData);
      return mockData;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    if (BYPASS_AUTH) {
      setSession(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signUp,
      signIn,
      signOut,
      isConfigured: isSupabaseConfigured,
    }),
    [session, loading, signUp, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

