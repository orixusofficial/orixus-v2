import { supabase } from '../lib/supabase';

/** Build in-memory map: `${habitId}:${YYYY-MM-DD}` → true */
export function completionsToMap(rows) {
  const map = {};
  for (const row of rows) {
    map[`${row.habit_id}:${row.completed_on}`] = true;
  }
  return map;
}

export async function fetchCompletions(userId) {
  const { data, error } = await supabase
    .from('habit_completions')
    .select('habit_id, completed_on')
    .eq('user_id', userId);

  if (error) throw error;
  return completionsToMap(data ?? []);
}

export async function setCompletion(userId, habitId, dateKeyStr, completed) {
  if (completed) {
    const { error } = await supabase.from('habit_completions').insert({
      user_id: userId,
      habit_id: habitId,
      completed_on: dateKeyStr,
    });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .eq('habit_id', habitId)
      .eq('completed_on', dateKeyStr);
    if (error) throw error;
  }
}

export async function deleteAllCompletions(userId) {
  const { error } = await supabase
    .from('habit_completions')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}
