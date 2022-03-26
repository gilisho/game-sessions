import { Measurement } from '.';

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
