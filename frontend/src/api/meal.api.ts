// frontend/src/api/meal.api.ts
import apiClient from './client'

export interface Food {
  name: string;
  quantity: number;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  fiber?: number;
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
}

export interface Meal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  foods: Food[];
  totalMacros: Macros;
  isAIGenerated: boolean;
  aiPrompt?: string;
  mealDate: string;
  imageUrl?: string;
  dietaryTags?: string[];
  preparationTime?: number;
  recipe?: string;
  userRating?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealRequest {
  title: string;
  description?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  foods: Food[];
  totalMacros: Macros;
  dietaryTags?: string[];
  preparationTime?: number;
  recipe?: string;
  notes?: string;
}

export interface GenerateMealRequest {
  mealType?: string;
  dietaryRestrictions?: string[];
  calorieTarget?: number;
  cuisineType?: string;
}

export const mealApi = {
  // Create manual meal
  createMeal: (data: CreateMealRequest) => 
    apiClient.post('/meal', data),

  // Get all user meals
  getMeals: (mealType?: string) => 
    apiClient.get(`/meals${mealType ? `?mealType=${mealType}` : ''}`),

  // Get daily nutrition summary
  getDailyNutrition: (date?: string) =>
    apiClient.get(`/meals/nutrition/daily${date ? `?date=${date}` : ''}`),

  // Get single meal
  getMeal: (id: string) => 
    apiClient.get(`/meals/${id}`),

  // Update meal
  updateMeal: (id: string, data: Partial<Meal>) => 
    apiClient.put(`/meals/${id}`, data),

  // Delete meal
  deleteMeal: (id: string) => 
    apiClient.delete(`/meals/${id}`),

  // Generate AI meal (assuming you have this endpoint in backend)
  generateMeal: (data: GenerateMealRequest) => 
    apiClient.post('ai/meals/generate', data),
};