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

export class GradeCalculator {
  private readonly measurements: (Measurement & { grade: number })[];

  constructor(measurements: Measurement[]) {
    this.measurements = this.calculateMeasurementGrades(measurements);
  }

  calculate = (): {
    skillScores: { speedScore: number; accuracyScore: number };
    accumulatedAverage: Record<MeasurementType, { averageScore: number }>;
    measurements: (Measurement & { grade: number })[];
  } => {
    const accumulatedAverage = this.getAccumulatedAverage();
    const speedScore = this.getSpeedSkillGrade(accumulatedAverage);
    const accuracyScore = this.getAccuracySkillGrade(accumulatedAverage);
    return {
      skillScores: { speedScore, accuracyScore },
      accumulatedAverage,
      measurements: this.measurements,
    };
  };

  /**
   * Gets accumulated average of all measurement types.
   */
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
            totalScore += measurement.grade;
          });

          const averageScore = totalScore / measurementsOfType.length;

          return [measurementType, { averageScore }];
        },
      ),
    ) as Record<MeasurementType, { averageScore: number }>;
  };

  // private getSpeedGrade = (measurements: Measurement[]) => {
  //   const speedMeasurements = measurements.filter(this.isSpeedMeasurement);
  //   speedMeasurements.reduce((score, measurement) => {
  //     const measurementGrade =
  //       measurement.type === 'Move'
  //         ? this.getMoveGrade(measurement)
  //         : this.getBombGrade(measurement);
  //     return score + measurementGrade;
  //   }, 0);
  // };

  // private isMeasurementOfType =
  //   <T extends MeasurementType>(measurementType: T) =>
  //   (measurement: Measurement): measurement is T => {
  //     return measurement.type === measurementType;
  //   };

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

  // private getAverageForMeasurementType = <T extends MeasurementType>(
  //   measurements: Measurement[],
  //   measurementType: T,
  // ) => {
  //   const relevantMeasures = this.splitByMeasurementType(measurements);
  //   const grader = this.getMeasurementGrader(measurementType);
  //   return relevantMeasures.reduce((totalScore, measurement) => {
  //     const measurementGrade = grader(measurement);
  //     return totalScore + measurementGrade;
  //   }, 0);
  // };

  private getMeasurementGrade = (measurement: Measurement) => {
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

  private calculateMeasurementGrades = (measurements: Measurement[]) => {
    return measurements.map((measurement) => {
      return { ...measurement, grade: this.getMeasurementGrade(measurement) };
    });
  };

  private getSpeedSkillGrade = (
    accumulatedGrades: Record<MeasurementType, { averageScore: number }>,
  ): number => {
    return (
      accumulatedGrades.Bomb.averageScore * BOMB_WEIGHT +
      accumulatedGrades.Move.averageScore * MOVE_WEIGHT
    );
  };

  private getAccuracySkillGrade = (
    accumulatedGrades: Record<MeasurementType, { averageScore: number }>,
  ): number => {
    return (
      accumulatedGrades.Body.averageScore * BODY_WEIGHT +
      accumulatedGrades.Misses.averageScore * MISSES_WEIGHT +
      accumulatedGrades.Headshot.averageScore * HEADSHOT_WEIGHT
    );
  };

  // private getMeasurementGrade = (measurement: Measurement) => {
  //   const graders = {
  //     Bomb: this.getBombGrade,
  //     Move: this.getMoveGrade,
  //     Headshot: this.getHeadshotGrade,
  //     Body: this.getBodyGrade,
  //     Misses: this.getMissesGrade,
  //   };
  //   switch (measurement.type) {
  //     case 'Body':
  //       this.getBodyGrade(measurement);
  //   }
  //   return graders[measurement.type](measurement);
  // };

  // private isSpeedMeasurement = (
  //   measurement: Measurement,
  // ): measurement is SpeedMeasurement =>
  //   measurement.type === 'Bomb' || measurement.type === 'Move';

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

/*
 Speed’s measurement types are:
 Move - The time of a mouse movement from mid screen to a target (value in miliSeconds int) – Can happen several times in a session.
 Bomb - The total time it took to implant a bomb – Can happen only once at the most (value in boolean).
*/

// /*
//  Accuracy’s measurement types are:
//  Misses - The distance of a shot from a target’s head (value in pixels int) – Can happen several times in a session.
//  Headshot – A direct hit in the head of a target (value in boolean) - Can happen several times in a session.
//  Body hit - A direct hit in the body of a target (value in boolean) - Can happen several times in a session
// */
