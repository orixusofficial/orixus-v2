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

export async function updateHabitDuration(userId, habitId, newDuration, habits) {
  // Find the habit to get its start date
  const habit = habits?.find(h => h.id === habitId);
  if (!habit) {
    throw new Error('Habit not found');
  }
  
  // Calculate current day: number of calendar days since habit started + 1
  // Use same time normalization as DisciplineMatrix (12:00)
  const habitStart = new Date(habit.createdAt);
  habitStart.setHours(12, 0, 0, 0);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  
  const diffTime = today - habitStart;
  const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  // Enforce: newDuration cannot be less than currentDay
  if (newDuration < currentDay) {
    throw new Error(`You're currently on Day ${currentDay}. Duration cannot be less than ${currentDay} days.`);
  }
  
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
