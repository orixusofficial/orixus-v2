import { supabase } from '../lib/supabase';

// Admin service — uses the anon client with admin-specific RLS policies.
// Requires: supabase/migrations/20260731000000_admin_rls_policies.sql

// ─── Dashboard stats ─────────────────────────────────────────────────────────

export async function fetchAdminStats() {
  const [usersResult, habitsResult, journalResult, feedbackResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('habits').select('id', { count: 'exact', head: true }),
    supabase.from('journal_entries').select('id', { count: 'exact', head: true }),
    supabase.from('feedback').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalUsers: usersResult.count ?? 0,
    totalHabits: habitsResult.count ?? 0,
    totalJournalEntries: journalResult.count ?? 0,
    totalFeedback: feedbackResult.count ?? 0,
  };
}

// ─── Users table ─────────────────────────────────────────────────────────────

function calculateStreak(dates) {
  if (!dates || dates.length === 0) return 0;

  // Unique dates, sorted newest first
  const sorted = [...new Set(dates)].sort().reverse();

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];

  // Streak must start from today or yesterday to be considered active
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 0;
  let expected = sorted[0];

  for (const date of sorted) {
    if (date === expected) {
      streak++;
      // Move expected back one day
      const d = new Date(expected + 'T12:00:00Z');
      d.setUTCDate(d.getUTCDate() - 1);
      expected = d.toISOString().split('T')[0];
    } else {
      break;
    }
  }

  return streak;
}

export async function fetchAdminUsers() {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [profilesResult, habitsResult, completionsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, display_name, created_at')
      .order('created_at', { ascending: false }),
    supabase.from('habits').select('user_id'),
    supabase
      .from('habit_completions')
      .select('user_id, completed_on')
      .gte('completed_on', ninetyDaysAgo),
  ]);

  const profiles = profilesResult.data ?? [];
  const habits = habitsResult.data ?? [];
  const completions = completionsResult.data ?? [];

  // Habit count per user
  const habitCounts = {};
  habits.forEach((h) => {
    habitCounts[h.user_id] = (habitCounts[h.user_id] || 0) + 1;
  });

  // Completion dates grouped per user
  const completionsByUser = {};
  completions.forEach((c) => {
    if (!completionsByUser[c.user_id]) completionsByUser[c.user_id] = [];
    completionsByUser[c.user_id].push(c.completed_on);
  });

  return profiles.map((p) => ({
    id: p.id,
    display_name: p.display_name,
    created_at: p.created_at,
    habitCount: habitCounts[p.id] || 0,
    currentStreak: calculateStreak(completionsByUser[p.id]),
  }));
}
