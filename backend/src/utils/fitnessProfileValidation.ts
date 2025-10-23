import { UpdateFitnessProfileDTO, AddWeightEntryDTO } from '../types/fitnessProfile.dto';

export const validateUpdateFitnessProfile = (data: UpdateFitnessProfileDTO): string[] => {
  const errors: string[] = [];

  if (data.currentWeight !== undefined && data.currentWeight <= 0) {
    errors.push('Current weight must be greater than 0');
  }

  if (data.targetWeight !== undefined && data.targetWeight <= 0) {
    errors.push('Target weight must be greater than 0');
  }

  if (data.height !== undefined && data.height <= 0) {
    errors.push('Height must be greater than 0');
  }

  if (data.age !== undefined && (data.age < 13 || data.age > 120)) {
    errors.push('Age must be between 13 and 120');
  }

  if (data.workoutsPerWeek !== undefined && (data.workoutsPerWeek < 1 || data.workoutsPerWeek > 7)) {
    errors.push('Workouts per week must be between 1 and 7');
  }

  if (data.workoutDuration !== undefined && data.workoutDuration <= 0) {
    errors.push('Workout duration must be greater than 0');
  }

  return errors;
};

export const validateAddWeightEntry = (data: AddWeightEntryDTO): string[] => {
  const errors: string[] = [];

  if (!data.weight || data.weight <= 0) {
    errors.push('Weight must be greater than 0');
  }

  return errors;
};
