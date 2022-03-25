import { Chance } from 'chance';
import {
  BodyMeasurement,
  BombMeasurement,
  GameSessionInput,
  HeadshotMeasurement,
  Measurement,
  MissesMeasurement,
  MoveMeasurement,
} from '../types';

const chance = new Chance();

const aMoveMeasurement = ({
  minimumTime,
}: {
  minimumTime: number;
}): MoveMeasurement => {
  return {
    time: chance.natural({ min: minimumTime, max: minimumTime + 10000 }),
    type: 'Move',
    value: chance.natural({ max: 1000 }),
  };
};

const aMissesMeasurement = ({
  minimumTime,
}: {
  minimumTime: number;
}): MissesMeasurement => {
  return {
    time: chance.natural({ min: minimumTime, max: minimumTime + 10000 }),
    type: 'Misses',
    value: chance.natural({ max: 600 }),
  };
};

const aBodyMeasurement = ({
  minimumTime,
}: {
  minimumTime: number;
}): BodyMeasurement => {
  return {
    time: chance.natural({ min: minimumTime, max: minimumTime + 10000 }),
    type: 'Body',
    value: true,
  };
};

const aHeadshotMeasurement = ({
  minimumTime,
}: {
  minimumTime: number;
}): HeadshotMeasurement => {
  return {
    time: chance.natural({ min: minimumTime, max: minimumTime + 10000 }),
    type: 'Headshot',
    value: true,
  };
};

const aBombMeasurement = ({
  minimumTime,
}: {
  minimumTime: number;
}): BombMeasurement => {
  return {
    time: chance.natural({ min: minimumTime, max: minimumTime + 10000 }),
    type: 'Bomb',
    value: true,
  };
};

const aNonBombMeasurement = ({ minTime }: { minTime: number }) => {
  const buildersToPickFrom = [
    aHeadshotMeasurement,
    aBodyMeasurement,
    aMissesMeasurement,
    aMoveMeasurement,
  ];
  const builder = chance.pickone(buildersToPickFrom);
  return builder({ minimumTime: minTime });
};

const someMeasurements = ({
  withBomb = chance.bool(),
  numOfMeasurements = chance.natural({ min: 20, max: 100 }),
}: { withBomb?: boolean; numOfMeasurements?: number } = {}): Measurement[] => {
  const measurements = [];

  let currentTime = 0;
  for (let i = 0; i < numOfMeasurements - 1; i++) {
    const measurement = aNonBombMeasurement({ minTime: currentTime });
    measurements.push(measurement);
    currentTime = measurement.time;
  }

  const lastMeasurement = withBomb
    ? aBombMeasurement({ minimumTime: currentTime })
    : aNonBombMeasurement({ minTime: currentTime });
  measurements.push(lastMeasurement);

  return measurements;
};

export const aGameSessionInput = (): GameSessionInput => {
  const measurements = someMeasurements();
  return {
    player_name: chance.name({}),
    game_session_name: chance.character(),
    measurements,
  };
};
