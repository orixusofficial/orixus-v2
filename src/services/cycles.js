import { supabase } from '../lib/supabase';

export async function createCycle(userId, duration, startDate = null) {
  const cycleStartDate = startDate ? new Date(startDate) : new Date();
  cycleStartDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(cycleStartDate);
  endDate.setDate(cycleStartDate.getDate() + duration);
  
  const { data, error } = await supabase
    .from('cycles')
    .insert({
      user_id: userId,
      duration,
      start_date: cycleStartDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      status: 'active',
      current_rank: 'Initiate',
      final_rank: null,
      completion_percentage: 0,
      completion_result: null,
      ended_at: null
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function fetchCurrentCycle(userId) {
  const { data, error } = await supabase
    .from('cycles')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function fetchCycleHistory(userId) {
  const { data, error } = await supabase
    .from('cycles')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('ended_at', { ascending: false, nulls: 'last' });
  
  if (error) throw error;
  return data;
}

export async function completeCycle(cycleId, userId, finalRank, completionPercentage, completionResult) {
  const { data, error } = await supabase
    .from('cycles')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      current_rank: finalRank,
      final_rank: finalRank,
      completion_percentage: completionPercentage,
      completion_result: completionResult
    })
    .eq('id', cycleId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function endCycle(cycleId, userId, finalRank, completionPercentage, completionResult) {
  const { data, error } = await supabase
    .from('cycles')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      current_rank: finalRank,
      final_rank: finalRank,
      completion_percentage: completionPercentage,
      completion_result: completionResult
    })
    .eq('id', cycleId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCycleRank(cycleId, userId, rank) {
  const { data, error } = await supabase
    .from('cycles')
    .update({ current_rank: rank })
    .eq('id', cycleId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCycleDuration(cycleId, userId, newDuration) {
  // First fetch the cycle to get start_date
  const { data: cycle, error: fetchError } = await supabase
    .from('cycles')
    .select('start_date')
    .eq('id', cycleId)
    .eq('user_id', userId)
    .single();

  if (fetchError) throw fetchError;

  // Calculate new end_date based on start_date + new duration
  const startDate = new Date(cycle.start_date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + newDuration);

  // Update both duration and end_date
  const { data, error } = await supabase
    .from('cycles')
    .update({
      duration: newDuration,
      end_date: endDate.toISOString().split('T')[0]
    })
    .eq('id', cycleId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCycleStats(cycleId, userId) {
  const { data: habits, error: habitsError } = await supabase
    .from('habits')
    .select('id')
    .eq('user_id', userId)
    .eq('cycle_id', cycleId);
  
  if (habitsError) throw habitsError;
  
  const habitIds = habits.map(h => h.id);
  
  const { data: completions, error: completionsError } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('user_id', userId)
    .in('habit_id', habitIds);
  
  if (completionsError) throw completionsError;
  
  return {
    totalHabits: habits.length,
    totalCheckIns: completions.length
  };
}

export function calculateCompletionResult(percentage) {
  if (percentage < 50) return 'Reset & Rise';
  if (percentage < 65) return 'Steady';
  if (percentage < 75) return 'Strong';
  if (percentage < 90) return 'Elite';
  return 'Unbreakable';
}
