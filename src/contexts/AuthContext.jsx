import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import posthog from 'posthog-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);

  const checkRecoveryFromUrl = useCallback(() => {
    const hash = window.location.hash;
    return hash.includes('type=recovery');
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const isRecoveryUrl = checkRecoveryFromUrl();

    supabase.auth.getSession().then(({ data: { session: initial } }) => {
      if (mounted) {
        setSession(initial);
        setIsRecovery(isRecoveryUrl);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
        setLoading(false);
        if (event === 'PASSWORD_RECOVERY') {
          setIsRecovery(true);
        }
        if (event === 'SIGNED_IN' && nextSession?.user) {
          posthog.identify(nextSession.user.id, {
            email: nextSession.user.email,
            name: nextSession.user.user_metadata?.full_name,
          });
        } else if (event === 'SIGNED_OUT') {
          posthog.reset();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkRecoveryFromUrl]);

  const signUp = useCallback(async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName ?? '' },
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const signIn = useCallback(async (email, password, rememberMe = false) => {
    const options = {};
    if (rememberMe) {
      options.expiresIn = 30 * 24 * 60 * 60; // 30 days in seconds
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password }, options);
    if (error) throw error;
    return data;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const verifyEmailOtp = useCallback(async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) throw error;
    return data;
  }, []);

  const resendSignupOtp = useCallback(async (email) => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) throw error;
    return data;
  }, []);

  const resetPassword = useCallback(async (email) => {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    if (profileError) throw profileError;
    if (!profile) {
      throw new Error('No account found with this email. Please sign up first.');
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const updatePassword = useCallback(async (password) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  }, []);

  const reauthenticate = useCallback(async (password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: session?.user?.email,
      password,
    });
    if (error) throw error;
    return data;
  }, [session]);

  const resendVerificationEmail = useCallback(async (email) => {
    const targetEmail = email || session?.user?.email;
    if (!targetEmail) throw new Error('No email address found');
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: targetEmail,
    });
    if (error) throw error;
    return data;
  }, [session]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      isRecovery,
      signUp,
      signIn,
      signInWithGoogle,
      verifyEmailOtp,
      resendSignupOtp,
      resendVerificationEmail,
      resetPassword,
      updatePassword,
      reauthenticate,
      signOut,
      isConfigured: isSupabaseConfigured,
    }),
    [session, loading, isRecovery, signUp, signIn, signInWithGoogle, verifyEmailOtp, resendSignupOtp, resendVerificationEmail, resetPassword, updatePassword, reauthenticate, signOut],
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
