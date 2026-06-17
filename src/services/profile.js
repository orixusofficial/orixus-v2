import { supabase } from '../lib/supabase';

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, created_at, avatar_color, default_journal_mood, first_day_of_week, habit_display_mode')
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
    .insert({
      id: userId,
      display_name: '',
      avatar_color: '#A79277',
      default_journal_mood: 'focused',
      first_day_of_week: 'monday',
      habit_display_mode: 'date'
    })
    .select('id, display_name, created_at, avatar_color, default_journal_mood, first_day_of_week, habit_display_mode')
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('id, display_name, created_at, avatar_color, default_journal_mood, first_day_of_week, habit_display_mode')
    .single();

  if (error) throw error;
  return data;
}
