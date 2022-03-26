import {
  GameSessionListItem,
  GameSessionRecord,
  MeasurementRecord,
  MeasurementWithScore,
} from '../types';

export const toMeasurementWithScore = (
  measurement: MeasurementRecord,
): MeasurementWithScore => {
  const shouldConvertToBoolean =
    measurement.type === 'Bomb' ||
    measurement.type === 'Headshot' ||
    measurement.type === 'Body';
  return {
    time: measurement.time,
    score: measurement.score,
    type: measurement.type,
    value: shouldConvertToBoolean
      ? Boolean(measurement.value)
      : measurement.value,
  } as MeasurementWithScore;
};

export const toGameSessionListItem = (
  gameSessionRecord: GameSessionRecord,
): GameSessionListItem => ({
  id: gameSessionRecord.id,
  game_session_name: gameSessionRecord.name,
});
