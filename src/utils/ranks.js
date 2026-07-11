export const RANKS = [
  { name: 'Initiate', threshold: 0 },
  { name: 'Ascendant', threshold: 7 },
  { name: 'Vanguard', threshold: 30 },
  { name: 'Apex', threshold: 90 },
  { name: 'Sovereign', threshold: 365 },
];

export function getRankForStreak(streak) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (streak >= RANKS[i].threshold) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

export function getRankIndex(rankName) {
  return RANKS.findIndex(r => r.name === rankName);
}
