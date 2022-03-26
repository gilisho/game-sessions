import http from 'http';
import { app } from './server';

const httpServer = http.createServer(app);
const port = process.env.PORT;
httpServer.listen(port, () =>
  console.log(`The server is running on port ${port}`),
);
