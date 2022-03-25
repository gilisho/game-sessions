import express from 'express';
import { GradeCalculator } from '../controllers/game-sessions/grade-calculator';
import { CreateGameSessionRequest, GameSessionRecord } from '../types';
import { randomUUID } from 'crypto';

const router = express.Router();

// Require controller modules.

const gameSessions: GameSessionRecord[] = [];

router.get('/', (req, res, next) => {
  // returns the list of game sessions (name and id)
  const gameSessionsList = gameSessions.map((session) => ({
    id: session.id,
    game_session_name: session.game_session_name,
  }));
  res.send({ gameSessions: gameSessionsList });
});

router.get('/:id', (req, res, next) => {
  // returns a game session by id
  const { id } = req.params;
  const gameSession = gameSessions.find((session) => session.id === id);

  if (gameSession) {
    res.send({ gameSession });
  }
  res.status(404);
});

router.post('/', (req, res, next) => {
  //  calculates the measurements' grades and accumulated scores, stores the information in the database and returns the game session id
  const { gameSession: gameSessionInput } =
    req.body as CreateGameSessionRequest;

  if (!gameSessionInput) {
    return res.status(400).send('game session input is missing');
  }

  const calculator = new GradeCalculator(gameSessionInput.measurements);
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
});

export { router as gameSessionsRouter };
