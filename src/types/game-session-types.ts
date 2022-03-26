import { Measurement } from '.';

export interface GameSessionInput {
  player_name: string;
  game_session_name: string;
  measurements: Measurement[];
}

export interface GameSessionRecord {
  id: string;
  name: string;
  player_name: string;
  date_created: Date;
  speed_score: number;
  accuracy_score: number;
}

export interface GameSession {
  id: string;
  name: string;
  player_name: string;
  date_created: Date;
  speed_score: number;
  accuracy_score: number;
  measurements: Measurement[];
}
