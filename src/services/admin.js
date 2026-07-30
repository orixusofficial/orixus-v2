import { supabase } from '../lib/supabase';

// Admin functions use the regular Supabase client with RLS policies
// Service role keys must never be exposed to the frontend
// Admin operations should be moved to a backend API with proper authentication

export async function fetchAdminStats() {
  const [usersResult, habitsResult, journalResult, completionsResult] = await Promise.all([
    // Total users from profiles table
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    
    // Total habits
    supabase.from('habits').select('id', { count: 'exact', head: true }),
    
    // Total journal entries
    supabase.from('journal_entries').select('id', { count: 'exact', head: true }),
    
    // Total check-ins (habit completions)
    supabase.from('habit_completions').select('id', { count: 'exact', head: true }),
  ]);

  const totalUsers = usersResult.count ?? 0;
  const totalHabits = habitsResult.count ?? 0;
  const totalJournalEntries = journalResult.count ?? 0;
  const totalCheckIns = completionsResult.count ?? 0;

  // Active users: users who have at least one habit
  const { data: habitsData } = await supabase
    .from('habits')
    .select('user_id');
  
  const uniqueUserIds = new Set(habitsData?.map(h => h.user_id) ?? []);
  const activeUsersCount = uniqueUserIds.size;

  return {
    totalUsers,
    activeUsers: activeUsersCount ?? 0,
    totalHabits,
    totalJournalEntries,
    totalCheckIns,
  };
}

export async function fetchUserGrowth() {
  const { data, error } = await supabase
    .from('profiles')
    .select('created_at')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data ?? [];
}

export async function fetchRecentSignups(limit = 10) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data ?? [];
}

export async function fetchActivityOverview() {
  const { data, error } = await supabase
    .from('habit_completions')
    .select('created_on')
    .order('created_on', { ascending: false })
    .limit(30);
  
  if (error) throw error;
  return data ?? [];
}
