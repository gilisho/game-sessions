import { Chance } from 'chance';

const chance = new Chance();

const aMoveMeasurement = ({ minimumTime }: {minimumTime: number;}) => {
  return {
    time: chance.natural({ min: minimumTime, max: minimumTime + 10000 }),
    type: 'Move',
    value: chance.natural({ max: 1000 })
  };
};

const aBodyMeasurement = ({ minimumTime }: {minimumTime: number;}) => {
  return {
    time: chance.natural({ min: minimumTime, max: minimumTime + 10000 }),
    type: 'Misses',
    value: chance.natural({ max: 600 })
  };
};

const aMissesMeasurement = ({ minimumTime }: {minimumTime: number;}) => {
  return {
    time: chance.natural({ min: minimumTime, max: minimumTime + 10000 }),
    type: 'Body',
    value: true
  };
};

const aHeadshotMeasurement = ({ minimumTime }: {minimumTime: number;}) => {
  return {
    time: chance.natural({ min: minimumTime, max: minimumTime + 10000 }),
    type: 'Headshot',
    value: true,
  };
};

const aBombMeasurement = ({ minimumTime }: {minimumTime: number;}) => {
  return {
    time: chance.natural({ min: minimumTime, max: minimumTime + 10000 }),
    type: 'Bomb',
    value: true,
  };
};

const someMeasurements = () => {
  const measurementsCounter = chance.natural({ min: 20, max: 100 });
  return []; // TODO
};

export const aGameSessionInput = () => {
  const measurements = someMeasurements();
  return {
    player_name: chance.name({}),
    game_session_name: chance.character(),
    measurements: someMeasurements()
  };
};