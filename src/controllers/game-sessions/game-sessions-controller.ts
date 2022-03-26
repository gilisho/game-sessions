import { RequestHandler } from 'express';
import {
  GameSessionRecord,
  CreateGameSessionRequest,
  CreateGameSessionResponse,
  GetGameSessionResponse,
  ListGameSessionsResponse,
  MeasurementRecord,
} from '../../types';
import { ScoreCalculator } from './score-calculator';
import { randomUUID } from 'crypto';
import { database } from '../../db';
import { toMySqlTime } from './utils';
import { aTransaction } from '../../utils/sql';
import { toGameSessionListItem, toMeasurementWithScore } from './transformers';

const GAME_SESSIONS_TABLE = 'game_sessions';
const MEASUREMENTS_TABLE = 'measurements';

const listGameSession: RequestHandler = (req, res) => {
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
      const response: ListGameSessionsResponse = {
        gameSessions: rows.map(toGameSessionListItem),
      };
      return res.json(response);
    },
  );
};

const getGameSession: RequestHandler = (req, res) => {
  const { id } = req.params;
  database.query(
    {
      sql: `SELECT * FROM ${GAME_SESSIONS_TABLE} WHERE id = ?;`,
    },
    [id],
    (err, [gameSession]: GameSessionRecord[]) => {
      if (err) {
        throw err;
      }
      if (gameSession) {
        database.query(
          {
            sql: `SELECT * FROM ${MEASUREMENTS_TABLE} where game_session_id = ? ORDER BY time ASC;`,
          },
          [id],
          (_err, measurements: MeasurementRecord[]) => {
            if (_err) {
              throw err;
            }
            const measurementsForResponse = measurements.map(
              toMeasurementWithScore,
            );
            const response: GetGameSessionResponse = {
              gameSession: {
                ...gameSession,
                measurements: measurementsForResponse,
              },
            };
            return res.json(response);
          },
        );
      } else {
        return res.status(404).json({ error: 'not_found' });
      }
    },
  );
};

const createGameSession: RequestHandler = (req, res) => {
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

  const calculator = new ScoreCalculator();
  const {
    skillScores: { speedScore, accuracyScore },
    measurements,
  } = calculator.calculate(gameSessionInput.measurements);
  const gameSessionId = randomUUID();

  const transaction = aTransaction();

  const createGameSessionQuery = `INSERT INTO ${GAME_SESSIONS_TABLE} (id, name, player_name, date_created, speed_score, accuracy_score) VALUES (?, ?, ?, ?, ?, ?);`;
  transaction.withQuery(createGameSessionQuery, [
    gameSessionId,
    gameSessionInput.game_session_name,
    gameSessionInput.player_name,
    toMySqlTime(),
    Number.parseInt(String(speedScore), 10),
    Number.parseInt(String(accuracyScore), 10),
  ]);

  const createMeasurementQuery = `INSERT INTO ${MEASUREMENTS_TABLE} (id, type, value, time, score, game_session_id) VALUES (?, ?, ?, ?, ?, ?);`;
  measurements.forEach((measurement) => {
    transaction.withQuery(createMeasurementQuery, [
      randomUUID(),
      measurement.type,
      measurement.value,
      measurement.time,
      measurement.score,
      gameSessionId,
    ]);
  });

  const { params, query } = transaction.toSql();

  database.query(
    {
      sql: query,
      values: params,
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
