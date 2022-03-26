import dotenv from 'dotenv';
import mysql from 'mysql';

dotenv.config({ debug: true });

const database = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export { database };
