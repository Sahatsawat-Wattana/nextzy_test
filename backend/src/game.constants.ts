export const SCORE_OPTIONS = [300, 500, 1000, 3000] as const;
export const MAX_SCORE = 10_000;
export const PLAYER_ID = 1;
export const REWARDS: Readonly<Record<number, string>> = {
  5000: 'รางวัล A',
  7500: 'รางวัล B',
  10000: 'รางวัล C',
};

export function cappedScore(current: number, earned: number) {
  return Math.min(MAX_SCORE, current + earned);
}

export function hasReachedMaxScore(score: number) {
  return score >= MAX_SCORE;
}
