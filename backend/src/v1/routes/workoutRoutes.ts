import express from 'express';
import {
  createWorkout,
  getWorkout,
  getUserWorkouts,
  updateWorkout,
  deleteWorkout
  
} from '../../v1/controllers/workoutController';
import { authenticate } from '../../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', createWorkout);
router.get('/', getUserWorkouts);
router.get('/:id', getWorkout);
router.put('/:id', updateWorkout);

router.delete('/:id', deleteWorkout);

export default router;