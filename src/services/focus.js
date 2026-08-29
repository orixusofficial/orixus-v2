import { supabase } from '../lib/supabase';

export const DEFAULT_CATEGORIES = [
  'Adult',
  'Gambling',
  'Explicit / Nude',
  'Live Adult',
  'Harmful',
];

export async function fetchActiveFocusSession(userId) {
  if (!userId) return null;

  const { data: session, error } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  if (!session) return null;

  // Fetch corresponding policy
  const { data: policy } = await supabase
    .from('focus_policies')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  const sessionWithPolicy = {
    ...session,
    focus_policies: policy
  };

  // Check if session has expired
  const now = new Date();
  const expiresAt = new Date(session.expires_at);

  if (now >= expiresAt) {
    // Auto-expire session in DB
    await supabase
      .from('focus_sessions')
      .update({ status: 'expired' })
      .eq('id', session.id)
      .eq('user_id', userId);

    return { ...sessionWithPolicy, status: 'expired' };
  }

  return sessionWithPolicy;
}

export async function fetchFocusPolicy(userId) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('focus_policies')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createFocusSession(userId, durationMinutes, categories = DEFAULT_CATEGORIES, blockedDomains = []) {
  if (!userId) throw new Error('Authentication required');

  // Check if an active session already exists
  const existingActive = await fetchActiveFocusSession(userId);
  if (existingActive && existingActive.status === 'active') {
    throw new Error('An active Focus session is already in progress.');
  }

  // Upsert policy
  const { data: policy, error: policyError } = await supabase
    .from('focus_policies')
    .upsert(
      {
        user_id: userId,
        categories,
        blocked_domains: blockedDomains,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (policyError) throw policyError;

  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

  const { data: session, error: sessionError } = await supabase
    .from('focus_sessions')
    .insert({
      user_id: userId,
      policy_id: policy.id,
      status: 'active',
      duration_minutes: durationMinutes,
      started_at: startedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select('*')
    .single();

  if (sessionError) throw sessionError;

  const sessionWithPolicy = { ...session, focus_policies: policy };

  // Broadcast sync event to local browser extension if installed
  if (typeof window !== 'undefined') {
    window.postMessage(
      {
        type: 'ORIXUS_FOCUS_SESSION_SYNC',
        payload: { session: sessionWithPolicy, policy },
      },
      window.location.origin
    );
  }

  return sessionWithPolicy;
}

export async function endFocusSession(sessionId, userId) {
  if (!userId || !sessionId) return null;

  const { data: session, error } = await supabase
    .from('focus_sessions')
    .update({ status: 'ended' })
    .eq('id', sessionId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw error;

  const { data: policy } = await supabase
    .from('focus_policies')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  const sessionWithPolicy = { ...session, focus_policies: policy };

  // Broadcast sync event to extension
  if (typeof window !== 'undefined') {
    window.postMessage(
      {
        type: 'ORIXUS_FOCUS_SESSION_END',
        payload: { sessionId },
      },
      window.location.origin
    );
  }

  return sessionWithPolicy;
}
