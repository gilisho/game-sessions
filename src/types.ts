export type MeasurementType = 'Bomb' | 'Body' | 'Headshot' | 'Move' | 'Misses';

export interface BombMeasurement {
  time: number;
  type: 'Bomb';
  value: boolean;
}

export interface BodyMeasurement {
  time: number;
  type: 'Body';
  value: boolean;
}

export interface HeadshotMeasurement {
  time: number;
  type: 'Headshot';
  value: boolean;
}

export interface MoveMeasurement {
  time: number;
  type: 'Move';
  value: number;
}

export interface MissesMeasurement {
  time: number;
  type: 'Misses';
  value: number;
}

export type Measurement =
  | HeadshotMeasurement
  | BodyMeasurement
  | BombMeasurement
  | MoveMeasurement
  | MissesMeasurement;

export interface GameSessionInput {
  player_name: string;
  game_session_name: string;
  measurements: Measurement[];
}

export interface GameSessionRecord {
  id: string;
  player_name: string;
  game_session_name: string;
  dateCreated: Date;
  speedScore: number;
  accuracyScore: number;
}

export interface CreateGameSessionRequest {
  gameSession: GameSessionInput;
}
