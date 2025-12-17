import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import aiService, { AIServiceError } from '../services/aiService';
import MealModel from '../../models/Meal';
/**
 * 
 * Generate Workout given fitness profile of the user
 * @param req 
 * @param res 
 * @returns 
 */
export const generateWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const preferences = req.body;

    const workout = await aiService.generateWorkout(userId, preferences);

    res.status(201).json({
      success: true,
      message: 'AI workout generated successfully',
      data: workout
    });

  } catch (error: any) {
    if (error instanceof AIServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Generate workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating workout',
      error: error.message
    });
  }
};

/**
 * Generate Workout plans for user given preferences of user
 * @param req  
 * @param res 
 * @returns 
 */

export const generateMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const preferences = req.body;

    const mealData = await aiService.generateMealPlan(userId, preferences);

    const meal = await MealModel.create({
      userId,
      ...mealData
    });

    res.status(201).json({
      success: true,
      message: 'AI meal plan generated successfully',
      data: meal
    });

  } catch (error: any) {
    if (error instanceof AIServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Generate meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating meal plan',
      error: error.message
    });
  }
};
