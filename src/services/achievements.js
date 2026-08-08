import { supabase } from '../lib/supabase';

/**
 * Fetch all unlocked achievements for a user
 */
export async function fetchUserAchievements(userId) {
  const { data, error } = await supabase
    .from('achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId);

  if (error) throw error;
  return data ?? [];
}

/**
 * Unlock an achievement for a user
 * Uses unique constraint to prevent duplicate unlocks
 */
export async function unlockAchievement(userId, achievementId) {
  const { data, error } = await supabase
    .from('achievements')
    .insert({ user_id: userId, achievement_id: achievementId })
    .select('achievement_id, unlocked_at')
    .single();

  // If error is due to unique constraint violation, the achievement is already unlocked
  if (error && error.code !== '23505') {
    throw error;
  }

  return data;
}

/**
 * Check if a specific achievement is unlocked for a user
 */
export async function isAchievementUnlocked(userId, achievementId) {
  const { data, error } = await supabase
    .from('achievements')
    .select('achievement_id')
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 means no rows returned (achievement not unlocked)
    throw error;
  }

  return !!data;
}

/**
 * Check and unlock achievements based on current data
 * This should be called after habit completions, journal entries, etc.
 */
export async function checkAndUnlockAchievements(userId, achievementData) {
  const { ACHIEVEMENTS_CONFIG } = await import('../utils/achievements');
  
  // Get currently unlocked achievements
  const unlockedAchievements = await fetchUserAchievements(userId);
  const unlockedIds = new Set(unlockedAchievements.map(a => a.achievement_id));
  
  const newlyUnlocked = [];

  // Check each achievement
  for (const achievement of ACHIEVEMENTS_CONFIG) {
    // Skip if already unlocked
    if (unlockedIds.has(achievement.id)) continue;
    
    // Check if achievement condition is met
    if (achievement.check(achievementData)) {
      try {
        const result = await unlockAchievement(userId, achievement.id);
        if (result) {
          newlyUnlocked.push(achievement);
        }
      } catch (error) {
        console.error(`Failed to unlock achievement ${achievement.id}:`, error);
      }
    }
  }

  return newlyUnlocked;
}
