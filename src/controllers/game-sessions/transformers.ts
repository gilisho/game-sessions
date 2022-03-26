import {
  GameSessionListItem,
  GameSessionRecord,
  MeasurementRecord,
  MeasurementWithScore,
} from '../../types';

export const toMeasurementWithScore = (
  measurement: MeasurementRecord,
): MeasurementWithScore =>
  ({
    time: measurement.time,
    score: measurement.score,
    type: measurement.type,
    value: measurement.value,
  } as MeasurementRecord);

export const toGameSessionListItem = (
  gameSessionRecord: GameSessionRecord,
): GameSessionListItem => ({
  id: gameSessionRecord.id,
  game_session_name: gameSessionRecord.name,
});
