import http from 'http';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config';
import bodyParser from 'body-parser';
import helmet from 'helmet';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/game-sessions', (req, res, next) => {
  res.send('NOT IMPLEMENTED');
});

/** Error handling */
app.use((req, res, next) => {
  const error = new Error('not found');
  return res.status(404).json({
    message: error.message,
  });
});

/** Server */
const httpServer = http.createServer(app);
const port = config.server.port;
httpServer.listen(port, () => console.log(`The server is running on port ${port}`));
