import { cappedScore } from './game.constants';
describe('cappedScore', () => {
  it('adds earned points', () => expect(cappedScore(500, 300)).toBe(800));
  it('caps total at 10,000', () => expect(cappedScore(9500, 3000)).toBe(10000));
});
