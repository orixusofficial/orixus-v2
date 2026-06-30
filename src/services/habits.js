import { supabase } from '../lib/supabase';

function mapHabit(row) {
  const createdAt = new Date(row.created_at);
  createdAt.setHours(0, 0, 0, 0);
  return {
    id: row.id,
    label: row.label,
    duration: row.duration ?? 30,
    createdAt,
  };
}

export async function fetchHabits(userId) {
  const { data, error } = await supabase
    .from('habits')
    .select('id, label, duration, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapHabit);
}

export async function createHabit(userId, label, duration = 30) {
  console.log('Creating habit:', { userId, label, duration });
  const { data, error } = await supabase
    .from('habits')
    .insert({ user_id: userId, label, duration })
    .select('id, label, duration, created_at')
    .single();

  if (error) {
    console.error('Supabase error creating habit:', error);
    throw error;
  }
  return mapHabit(data);
}

export async function updateHabitDuration(userId, habitId, newDuration) {
  const { error } = await supabase
    .from('habits')
    .update({ duration: newDuration })
    .eq('id', habitId)
    .eq('user_id', userId);

  if (error) {
    console.error('Supabase error updating habit duration:', error);
    throw error;
  }
}

export async function deleteHabit(habitId) {
  const { error } = await supabase.from('habits').delete().eq('id', habitId);
  if (error) throw error;
}

export async function deleteAllHabits(userId) {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}
