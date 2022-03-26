import { RequestHandler } from 'express';
import {
  CreateGameSessionRequest,
  GetGameSessionResponse,
  ListGameSessionsResponse,
  CreateGameSessionResponse,
} from '../../types';
import { ScoreCalculator } from './scores/score-calculator';
import { GameSessionsStore } from '../../stores/game-sessions-store';

const gameSessionsStore = new GameSessionsStore();
const calculator = new ScoreCalculator();

const listGameSession: RequestHandler = async (req, res) => {
  const gameSessions = await gameSessionsStore.listGameSessions();

  const response: ListGameSessionsResponse = {
    gameSessions,
  };

  return res.json(response);
};

const getGameSession: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const gameSession = await gameSessionsStore.getGameSession(id);

  if (gameSession) {
    const response: GetGameSessionResponse = { gameSession };
    return res.json(response);
  } else {
    return res.status(404).json({ error: 'not_found' });
  }
};

const createGameSession: RequestHandler = async (req, res) => {
  const { gameSession: gameSessionInput }: CreateGameSessionRequest = req.body;

  if (!gameSessionInput) {
    return res.status(400).send('game session input is missing');
  }
  if (!gameSessionInput.game_session_name || !gameSessionInput.player_name) {
    return res.status(400).send('game session name or player name are missing');
  }
  if (
    !gameSessionInput.measurements ||
    gameSessionInput.measurements.length === 0
  ) {
    return res.status(400).send('measurements are missing');
  }

  const { skillScores, measurements } = calculator.calculate(
    gameSessionInput.measurements,
  );

  const id = await gameSessionsStore.createGameSession({
    measurements,
    gameSessionInput,
    skillScores,
  });

  const response: CreateGameSessionResponse = { id };

  return res.json(response);
};

export const gameSessionsController = {
  get: getGameSession,
  list: listGameSession,
  create: createGameSession,
};
