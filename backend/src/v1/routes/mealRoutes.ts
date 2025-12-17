import express from 'express';
import {
  createMeal,
  getMeal,
  getUserMeals,
  updateMeal,
  deleteMeal,
  getDailyNutrition
} from '../../v1/controllers/mealController';
import { authenticate } from '../../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/generate', createMeal);
router.get('/', getUserMeals);
router.get('/nutrition/daily', getDailyNutrition);
router.get('/:id', getMeal);
router.put('/:id', updateMeal);
router.delete('/:id', deleteMeal);

export default router;