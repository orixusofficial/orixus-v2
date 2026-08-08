import { getCurrentStreak, isDayFullyCompleted, dateKey, isBefore } from './analyticsHelpers';

/**
 * Achievement Configuration
 * All 21 achievements including existing (First Spark, Century, First Log)
 * and 18 new achievements organized by category
 */

export const ACHIEVEMENT_CATEGORIES = {
  STREAK: { id: 'STREAK', name: 'Streak', icon: '🔥' },
  EXECUTION: { id: 'EXECUTION', name: 'Execution', icon: '⚡' },
  JOURNAL: { id: 'JOURNAL', name: 'Journal', icon: '📖' },
  SECRET: { id: 'SECRET', name: 'Secret', icon: '🎯' },
};

export const ACHIEVEMENTS_CONFIG = [
  // === EXISTING ACHIEVEMENTS (must be preserved) ===
  {
    id: 'first_spark',
    name: 'First Spark',
    description: 'Complete your first habit check-in',
    category: 'EXECUTION',
    icon: 'flame',
    secret: false,
    check: (data) => data.totalHabits >= 1,
  },
  {
    id: 'century',
    name: 'Century',
    description: 'Complete 100 habits',
    category: 'EXECUTION',
    icon: 'trophy',
    secret: false,
    check: (data) => data.totalHabits >= 100,
  },
  {
    id: 'first_log',
    name: 'First Log',
    description: 'Write your first journal entry',
    category: 'JOURNAL',
    icon: 'notebook',
    secret: false,
    check: (data) => data.journalCount >= 1,
  },

  // === NEW STREAK ACHIEVEMENTS ===
  {
    id: 'ignited',
    name: 'Ignited',
    description: 'Reach a 3-day streak',
    category: 'STREAK',
    icon: 'flame',
    secret: false,
    check: (data) => data.streak >= 3,
  },
  {
    id: 'locked_in',
    name: 'Locked In',
    description: 'Reach a 7-day streak',
    category: 'STREAK',
    icon: 'calendar',
    secret: false,
    check: (data) => data.streak >= 7,
  },
  {
    id: 'the_discipline',
    name: 'The Discipline',
    description: 'Reach a 14-day streak',
    category: 'STREAK',
    icon: 'shield',
    secret: false,
    check: (data) => data.streak >= 14,
  },
  {
    id: 'the_standard',
    name: 'The Standard',
    description: 'Reach a 30-day streak',
    category: 'STREAK',
    icon: 'diamond',
    secret: false,
    check: (data) => data.streak >= 30,
  },
  {
    id: 'unbreakable',
    name: 'Unbreakable',
    description: 'Reach a 60-day streak',
    category: 'STREAK',
    icon: 'shield',
    secret: false,
    check: (data) => data.streak >= 60,
  },
  {
    id: 'sovereign_mind',
    name: 'Sovereign Mind',
    description: 'Reach a 180-day streak',
    category: 'STREAK',
    icon: 'diamond',
    secret: false,
    check: (data) => data.streak >= 180,
  },

  // === NEW EXECUTION ACHIEVEMENTS ===
  {
    id: 'five_hundred_club',
    name: '500 Club',
    description: 'Reach 500 lifetime habit completions',
    category: 'EXECUTION',
    icon: 'trophy',
    secret: false,
    check: (data) => data.totalHabits >= 500,
    progress: (data) => ({ current: data.totalHabits, target: 500 }),
  },
  {
    id: 'the_thousand',
    name: 'The Thousand',
    description: 'Reach 1,000 lifetime habit completions',
    category: 'EXECUTION',
    icon: 'trophy',
    secret: false,
    check: (data) => data.totalHabits >= 1000,
    progress: (data) => ({ current: data.totalHabits, target: 1000 }),
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Every active habit completed for 7 consecutive days',
    category: 'EXECUTION',
    icon: 'target',
    secret: false,
    check: (data) => data.perfectWeekStreak >= 7,
  },
  {
    id: 'perfect_month',
    name: 'Perfect Month',
    description: 'Every active habit completed for 30 consecutive days',
    category: 'EXECUTION',
    icon: 'target',
    secret: false,
    check: (data) => data.perfectWeekStreak >= 30,
  },

  // === NEW JOURNAL ACHIEVEMENTS ===
  {
    id: 'the_honest_record',
    name: 'The Honest Record',
    description: 'Reach 7 lifetime journal entries',
    category: 'JOURNAL',
    icon: 'notebook',
    secret: false,
    check: (data) => data.journalCount >= 7,
    progress: (data) => ({ current: data.journalCount, target: 7 }),
  },
  {
    id: 'mind_architect',
    name: 'Mind Architect',
    description: 'Reach 30 lifetime journal entries',
    category: 'JOURNAL',
    icon: 'notebook',
    secret: false,
    check: (data) => data.journalCount >= 30,
    progress: (data) => ({ current: data.journalCount, target: 30 }),
  },
  {
    id: 'chronicler',
    name: 'Chronicler',
    description: 'Reach 100 lifetime journal entries',
    category: 'JOURNAL',
    icon: 'notebook',
    secret: false,
    check: (data) => data.journalCount >= 100,
    progress: (data) => ({ current: data.journalCount, target: 100 }),
  },

  // === SECRET ACHIEVEMENTS ===
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Joined Orixus during the first 30 days after launch',
    category: 'SECRET',
    icon: 'star',
    secret: true,
    check: (data) => data.isEarlyAdopter,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a habit between 12:00 AM and 4:59 AM',
    category: 'SECRET',
    icon: 'moon',
    secret: true,
    check: (data) => data.hasNightOwlCompletion,
  },
  {
    id: 'dawn_warrior',
    name: 'Dawn Warrior',
    description: 'Complete a habit between 5:00 AM and 7:59 AM',
    category: 'SECRET',
    icon: 'sun',
    secret: true,
    check: (data) => data.hasDawnWarriorCompletion,
  },
  {
    id: 'the_comeback',
    name: 'The Comeback',
    description: 'Rebuild a broken streak to 3+ consecutive days',
    category: 'SECRET',
    icon: 'activity',
    secret: true,
    check: (data) => data.hasComeback,
  },
  {
    id: 'all_in',
    name: 'All In',
    description: 'Maintain 5+ active habits for 7 consecutive days',
    category: 'SECRET',
    icon: 'target',
    secret: true,
    check: (data) => data.hasAllIn,
  },
];

