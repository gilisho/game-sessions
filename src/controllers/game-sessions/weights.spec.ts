import {
  BODY_WEIGHT,
  BOMB_WEIGHT,
  HEADSHOT_WEIGHT,
  MISSES_WEIGHT,
  MOVE_WEIGHT,
} from './weights';

describe('measurement type weights', () => {
  it('should be total of 1 for speed skill', () => {
    expect(MOVE_WEIGHT + BOMB_WEIGHT).toEqual(1);
  });

  it('should be total of 1 for accuracy skill', () => {
    expect(MISSES_WEIGHT + HEADSHOT_WEIGHT + BODY_WEIGHT).toEqual(1);
  });
});
