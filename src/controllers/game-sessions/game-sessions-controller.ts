import { RequestHandler } from 'express';
import {
  GameSessionRecord,
  CreateGameSessionRequest,
  CreateGameSessionResponse,
  GetGameSessionResponse,
  ListGameSessionsResponse,
} from '../../types';
import { ScoreCalculator } from './score-calculator';
import { randomUUID } from 'crypto';
import { database } from '../../db';
import { toMySqlTime } from './time';

const GAME_SESSIONS_TABLE = 'game_sessions';

const listGameSession: RequestHandler = (req, res, next) => {
  // returns the list of game sessions (name and id)
  database.query(
    {
      sql: `SELECT * FROM game_sessions;`,
    },
    [],
    (err, rows: GameSessionRecord[]) => {
      if (err) {
        throw err;
      }
      console.log(rows);
      const response: ListGameSessionsResponse = {
        gameSessions: rows.map((row) => ({
          id: row.id,
          game_session_name: row.name,
        })),
      };
      res.send(response);
    },
  );
};

const getGameSession: RequestHandler = (req, res, next) => {
  const { id } = req.params;
  database.query(
    {
      sql: `SELECT * FROM game_sessions WHERE id = ?;`,
    },
    [id],
    (err, [gameSession]: GameSessionRecord[]) => {
      if (err) {
        throw err;
      }
      if (gameSession) {
        const response: GetGameSessionResponse = {
          gameSession: { ...gameSession, measurements: [] },
        };
        return res.json(response);
      }
      res.status(404).json({ error: 'not_found' });
    },
  );
};

const createGameSession: RequestHandler = (req, res, next) => {
  const { gameSession: gameSessionInput }: CreateGameSessionRequest = req.body;

  if (!gameSessionInput) {
    return res.status(400).send('game session input is missing');
  }

  const calculator = new ScoreCalculator();
  const {
    skillScores: { speedScore, accuracyScore },
  } = calculator.calculate(gameSessionInput.measurements);
  const gameSessionId = randomUUID();

  database.query(
    {
      sql: `INSERT INTO ${GAME_SESSIONS_TABLE} (id, name, player_name, date_created, speed_score, accuracy_score) VALUES (?, ?, ?, ?, ?, ?);`,
      values: [
        gameSessionId,
        gameSessionInput.game_session_name,
        gameSessionInput.player_name,
        toMySqlTime(),
        speedScore,
        accuracyScore,
      ],
    },
    (err) => {
      if (err) {
        throw err;
      }
      const response: CreateGameSessionResponse = { id: gameSessionId };
      res.send(response);
    },
  );
};

export const gameSessionsController = {
  get: getGameSession,
  list: listGameSession,
  create: createGameSession,
};
