import { supabase } from '../lib/supabase';

function mapHabit(row) {
  return {
    id: row.id,
    label: row.label,
    createdAt: new Date(row.created_at),
  };
}

export async function fetchHabits(userId) {
  const { data, error } = await supabase
    .from('habits')
    .select('id, label, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapHabit);
}

export async function createHabit(userId, label) {
  const { data, error } = await supabase
    .from('habits')
    .insert({ user_id: userId, label })
    .select('id, label, created_at')
    .single();

  if (error) throw error;
  return mapHabit(data);
}

export async function deleteHabit(habitId) {
  const { error } = await supabase.from('habits').delete().eq('id', habitId);
  if (error) throw error;
}
