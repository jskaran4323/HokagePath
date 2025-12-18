import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import mealService, { MealServiceError } from '../services/mealService';
import { CreateMealDTO, UpdateMealDTO } from '../../types/meal.dto';
import { validateCreateMeal, validateUpdateMeal } from '../../utils/mealValidation';


/**
 * Creating meal 
 * @param req 
 * @param res 
 * @returns 
 */
export const createMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const mealData: CreateMealDTO = req.body;

    const validationErrors = validateCreateMeal(mealData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    const meal = await mealService.createMeal(userId, mealData);

    res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      data: meal
    });

  } catch (error: any) {
    if (error instanceof MealServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Create meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating meal',
      error: error.message
    });
  }
};

/**
 *  Fetch meal of a given user 
 * @param req 
 * @param res 
 * @returns 
 */
export const getMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    
    
    const userId = req.user!.id;
    const mealId = req.params.id;

    const meal = await mealService.getMealById(mealId, userId);

    res.status(200).json({
      success: true,
      data: meal
    });

  } catch (error: any) {
    if (error instanceof MealServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Get meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching meal',
      error: error.message
    });
  }
};


//TODO:
/**
 * Get user meals depend on certain conditions 
 * @param req 
 * @param res 
 */
export const getUserMeals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { mealType, startDate, endDate, dietaryTags } = req.query;

    const filters: any = {};
    if (mealType) filters.mealType = mealType;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);
    if (dietaryTags) {
      filters.dietaryTags = Array.isArray(dietaryTags) 
        ? dietaryTags 
        : [dietaryTags];
    }

    const meals = await mealService.getUserMeals(userId, filters);

    res.status(200).json({
      success: true,
      data: meals,
      count: meals.length
    });

  } catch (error: any) {
    console.error('Get user meals error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching meals',
      error: error.message
    });
  }
};

export const updateMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const mealId = req.params.id;
    const updateData: UpdateMealDTO = req.body;

    const validationErrors = validateUpdateMeal(updateData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    const meal = await mealService.updateMeal(mealId, userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Meal updated successfully',
      data: meal
    });

  } catch (error: any) {
    if (error instanceof MealServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Update meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating meal',
      error: error.message
    });
  }
};

export const deleteMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const mealId = req.params.id;

    await mealService.deleteMeal(mealId, userId);

    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully'
    });

  } catch (error: any) {
    if (error instanceof MealServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Delete meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting meal',
      error: error.message
    });
  }
};

export const getDailyNutrition = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const date = req.query.date ? new Date(req.query.date as string) : new Date();

    const nutrition = await mealService.getDailyNutrition(userId, date);

    res.status(200).json({
      success: true,
      data: nutrition
    });

  } catch (error: any) {
    console.error('Get daily nutrition error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching daily nutrition',
      error: error.message
    });
  }
};

