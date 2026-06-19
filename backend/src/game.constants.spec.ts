import { cappedScore, hasReachedMaxScore } from './game.constants';
describe('cappedScore', () => {
  it('adds earned points', () => expect(cappedScore(500, 300)).toBe(800));
  it('caps total at 10,000', () => expect(cappedScore(9500, 3000)).toBe(10000));
  it('recognizes the maximum score', () => expect(hasReachedMaxScore(10000)).toBe(true));
  it('allows scores below the maximum', () => expect(hasReachedMaxScore(9999)).toBe(false));
});
