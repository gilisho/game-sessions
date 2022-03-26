import {
  aTransaction,
  toGameSessionListItem,
  toMeasurementWithScore,
  toMySqlTime,
} from './utils';
import { randomUUID } from 'crypto';
import { database, GAME_SESSIONS_TABLE, MEASUREMENTS_TABLE } from '../db';
import {
  GameSession,
  GameSessionInput,
  GameSessionListItem,
  GameSessionRecord,
  MeasurementRecord,
  MeasurementWithScore,
} from '../types';

export class GameSessionsStore {
  listGameSessions = (): Promise<GameSessionListItem[]> => {
    return new Promise((res, rej) => {
      database.query(
        {
          sql: `SELECT * FROM ${GAME_SESSIONS_TABLE};`,
        },
        [],
        (err, rows: GameSessionRecord[]) => {
          if (err) {
            rej(err);
          }
          res(rows.map(toGameSessionListItem));
        },
      );
    });
  };

  getGameSession = async (id: string): Promise<GameSession | null> => {
    const gameSessionRecord: GameSessionRecord = await new Promise(
      (res, rej) => {
        database.query(
          {
            sql: `SELECT * FROM ${GAME_SESSIONS_TABLE} WHERE id = ?;`,
          },
          [id],
          (err, [gameSession]: GameSessionRecord[]) => {
            if (err) {
              rej(err);
            }
            res(gameSession);
          },
        );
      },
    );

    if (!gameSessionRecord) {
      return null;
    }

    const measurements: MeasurementWithScore[] = await new Promise(
      (res, rej) => {
        database.query(
          {
            sql: `SELECT * FROM ${MEASUREMENTS_TABLE} where game_session_id = ? ORDER BY time ASC;`,
          },
          [id],
          (err, measurementRecords: MeasurementRecord[]) => {
            if (err) {
              rej(err);
            }
            res(measurementRecords.map(toMeasurementWithScore));
          },
        );
      },
    );

    return {
      ...gameSessionRecord,
      measurements,
    };
  };

  createGameSession = ({
    gameSessionInput,
    skillScores: { speedScore, accuracyScore },
    measurements,
  }: {
    gameSessionInput: GameSessionInput;
    skillScores: { speedScore: number; accuracyScore: number };
    measurements: MeasurementWithScore[];
  }): Promise<string> => {
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

    return new Promise((res, rej) => {
      database.query(
        {
          sql: query,
          values: params,
        },
        (err) => {
          if (err) {
            rej(err);
          }
          res(gameSessionId);
        },
      );
    });
  };
}
