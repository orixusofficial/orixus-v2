import { useState, useEffect, useRef, useCallback } from 'react';
import { getRankForStreak, getRankIndex, RANKS } from '../utils/ranks';

export function useRankPromotion(streak) {
  const [showCeremony, setShowCeremony] = useState(false);
  const [oldRank, setOldRank] = useState(null);
  const [newRank, setNewRank] = useState(null);
  const previousStreakRef = useRef(0);
  const previousRankRef = useRef(null);
  const initialRankSetRef = useRef(false);
  const sessionCelebratedRanksRef = useRef(new Set());

  const checkRankPromotion = useCallback((currentStreak) => {
    const currentRank = getRankForStreak(currentStreak);
    
    // On first load, set the initial rank without triggering ceremony
    if (!initialRankSetRef.current) {
      previousRankRef.current = currentRank.name;
      initialRankSetRef.current = true;
      return null;
    }
    
    // Only check for promotion if current rank differs from previous rank
    if (currentRank.name !== previousRankRef.current) {
      const currentRankIndex = getRankIndex(currentRank.name);
      const previousRankIndex = getRankIndex(previousRankRef.current);
      
      // Only trigger if moving to a higher rank
      if (currentRankIndex > previousRankIndex) {
        // Check if this rank has already been celebrated in the current session
        if (!sessionCelebratedRanksRef.current.has(currentRank.name)) {
          return {
            old: previousRankRef.current,
            new: currentRank.name
          };
        }
      }
    }

    return null;
  }, []);

  const triggerCeremony = useCallback((promotion) => {
    setOldRank(promotion.old);
    setNewRank(promotion.new);
    setShowCeremony(true);
    sessionCelebratedRanksRef.current.add(promotion.new);
  }, []);

  const handleClose = useCallback(() => {
    setShowCeremony(false);
    setOldRank(null);
    setNewRank(null);
  }, []);

  const handlePromote = useCallback(() => {
    // Placeholder for future promotion effects (e.g., save to profile, analytics)
    console.log('Rank promotion:', oldRank, '→', newRank);
  }, [oldRank, newRank]);

  useEffect(() => {
    if (streak === previousStreakRef.current) return;

    const promotion = checkRankPromotion(streak);
    
    if (promotion) {
      triggerCeremony(promotion);
    }

    previousStreakRef.current = streak;
    const currentRank = getRankForStreak(streak).name;
    if (currentRank !== previousRankRef.current) {
      previousRankRef.current = currentRank;
    }
  }, [streak, checkRankPromotion, triggerCeremony]);

  // Reset session state when streak drops to 0 (user resets)
  useEffect(() => {
    if (streak === 0) {
      sessionCelebratedRanksRef.current.clear();
      previousRankRef.current = null;
      initialRankSetRef.current = false;
    }
  }, [streak]);

  return {
    showCeremony,
    oldRank,
    newRank,
    onClose: handleClose,
    onPromote: handlePromote,
  };
}
