import { toMySqlTime } from './time';
import { Chance } from 'chance';

const chance = new Chance();

describe('time utils', () => {
  it('should convert to mysql time', () => {
    const date = chance.date();
    expect(toMySqlTime(date)).toEqual(
      date.toJSON().slice(0, 19).replace('T', ' '),
    );
  });
});
