export const MAX_SCORE = 10_000;
export const SCORE_OPTIONS = [300, 500, 1000, 3000] as const;

export const REWARD_CHECKPOINTS = [
  { value: 5000, name: 'รางวัล A' },
  { value: 7500, name: 'รางวัล B' },
  { value: 10000, name: 'รางวัล C' },
] as const;

export function hasReachedMaxScore(score: number) {
  return score >= MAX_SCORE;
}

export function scorePercentage(score: number) {
  return Math.min(100, (score / MAX_SCORE) * 100);
}
