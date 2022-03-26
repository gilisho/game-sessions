import { aGameSessionInput } from './builders';
import { Chance } from 'chance';

const chance = new Chance();

export const mockGameSessionInputs = (count: number = 5) => {
  return chance.n(() => aGameSessionInput(), count);
};
