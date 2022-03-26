import {
  BodyMeasurement,
  BombMeasurement,
  HeadshotMeasurement,
  Measurement,
  MissesMeasurement,
  MoveMeasurement,
} from '../../types';

export class MeasurementScoreCalculator {
  calculateMeasurementGrades = (measurements: Measurement[]) => {
    return measurements.map((measurement) => {
      return { ...measurement, grade: this.getMeasurementScore(measurement) };
    });
  };

  private getMeasurementScore = (measurement: Measurement) => {
    switch (measurement.type) {
      case 'Body':
        return this.getBodyGrade(measurement);
      case 'Bomb':
        return this.getBombGrade(measurement);
      case 'Headshot':
        return this.getHeadshotGrade(measurement);
      case 'Misses':
        return this.getMissesGrade(measurement);
      case 'Move':
        return this.getMoveGrade(measurement);
    }
  };

  private getMoveGrade = ({ value }: MoveMeasurement) => {
    if (value < 105) {
      return 100;
    }
    return value < 250 ? 70 : 0;
  };

  private getBombGrade = ({ time }: BombMeasurement) => {
    return time < 40000 ? 100 : 0;
  };

  private getHeadshotGrade = ({ value }: HeadshotMeasurement) => {
    return value ? 100 : 0;
  };

  private getBodyGrade = ({ value }: BodyMeasurement) => {
    return value ? 80 : 0;
  };

  private getMissesGrade = ({ value }: MissesMeasurement) => {
    if (value < 60) {
      return 100;
    }
    if (value <= 400) {
      return 70;
    }
    return 0;
  };
}
