import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import workoutService, { WorkoutServiceError } from '../services/workoutService';
import { CreateWorkoutDTO, UpdateWorkoutDTO } from '../types/workout.dto';
import { validateCreateWorkout, validateUpdateWorkout } from '../utils/workoutValidation';

export const createWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const workoutData: CreateWorkoutDTO = req.body;

    const validationErrors = validateCreateWorkout(workoutData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    const workout = await workoutService.createWorkout(userId, workoutData);

    res.status(201).json({
      success: true,
      message: 'Workout created successfully',
      data: workout
    });

  } catch (error: any) {
    if (error instanceof WorkoutServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Create workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating workout',
      error: error.message
    });
  }
};

export const getWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const workoutId = req.params.id;

    const workout = await workoutService.getWorkoutById(workoutId, userId);

    res.status(200).json({
      success: true,
      data: workout
    });

  } catch (error: any) {
    if (error instanceof WorkoutServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Get workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workout',
      error: error.message
    });
  }
};

export const getUserWorkouts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { status, workoutType, startDate, endDate } = req.query;

    const filters: any = {};
    if (status) filters.status = status;
    if (workoutType) filters.workoutType = workoutType;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    const workouts = await workoutService.getUserWorkouts(userId, filters);

    res.status(200).json({
      success: true,
      data: workouts,
      count: workouts.length
    });

  } catch (error: any) {
    console.error('Get user workouts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workouts',
      error: error.message
    });
  }
};

export const updateWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const workoutId = req.params.id;
    const updateData: UpdateWorkoutDTO = req.body;

    const validationErrors = validateUpdateWorkout(updateData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    const workout = await workoutService.updateWorkout(workoutId, userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Workout updated successfully',
      data: workout
    });

  } catch (error: any) {
    if (error instanceof WorkoutServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Update workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating workout',
      error: error.message
    });
  }
};

export const deleteWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const workoutId = req.params.id;

    await workoutService.deleteWorkout(workoutId, userId);

    res.status(200).json({
      success: true,
      message: 'Workout deleted successfully'
    });

  } catch (error: any) {
    if (error instanceof WorkoutServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Delete workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting workout',
      error: error.message
    });
  }
};