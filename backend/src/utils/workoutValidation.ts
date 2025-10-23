import { CreateWorkoutDTO, UpdateWorkoutDTO, ExerciseDTO } from '../types/workout.dto';

export const validateCreateWorkout = (data: CreateWorkoutDTO): string[] => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (data.title.length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!data.workoutType) {
    errors.push('Workout type is required');
  } else if (!['strength', 'cardio', 'flexibility', 'sports', 'mixed', 'other'].includes(data.workoutType)) {
    errors.push('Invalid workout type');
  }

  if (!data.exercises || data.exercises.length === 0) {
    errors.push('At least one exercise is required');
  } else {
    data.exercises.forEach((exercise, index) => {
      if (!exercise.name || exercise.name.trim().length === 0) {
        errors.push(`Exercise ${index + 1}: Name is required`);
      }
      if (!exercise.sets || exercise.sets < 1) {
        errors.push(`Exercise ${index + 1}: Sets must be at least 1`);
      }
      if (!exercise.reps || exercise.reps < 1) {
        errors.push(`Exercise ${index + 1}: Reps must be at least 1`);
      }
    });
  }

  if (!data.duration || data.duration < 1) {
    errors.push('Duration must be at least 1 minute');
  }

  if (data.difficulty && (data.difficulty < 1 || data.difficulty > 5)) {
    errors.push('Difficulty must be between 1 and 5');
  }

  return errors;
};

export const validateUpdateWorkout = (data: UpdateWorkoutDTO): string[] => {
  const errors: string[] = [];

  if (data.title !== undefined && data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (data.userRating !== undefined && (data.userRating < 1 || data.userRating > 10)) {
    errors.push('User rating must be between 1 and 10');
  }

  if (data.difficulty !== undefined && (data.difficulty < 1 || data.difficulty > 5)) {
    errors.push('Difficulty must be between 1 and 5');
  }

  return errors;
};
