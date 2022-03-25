import express from 'express';
const router = express.Router();

// Require controller modules.

router.get('/', (req, res, next) => {
  res.send('NOT IMPLEMENTED');
});

export { router as gameSessionsRouter };