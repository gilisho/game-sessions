import { RequestHandler } from 'express';

export const gameSessionsController = (): {
  [operation: string]: RequestHandler;
} => ({
  list: (req, res, next) => {},
  create: (req, res, next) => {},
});