/**
 * Calculate perfect day streak (consecutive days where all active habits were completed)
 */
export function calculatePerfectDayStreak(habits, completionData) {
  if (!habits.length) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  if (isDayFullyCompleted(today, habits, completionData)) {
    streak = 1;
    let checkDate = new Date(today);
    checkDate.setDate(today.getDate() - 1);
    for (let i = 0; i < 365; i++) {
      if (isDayFullyCompleted(checkDate, habits, completionData)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (isDayFullyCompleted(yesterday, habits, completionData)) {
      streak = 1;
      let checkDate = new Date(yesterday);
      checkDate.setDate(yesterday.getDate() - 1);
      for (let i = 0; i < 365; i++) {
        if (isDayFullyCompleted(checkDate, habits, completionData)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }
  return streak;
}

/**
 * Check if user has completed a habit during night owl hours (12:00 AM - 4:59 AM)
 */
export function hasNightOwlCompletion(completionData, habits) {
  if (!completionData || !habits.length) return false;
  
  // This would need completion timestamps from the database
  // For now, return false as we need timestamp data
  return false;
}

/**
 * Check if user has completed a habit during dawn warrior hours (5:00 AM - 7:59 AM)
 */
export function hasDawnWarriorCompletion(completionData, habits) {
  if (!completionData || !habits.length) return false;
  
  // This would need completion timestamps from the database
  // For now, return false as we need timestamp data
  return false;
}

/**
 * Check if user has had a comeback (broken streak rebuilt to 3+ days)
 */
export function hasComeback(habits, completionData) {
  if (!habits.length) return false;
  
  const currentStreak = getCurrentStreak(habits, completionData);
  
  // If current streak is less than 3, no comeback
  if (currentStreak < 3) return false;
  
  // Need to track if there was a previous streak that was broken
  // This requires historical data - for now return false
  return false;
}

/**
 * Check if user has maintained 5+ active habits for 7 consecutive days
 */
export function hasAllIn(habits, completionData) {
  if (!habits.length) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let consecutiveDays = 0;
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    
    const activeHabits = habits.filter(h => {
      const habitCreated = new Date(h.createdAt);
      habitCreated.setHours(0, 0, 0, 0);
      return !isBefore(checkDate, habitCreated);
    });
    
    if (activeHabits.length >= 5 && isDayFullyCompleted(checkDate, habits, completionData)) {
      consecutiveDays++;
      if (consecutiveDays >= 7) return true;
    } else {
      consecutiveDays = 0;
    }
  }
  
  return false;
}

/**
 * Check if user is an early adopter (joined within 30 days of launch)
 * LAUNCH_DATE should be configured as an environment variable or config
 */
export function isEarlyAdopter(userCreatedAt, launchDate = null) {
  if (!userCreatedAt) return false;
  if (!launchDate) return false; // Need configured launch date
  
  const userDate = new Date(userCreatedAt);
  const launch = new Date(launchDate);
  
  const daysAfterLaunch = Math.floor((userDate - launch) / (1000 * 60 * 60 * 24));
  
  return daysAfterLaunch >= 0 && daysAfterLaunch <= 30;
}

/**
 * Calculate all achievement data for a user
 */
export function calculateAchievementData(habits, completionData, journalEntries, profile, user) {
  const totalHabits = Object.values(completionData).filter(v => v).length;
  const journalCount = journalEntries.length;
  const streak = getCurrentStreak(habits, completionData);
  const perfectWeekStreak = calculatePerfectDayStreak(habits, completionData);
  
  // Secret achievement checks
  const isEarlyAdopterResult = isEarlyAdopter(profile?.created_at);
  const hasNightOwlResult = hasNightOwlCompletion(completionData, habits);
  const hasDawnWarriorResult = hasDawnWarriorCompletion(completionData, habits);
  const hasComebackResult = hasComeback(habits, completionData);
  const hasAllInResult = hasAllIn(habits, completionData);
  
  return {
    totalHabits,
    journalCount,
    streak,
    perfectWeekStreak,
    isEarlyAdopter: isEarlyAdopterResult,
    hasNightOwlCompletion: hasNightOwlResult,
    hasDawnWarriorCompletion: hasDawnWarriorResult,
    hasComeback: hasComebackResult,
    hasAllIn: hasAllInResult,
  };
}
