/*
This file is for defining the API - in terms of what the server is expecting to receive
and what the client should expect to get as a response.
 */

import { GameSessionInput, GameSessionRecord } from '../types';

export interface CreateGameSessionRequest {
  gameSession: GameSessionInput;
}
export interface CreateGameSessionResponse {
  id: string;
}

export interface ListGameSessionsRequest {}
export interface ListGameSessionsResponse {
  gameSessions: {
    id: string;
    game_session_name: string;
  }[];
}

export interface GetGameSessionRequest {
  id: string;
}
export interface GetGameSessionResponse {
  gameSession: GameSessionRecord;
}
