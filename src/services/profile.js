import { supabase } from '../lib/supabase';

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, created_at, avatar_url, default_discipline_state, first_day_of_week, habit_display_mode, reminders')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** Fallback if trigger did not run (e.g. user created before migration). */
export async function ensureProfile(user) {
  const userId = user?.id ?? user;
  const existing = await fetchProfile(userId);
  if (existing) return existing;

  const fullName = user?.user_metadata?.full_name ?? '';

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      display_name: fullName,
      default_discipline_state: 'focused',
      first_day_of_week: 'monday',
      habit_display_mode: 'date',
      reminders: true
    })
    .select('id, display_name, created_at, avatar_url, default_discipline_state, first_day_of_week, habit_display_mode, reminders')
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('id, display_name, created_at, avatar_url, default_discipline_state, first_day_of_week, habit_display_mode, reminders')
    .single();

  if (error) throw error;
  return data;
}
