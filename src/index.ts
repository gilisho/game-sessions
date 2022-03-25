import http from 'http';
import { config } from './config';
import { app } from './server';

/** Server */
const httpServer = http.createServer(app);
const port = config.server.port;
httpServer.listen(port, () =>
  console.log(`The server is running on port ${port}`),
);
