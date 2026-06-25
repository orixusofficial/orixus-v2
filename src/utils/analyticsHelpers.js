/**
 * Date and Completion helper functions for Orixus analytics
 */

/**
 * Generate a local YYYY-MM-DD date key from a Date object
 */
export function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Check if a date is in the future (ignoring time)
 */
export function isFuture(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d > today;
}

/**
 * Check if dateA is before dateB (ignoring time)
 */
export function isBefore(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return a < b;
}

/**
 * Generate an array of past N days ending at today (inclusive of today)
 */
export function getDaysRange(count) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (count - 1) + i);
    days.push(d);
  }
  return days;
}

/**
 * Check if all active habits on a given day were completed
 */
export function isDayFullyCompleted(date, habits, completionData) {
  const dateStr = dateKey(date);
  const activeHabits = habits.filter(h => !isBefore(date, h.createdAt));
  if (activeHabits.length === 0) return false;
  return activeHabits.every(h => completionData[`${h.id}:${dateStr}`]);
}

/**
 * Calculate the current streak of consecutive perfect days
 */
export function getCurrentStreak(habits, completionData) {
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
 * Calculate the longest consecutive perfect streak in the last maxLookback days
 */
export function getBestStreak(habits, completionData, maxLookback = 365) {
  if (!habits.length) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let bestStreak = 0;
  let currentStreak = 0;
  
  for (let i = maxLookback; i >= 0; i--) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    
    if (isDayFullyCompleted(checkDate, habits, completionData)) {
      currentStreak++;
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }
  return bestStreak;
}

/**
 * Get the completion percentage of a single habit over a range of days
 */
export function getHabitConsistency(habit, completionData, days) {
  let activeDays = 0;
  let completions = 0;
  days.forEach((day) => {
    if (!isBefore(day, habit.createdAt) && !isFuture(day)) {
      activeDays++;
      const key = `${habit.id}:${dateKey(day)}`;
      if (completionData[key]) {
        completions++;
      }
    }
  });
  return activeDays > 0 ? Math.round((completions / activeDays) * 100) : 0;
}

/**
 * Calculate the overall consistency percentage for all active habits over a range of days
 */
export function getOverallConsistency(habits, completionData, days) {
  let totalActivePossible = 0;
  let totalDone = 0;
  
  habits.forEach((habit) => {
    days.forEach((day) => {
      if (!isBefore(day, habit.createdAt) && !isFuture(day)) {
        totalActivePossible++;
        if (completionData[`${habit.id}:${dateKey(day)}`]) {
          totalDone++;
        }
      }
    });
  });
  
  return totalActivePossible > 0 ? Math.round((totalDone / totalActivePossible) * 100) : 0;
}

/**
 * Calculate completion percentage of active habits on a specific date
 */
export function getDailyCompletionRate(habits, completionData, date) {
  const activeHabits = habits.filter(h => !isBefore(date, h.createdAt));
  if (activeHabits.length === 0) return 0;
  const dateStr = dateKey(date);
  const completedCount = activeHabits.filter(h => completionData[`${h.id}:${dateStr}`]).length;
  return Math.round((completedCount / activeHabits.length) * 100);
}

/**
 * Calculate points based on completions and streak multiplier
 */
export function calculatePoints(habits, completionData) {
  if (!habits.length) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Lookback 365 days
  const days = [];
  for (let i = 365; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  
  let runningStreak = 0;
  let totalPoints = 0;
  
  days.forEach((day) => {
    const dateStr = dateKey(day);
    const activeHabits = habits.filter(h => !isBefore(day, h.createdAt));
    if (activeHabits.length === 0) {
      runningStreak = 0;
      return;
    }
    
    const isPerfect = activeHabits.every(h => completionData[`${h.id}:${dateStr}`]);
    if (isPerfect) {
      runningStreak++;
    } else {
      runningStreak = 0;
    }
    
    const completionsOnDay = activeHabits.filter(h => completionData[`${h.id}:${dateStr}`]).length;
    const multiplier = Math.min(2.0, 1.0 + Math.floor(runningStreak / 7) * 0.1);
    
    totalPoints += completionsOnDay * multiplier;
  });
  
  return Math.round(totalPoints);
}

export const RANKS = [
  { name: "Initiate", minStreak: 0, minHabits: 0, level: 1 },
  { name: "Ascendant", minStreak: 7, minHabits: 20, level: 2 },
  { name: "Vanguard", minStreak: 30, minHabits: 100, level: 3 },
  { name: "Apex", minStreak: 60, minHabits: 300, level: 4 },
  { name: "Sovereign", minStreak: 180, minHabits: 1000, level: 5 }
];

/**
 * Retrieve rank name, progress level, and details based on streak and total habits
 * A user must meet BOTH requirements (streak AND habits) to achieve a rank
 */
export function getRankInfo(streak, totalHabits) {
  let currentRankIndex = 0;
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (streak >= RANKS[i].minStreak && totalHabits >= RANKS[i].minHabits) {
      currentRankIndex = i;
      break;
    }
  }

  const currentRank = RANKS[currentRankIndex];
  const nextRank = RANKS[currentRankIndex + 1];

  let progressPercent = 0;
  let nextRankPoints = 0;
  let nextRankName = null;
  let nextRankRequirement = 'Max rank achieved';

  if (nextRank) {
    const streakProgress = Math.min(100, (streak / nextRank.minStreak) * 100);
    const habitsProgress = Math.min(100, (totalHabits / nextRank.minHabits) * 100);
    progressPercent = Math.round((streakProgress + habitsProgress) / 2);
    nextRankName = nextRank.name;
    const streakNeeded = Math.max(0, nextRank.minStreak - streak);
    const habitsNeeded = Math.max(0, nextRank.minHabits - totalHabits);
    nextRankRequirement = `${streakNeeded} day streak + ${habitsNeeded} habits needed`;
  } else {
    progressPercent = 100;
  }

  return {
    name: currentRank.name,
    level: currentRank.level,
    progressPercent,
    nextRankPoints,
    nextRankName,
    nextRankRequirement,
    streak,
    totalHabits
  };
}

/**
 * Calculate the monthly consistency improvement (this month vs last month rate)
 */
export function getMonthlyImprovement(habits, completionData) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thisMonthDays = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - 29 + i);
    thisMonthDays.push(d);
  }
  
  const lastMonthDays = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - 59 + i);
    lastMonthDays.push(d);
  }
  
  const thisMonthRate = getOverallConsistency(habits, completionData, thisMonthDays);
  const lastMonthRate = getOverallConsistency(habits, completionData, lastMonthDays);
  
  return thisMonthRate - lastMonthRate;
}
