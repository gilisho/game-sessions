import {
  BodyMeasurement,
  BombMeasurement,
  HeadshotMeasurement,
  Measurement,
  MeasurementType,
  MissesMeasurement,
  MoveMeasurement,
} from '../../types';
import {
  BODY_WEIGHT,
  BOMB_WEIGHT,
  HEADSHOT_WEIGHT,
  MISSES_WEIGHT,
  MOVE_WEIGHT,
} from './weights';
import { MeasurementScoreCalculator } from './measurement-score-calculator';

export class ScoreCalculator {
  private readonly measurements: (Measurement & { score: number })[];
  private measurementScoreCalculator: MeasurementScoreCalculator;

  constructor(measurements: Measurement[]) {
    this.measurementScoreCalculator = new MeasurementScoreCalculator();
    this.measurements =
      this.measurementScoreCalculator.calculateMeasurementScores(measurements);
  }

  calculate = (): {
    skillScores: { speedScore: number; accuracyScore: number };
    accumulatedAverage: Record<MeasurementType, { averageScore: number }>;
    measurements: (Measurement & { score: number })[];
  } => {
    const accumulatedAverage = this.getAccumulatedAverage();
    const speedScore = this.getSpeedSkillScore(accumulatedAverage);
    const accuracyScore = this.getAccuracySkillScore(accumulatedAverage);
    return {
      skillScores: { speedScore, accuracyScore },
      accumulatedAverage,
      measurements: this.measurements,
    };
  };

  private getAccumulatedAverage = (): Record<
    MeasurementType,
    { averageScore: number }
  > => {
    const measurementsByType = this.splitByMeasurementType();
    return Object.fromEntries(
      Object.entries(measurementsByType).map(
        ([measurementType, { measurements: measurementsOfType }]) => {
          let totalScore = 0;
          measurementsOfType.forEach((measurement) => {
            totalScore += measurement.score;
          });

          const averageScore = totalScore / measurementsOfType.length;

          return [measurementType, { averageScore }];
        },
      ),
    ) as Record<MeasurementType, { averageScore: number }>;
  };

  private splitByMeasurementType = () => {
    const isBombMeasurement = (
      measurement: Measurement,
    ): measurement is BombMeasurement => measurement.type === 'Bomb';
    const isBodyMeasurement = (
      measurement: Measurement,
    ): measurement is BodyMeasurement => measurement.type === 'Body';
    const isHeadshotMeasurement = (
      measurement: Measurement,
    ): measurement is HeadshotMeasurement => measurement.type === 'Headshot';
    const isMissesMeasurement = (
      measurement: Measurement,
    ): measurement is MissesMeasurement => measurement.type === 'Misses';
    const isMoveMeasurement = (
      measurement: Measurement,
    ): measurement is MoveMeasurement => measurement.type === 'Move';

    return {
      Bomb: {
        measurements: this.measurements.filter(isBombMeasurement),
      },
      Headshot: {
        measurements: this.measurements.filter(isHeadshotMeasurement),
      },
      Body: {
        measurements: this.measurements.filter(isBodyMeasurement),
      },
      Misses: {
        measurements: this.measurements.filter(isMissesMeasurement),
      },
      Move: {
        measurements: this.measurements.filter(isMoveMeasurement),
      },
    };
  };

  private getSpeedSkillScore = (
    accumulatedScores: Record<MeasurementType, { averageScore: number }>,
  ): number => {
    return (
      accumulatedScores.Bomb.averageScore * BOMB_WEIGHT +
      accumulatedScores.Move.averageScore * MOVE_WEIGHT
    );
  };

  private getAccuracySkillScore = (
    accumulatedScores: Record<MeasurementType, { averageScore: number }>,
  ): number => {
    return (
      accumulatedScores.Body.averageScore * BODY_WEIGHT +
      accumulatedScores.Misses.averageScore * MISSES_WEIGHT +
      accumulatedScores.Headshot.averageScore * HEADSHOT_WEIGHT
    );
  };
}
