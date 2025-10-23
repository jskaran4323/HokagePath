  import { CreateMealDTO, UpdateMealDTO } from '../types/meal.dto';
  
  export const validateCreateMeal = (data: CreateMealDTO): string[] => {
    const errors: string[] = [];
  
    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (data.title.length < 3) {
      errors.push('Title must be at least 3 characters');
    }
  
    if (!data.mealType) {
      errors.push('Meal type is required');
    } else if (!['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'].includes(data.mealType)) {
      errors.push('Invalid meal type');
    }
  
    if (!data.foods || data.foods.length === 0) {
      errors.push('At least one food item is required');
    } else {
      data.foods.forEach((food, index) => {
        if (!food.name || food.name.trim().length === 0) {
          errors.push(`Food ${index + 1}: Name is required`);
        }
        if (!food.quantity || food.quantity <= 0) {
          errors.push(`Food ${index + 1}: Quantity must be greater than 0`);
        }
        if (!food.unit || food.unit.trim().length === 0) {
          errors.push(`Food ${index + 1}: Unit is required`);
        }
      });
    }
  
    if (!data.totalMacros) {
      errors.push('Total macros are required');
    } else {
      if (data.totalMacros.calories < 0) {
        errors.push('Calories cannot be negative');
      }
      if (data.totalMacros.protein < 0) {
        errors.push('Protein cannot be negative');
      }
      if (data.totalMacros.carbs < 0) {
        errors.push('Carbs cannot be negative');
      }
      if (data.totalMacros.fats < 0) {
        errors.push('Fats cannot be negative');
      }
    }
  
    if (data.preparationTime !== undefined && data.preparationTime < 0) {
      errors.push('Preparation time cannot be negative');
    }
  
    return errors;
  };
  
  export const validateUpdateMeal = (data: UpdateMealDTO): string[] => {
    const errors: string[] = [];
  
    if (data.title !== undefined && data.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
    }
  
    if (data.userRating !== undefined && (data.userRating < 1 || data.userRating > 10)) {
      errors.push('User rating must be between 1 and 10');
    }
  
    if (data.preparationTime !== undefined && data.preparationTime < 0) {
      errors.push('Preparation time cannot be negative');
    }
  
    return errors;
  };