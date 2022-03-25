import express from 'express';
import { gameSessionsController } from '../controllers/game-sessions/game-sessions-controller';

const router = express.Router();

router.get('/', gameSessionsController.list);

router.get('/:id', gameSessionsController.get);

router.post('/', gameSessionsController.create);

export { router as gameSessionsRouter };
