import express from 'express';
import {
  getFitnessProfile,
  updateFitnessProfile,
  addWeightEntry
} from '../../v1/controllers/fitnessProfileController';
import { authenticate } from '../../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/', getFitnessProfile);
router.put('/', updateFitnessProfile);
router.post('/weight', addWeightEntry);

export default router;