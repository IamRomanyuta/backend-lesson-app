import { Router } from 'express';
import { getLessons } from '../controllers/lessonController';

const router = Router();

router.get('/', getLessons);

export default router;
