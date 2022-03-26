import { MeasurementType } from '../../types';
import {
  BODY_WEIGHT,
  BOMB_WEIGHT,
  HEADSHOT_WEIGHT,
  MISSES_WEIGHT,
  MOVE_WEIGHT,
} from './weights';

export class SkillScoreCalculator {
  getSpeedScore = (
    accumulatedScores: Record<MeasurementType, { averageScore: number }>,
  ): number => {
    return (
      accumulatedScores.Bomb.averageScore * BOMB_WEIGHT +
      accumulatedScores.Move.averageScore * MOVE_WEIGHT
    );
  };

  getAccuracyScore = (
    accumulatedScores: Record<MeasurementType, { averageScore: number }>,
  ): number => {
    return (
      accumulatedScores.Body.averageScore * BODY_WEIGHT +
      accumulatedScores.Misses.averageScore * MISSES_WEIGHT +
      accumulatedScores.Headshot.averageScore * HEADSHOT_WEIGHT
    );
  };
}
