import { supabase } from '../lib/supabase';

export async function submitFeedback(feedbackData) {
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      user_id: feedbackData.userId,
      rating: feedbackData.rating,
      category: feedbackData.category,
      message: feedbackData.message,
      allow_contact: feedbackData.allowContact,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchAllFeedback() {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchFeedbackStats() {
  const { data: feedbackData, error } = await supabase
    .from('feedback')
    .select('rating, category');

  if (error) throw error;

  const totalFeedback = feedbackData?.length || 0;
  const bugReports = feedbackData?.filter(f => f.category === 'Bug Report').length || 0;
  const featureRequests = feedbackData?.filter(f => f.category === 'Feature Request').length || 0;
  
  const averageRating = totalFeedback > 0
    ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
    : 0;

  return {
    averageRating: averageRating.toFixed(1),
    totalFeedback,
    bugReports,
    featureRequests,
  };
}
