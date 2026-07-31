import { supabase } from '../lib/supabase';

// Submit feedback from Settings page
export async function submitFeedback(feedbackData) {
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      user_id: feedbackData.userId,
      rating: feedbackData.rating,
      category: feedbackData.category,
      message: feedbackData.message,
    })
    .select()
    .single();

  if (error) {
    console.error('Feedback insert error:', error);
    throw error;
  }
  return data;
}

// Fetch all feedback for admin panel
export async function fetchAllFeedback() {
  const { data: feedbackData, error: feedbackError } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });

  if (feedbackError) {
    console.error('Fetch feedback error:', feedbackError);
    throw feedbackError;
  }

  if (!feedbackData || feedbackData.length === 0) return [];

  // Join with profiles to get usernames
  const userIds = [...new Set(feedbackData.map((f) => f.user_id))];
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', userIds);

  const profileMap = {};
  (profilesData || []).forEach((p) => {
    profileMap[p.id] = p.display_name || null;
  });

  return feedbackData.map((f) => ({
    ...f,
    display_name: profileMap[f.user_id] ?? null,
  }));
}

// Delete feedback entry (admin only)
export async function deleteFeedback(id) {
  const { error } = await supabase.from('feedback').delete().eq('id', id);
  if (error) {
    console.error('Delete feedback error:', error);
    throw error;
  }
}
