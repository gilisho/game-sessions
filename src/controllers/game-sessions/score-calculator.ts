import {
  BodyMeasurement,
  BombMeasurement,
  HeadshotMeasurement,
  Measurement,
  MeasurementType,
  MeasurementWithScore,
  MissesMeasurement,
  MoveMeasurement,
} from '../../types';
import { MeasurementScoreCalculator } from './scores/measurement-score-calculator';
import { SkillScoreCalculator } from './scores/skill-score-calculator';

export class ScoreCalculator {
  private measurementScoreCalculator: MeasurementScoreCalculator;
  private skillScoreCalculator: SkillScoreCalculator;

  constructor() {
    this.measurementScoreCalculator = new MeasurementScoreCalculator();
    this.skillScoreCalculator = new SkillScoreCalculator();
  }

  calculate = (
    measurements: Measurement[],
  ): {
    skillScores: { speedScore: number; accuracyScore: number };
    accumulatedAverage: Record<MeasurementType, { averageScore: number }>;
    measurements: MeasurementWithScore[];
  } => {
    const measurementsWithScore = measurements.map((measurement) => {
      return {
        ...measurement,
        score: this.measurementScoreCalculator.calculate(measurement),
      };
    });
    const accumulatedAverage = this.getAccumulatedAverage(
      measurementsWithScore,
    );
    const speedScore =
      this.skillScoreCalculator.getSpeedScore(accumulatedAverage);
    const accuracyScore =
      this.skillScoreCalculator.getAccuracyScore(accumulatedAverage);
    return {
      skillScores: { speedScore, accuracyScore },
      accumulatedAverage,
      measurements: measurementsWithScore,
    };
  };

  private getAccumulatedAverage = (
    measurementsWithScore: MeasurementWithScore[],
  ): Record<MeasurementType, { averageScore: number }> => {
    const measurementsByType = this.splitByMeasurementType(
      measurementsWithScore,
    );
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

  private splitByMeasurementType = (
    measurementsWithScore: MeasurementWithScore[],
  ) => {
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
        measurements: measurementsWithScore.filter(isBombMeasurement),
      },
      Headshot: {
        measurements: measurementsWithScore.filter(isHeadshotMeasurement),
      },
      Body: {
        measurements: measurementsWithScore.filter(isBodyMeasurement),
      },
      Misses: {
        measurements: measurementsWithScore.filter(isMissesMeasurement),
      },
      Move: {
        measurements: measurementsWithScore.filter(isMoveMeasurement),
      },
    };
  };
}
