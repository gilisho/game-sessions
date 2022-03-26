import { RequestHandler } from 'express';
import { CreateGameSessionRequest, GameSessionRecord } from '../../types';
import { ScoreCalculator } from './score-calculator';
import { randomUUID } from 'crypto';

const gameSessions: GameSessionRecord[] = [];

export const gameSessionsController: {
  [operation: string]: RequestHandler;
} = {
  list: (req, res, next) => {
    // returns the list of game sessions (name and id)
    const gameSessionsList = gameSessions.map((session) => ({
      id: session.id,
      game_session_name: session.game_session_name,
    }));
    res.send({ gameSessions: gameSessionsList });
  },
  get: (req, res, next) => {
    // returns a game session by id
    const { id } = req.params;
    const gameSession = gameSessions.find((session) => session.id === id);

    if (gameSession) {
      res.send({ gameSession });
    }
    res.status(404);
  },
  create: (req, res, next) => {
    //  calculates the measurements' grades and accumulated scores, stores the information in the database and returns the game session id
    const { gameSession: gameSessionInput } =
      req.body as CreateGameSessionRequest;

    if (!gameSessionInput) {
      return res.status(400).send('game session input is missing');
    }

    const calculator = new ScoreCalculator(gameSessionInput.measurements);
    const {
      skillScores: { speedScore, accuracyScore },
    } = calculator.calculate();

    const gameSession: GameSessionRecord = {
      player_name: gameSessionInput.player_name,
      game_session_name: gameSessionInput.game_session_name,
      speedScore,
      accuracyScore,
      dateCreated: new Date(),
      id: randomUUID(),
    };

    gameSessions.push(gameSession);

    res.send({ id: gameSession.id });
  },
};
