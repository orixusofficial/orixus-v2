import { supabase } from '../lib/supabase';

function mapEntry(row) {
  return {
    id: row.id,
    date: new Date(row.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    title: row.title,
    content: row.content,
    mood: row.mood,
    createdAt: row.created_at,
  };
}

export async function fetchJournalEntries(userId) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, title, content, mood, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapEntry);
}

export async function createJournalEntry(userId, { title, content, mood }) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({ user_id: userId, title, content, mood })
    .select('id, title, content, mood, created_at')
    .single();

  if (error) throw error;
  return mapEntry(data);
}

export async function deleteAllJournalEntries(userId) {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}
