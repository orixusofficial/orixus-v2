import { useState, useEffect, useRef, useCallback } from 'react';
import { getRankForStreak, getRankIndex, RANKS } from '../utils/ranks';

export function useRankPromotion(streak) {
  const [showCeremony, setShowCeremony] = useState(false);
  const [oldRank, setOldRank] = useState(null);
  const [newRank, setNewRank] = useState(null);
  const previousStreakRef = useRef(0);
  const previousRankRef = useRef(null);
  const celebratedRanksRef = useRef(new Set());

  const checkRankPromotion = useCallback((currentStreak, previousStreak) => {
    if (currentStreak <= previousStreak) return null;

    const currentRank = getRankForStreak(currentStreak);
    const previousRank = getRankForStreak(previousStreak);
    
    if (currentRank.name !== previousRank.name) {
      const currentRankIndex = getRankIndex(currentRank.name);
      const previousRankIndex = getRankIndex(previousRank.name);
      
      // Only trigger if moving to a higher rank
      if (currentRankIndex > previousRankIndex) {
        // Check if this rank promotion has already been celebrated
        if (!celebratedRanksRef.current.has(currentRank.name)) {
          return {
            old: previousRank.name,
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
    celebratedRanksRef.current.add(promotion.new);
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

    const promotion = checkRankPromotion(streak, previousStreakRef.current);
    
    if (promotion) {
      triggerCeremony(promotion);
    }

    previousStreakRef.current = streak;
  }, [streak, checkRankPromotion, triggerCeremony]);

  // Reset celebrated ranks when streak drops significantly (e.g., user resets)
  useEffect(() => {
    if (streak === 0) {
      celebratedRanksRef.current.clear();
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
