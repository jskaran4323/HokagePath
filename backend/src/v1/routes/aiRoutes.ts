import express from 'express';
import { generateWorkout, generateMeal } from '../../v1/controllers/aiController';
import { authenticate } from '../../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/workouts/generate', generateWorkout);
router.post('/meals/generate', generateMeal);

export default router;