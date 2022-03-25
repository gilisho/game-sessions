import express from 'express';
const router = express.Router();

// Require controller modules.

router.get('/', (req, res, next) => {
  res.send('NOT IMPLEMENTED');
  // returns the list of game sessions (name and id)
});

router.get('/:id', (req, res, next) => {
  // returns a game session by id
  res.send('NOT IMPLEMENTED - get by id');
});

router.post('/', (req, res, next) => {
  //  calculates the measurements' grades and accumulated scores, stores the information in the database and returns the game session id
  res.send('NOT IMPLEMENTED - create');
});

export { router as gameSessionsRouter };