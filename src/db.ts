import dotenv from 'dotenv';
import mysql from 'mysql';

dotenv.config({ debug: true });

const GAME_SESSIONS_TABLE = 'game_sessions';
const MEASUREMENTS_TABLE = 'measurements';

const database = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: 'UTC',
  multipleStatements: true,
});

export { database, GAME_SESSIONS_TABLE, MEASUREMENTS_TABLE };
