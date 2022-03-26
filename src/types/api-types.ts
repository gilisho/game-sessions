/*
This file is for defining the API - in terms of what the server is expecting to receive
and what the client should expect to get as a response.
 */

import { GameSession, GameSessionInput, GameSessionListItem } from '.';

export interface CreateGameSessionRequest {
  gameSession: GameSessionInput;
}
export interface CreateGameSessionResponse {
  id: string;
}

export interface ListGameSessionsRequest {}
export interface ListGameSessionsResponse {
  gameSessions: GameSessionListItem[];
}

export interface GetGameSessionRequest {
  id: string;
}
export interface GetGameSessionResponse {
  gameSession: GameSession;
}
