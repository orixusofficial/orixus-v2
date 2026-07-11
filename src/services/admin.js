import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Create admin client with service role key to bypass RLS
const url = import.meta.env.VITE_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('[ADMIN DEBUG] Service role key present:', !!serviceRoleKey);
console.log('[ADMIN DEBUG] Supabase URL present:', !!url);

const adminClient = serviceRoleKey 
  ? createClient(url, serviceRoleKey)
  : supabase; // Fallback to regular client if service role key not available

console.log('[ADMIN DEBUG] Using admin client:', adminClient === supabase ? 'REGULAR CLIENT (RLS BLOCKED)' : 'SERVICE ROLE CLIENT (RLS BYPASSED)');

export async function fetchAdminStats() {
  console.log('[ADMIN DEBUG] fetchAdminStats called');
  
  const [usersResult, habitsResult, journalResult, completionsResult] = await Promise.all([
    // Total users from profiles table
    adminClient.from('profiles').select('id', { count: 'exact', head: true }),
    
    // Total habits
    adminClient.from('habits').select('id', { count: 'exact', head: true }),
    
    // Total journal entries
    adminClient.from('journal_entries').select('id', { count: 'exact', head: true }),
    
    // Total check-ins (habit completions)
    adminClient.from('habit_completions').select('id', { count: 'exact', head: true }),
  ]);

  console.log('[ADMIN DEBUG] Total Users query result:', usersResult);
  console.log('[ADMIN DEBUG] Total Habits query result:', habitsResult);
  console.log('[ADMIN DEBUG] Total Journal Entries query result:', journalResult);
  console.log('[ADMIN DEBUG] Total Check-ins query result:', completionsResult);

  const totalUsers = usersResult.count ?? 0;
  const totalHabits = habitsResult.count ?? 0;
  const totalJournalEntries = journalResult.count ?? 0;
  const totalCheckIns = completionsResult.count ?? 0;

  // Active users: users who have at least one habit
  const { data: habitsData, error: habitsError } = await adminClient
    .from('habits')
    .select('user_id');
  
  console.log('[ADMIN DEBUG] Active Users query result:', { data: habitsData, error: habitsError });
  
  const uniqueUserIds = new Set(habitsData?.map(h => h.user_id) ?? []);
  const activeUsersCount = uniqueUserIds.size;

  console.log('[ADMIN DEBUG] Active Users count:', activeUsersCount);

  return {
    totalUsers,
    activeUsers: activeUsersCount ?? 0,
    totalHabits,
    totalJournalEntries,
    totalCheckIns,
  };
}

export async function fetchUserGrowth() {
  console.log('[ADMIN DEBUG] fetchUserGrowth called');
  
  const { data, error } = await adminClient
    .from('profiles')
    .select('created_at')
    .order('created_at', { ascending: true });
  
  console.log('[ADMIN DEBUG] User Growth query result:', { data, error, rowCount: data?.length });
  
  if (error) throw error;
  return data ?? [];
}

export async function fetchRecentSignups(limit = 10) {
  console.log('[ADMIN DEBUG] fetchRecentSignups called with limit:', limit);
  
  const { data, error } = await adminClient
    .from('profiles')
    .select('id, display_name, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  console.log('[ADMIN DEBUG] Recent Signups query result:', { data, error, rowCount: data?.length });
  
  if (error) throw error;
  return data ?? [];
}

export async function fetchActivityOverview() {
  console.log('[ADMIN DEBUG] fetchActivityOverview called');
  
  const { data, error } = await adminClient
    .from('habit_completions')
    .select('created_on')
    .order('created_on', { ascending: false })
    .limit(30);
  
  console.log('[ADMIN DEBUG] Activity Overview query result:', { data, error, rowCount: data?.length });
  
  if (error) throw error;
  return data ?? [];
}
