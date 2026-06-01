import { supabase } from '../lib/supabase';

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** Fallback if trigger did not run (e.g. user created before migration). */
export async function ensureProfile(userId) {
  const existing = await fetchProfile(userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, display_name: '' })
    .select('id, display_name, created_at')
    .single();

  if (error) throw error;
  return data;
}
