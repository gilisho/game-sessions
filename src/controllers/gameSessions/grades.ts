import { Measurement } from '../../types';

const isSpeedMeasurement = (measurement: Measurement) =>
  measurement.type === 'Bomb' || measurement.type === 'Move';

const getMoveGrade = (measurementValue: Measurement['value']) => {
  if (measurementValue < 105) {
    return 100;
  }
  return measurementValue < 250 ? 70 : 0;
};

const getBombGrade = (measurementTime: Measurement['time']) => {
  return measurementTime < 40000 ? 100 : 0;
};

/*
 Speed’s measurement types are:
 Move - The time of a mouse movement from mid screen to a target (value in miliSeconds int) – Can happen several times in a session.
 Bomb - The total time it took to implant a bomb – Can happen only once at the most (value in boolean).
*/
export const getSpeedGrade = (measurements: Measurement[]) => {
  const speedMeasurement = measurements.filter(isSpeedMeasurement);
  speedMeasurement.reduce((score, measurement) => {
    if (measurement.value < 105) {
      return score + 100;
    }
    return measurement.value < 250 ? score + 70 : score;
  }, 0);
};

/*
 Accuracy’s measurement types are:
 Misses - The distance of a shot from a target’s head (value in pixels int) – Can happen several times in a session.
 Headshot – A direct hit in the head of a target (value in boolean) - Can happen several times in a session.
 Body hit - A direct hit in the body of a target (value in boolean) - Can happen several times in a session
*/
