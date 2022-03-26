import {
  BodyMeasurement,
  BombMeasurement,
  HeadshotMeasurement,
  Measurement,
  MissesMeasurement,
  MoveMeasurement,
} from '../../../types';

export class MeasurementScoreCalculator {
  calculate = (measurement: Measurement) => {
    switch (measurement.type) {
      case 'Body':
        return this.getBodyScore(measurement);
      case 'Bomb':
        return this.getBombScore(measurement);
      case 'Headshot':
        return this.getHeadshotScore(measurement);
      case 'Misses':
        return this.getMissesScore(measurement);
      case 'Move':
        return this.getMoveScore(measurement);
    }
  };

  private getMoveScore = ({ value }: MoveMeasurement) => {
    if (value < 105) {
      return 100;
    }
    return value < 250 ? 70 : 0;
  };

  private getBombScore = ({ time }: BombMeasurement) => {
    return time < 40000 ? 100 : 0;
  };

  private getHeadshotScore = ({ value }: HeadshotMeasurement) => {
    return value ? 100 : 0;
  };

  private getBodyScore = ({ value }: BodyMeasurement) => {
    return value ? 80 : 0;
  };

  private getMissesScore = ({ value }: MissesMeasurement) => {
    if (value < 60) {
      return 100;
    }
    if (value <= 400) {
      return 70;
    }
    return 0;
  };
}
