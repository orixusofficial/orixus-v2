import { useState, useEffect, useRef, useCallback } from 'react';

const MILESTONES = [7, 30, 90];

export function useStreakCelebration(streak, customMilestone) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(null);
  const previousStreakRef = useRef(0);
  const celebratedMilestonesRef = useRef(new Set());

  const allMilestones = customMilestone 
    ? [...MILESTONES, customMilestone].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b)
    : MILESTONES;

  const checkMilestone = useCallback((currentStreak, previousStreak) => {
    if (currentStreak <= previousStreak) return null;

    for (const milestone of allMilestones) {
      if (currentStreak === milestone && !celebratedMilestonesRef.current.has(milestone)) {
        return milestone;
      }
    }

    return null;
  }, [allMilestones]);

  const triggerCelebration = useCallback((milestoneStreak) => {
    setCelebrationStreak(milestoneStreak);
    setShowCelebration(true);
    celebratedMilestonesRef.current.add(milestoneStreak);
  }, []);

  const handleClose = useCallback(() => {
    setShowCelebration(false);
    setCelebrationStreak(null);
  }, []);

  const handleCelebrate = useCallback(() => {
    // Placeholder for future audio or other celebration effects
    console.log('Celebration triggered for streak:', celebrationStreak);
  }, [celebrationStreak]);

  useEffect(() => {
    if (streak === previousStreakRef.current) return;

    const milestone = checkMilestone(streak, previousStreakRef.current);
    
    if (milestone) {
      triggerCelebration(milestone);
    }

    previousStreakRef.current = streak;
  }, [streak, checkMilestone, triggerCelebration]);

  // Reset celebrated milestones when streak drops significantly (e.g., user resets)
  useEffect(() => {
    if (streak === 0) {
      celebratedMilestonesRef.current.clear();
    }
  }, [streak]);

  return {
    showCelebration,
    celebrationStreak,
    customMilestone,
    onClose: handleClose,
    onCelebrate: handleCelebrate,
  };
}
