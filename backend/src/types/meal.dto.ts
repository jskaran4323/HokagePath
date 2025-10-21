export interface FoodDTO {
    name: string;
    quantity: number;
    unit: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    fiber?: number;
  }
  
  export interface MacrosDTO {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber?: number;
  }
  
  export interface CreateMealDTO {
    title: string;
    description?: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
    foods: FoodDTO[];
    totalMacros: MacrosDTO;
    mealDate?: Date;
    imageUrl?: string;
    dietaryTags?: string[];
    preparationTime?: number;
    recipe?: string;
  }
  
  export interface UpdateMealDTO {
    title?: string;
    description?: string;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
    foods?: FoodDTO[];
    totalMacros?: MacrosDTO;
    mealDate?: Date;
    imageUrl?: string;
    dietaryTags?: string[];
    preparationTime?: number;
    recipe?: string;
    userRating?: number;
    notes?: string;
  }
  
  export interface MealResponseDTO {
    id: string;
    userId: string;
    title: string;
    description?: string;
    mealType: string;
    foods: FoodDTO[];
    totalMacros: MacrosDTO;
    isAIGenerated: boolean;
    mealDate: Date;
    imageUrl?: string;
    dietaryTags?: string[];
    preparationTime?: number;
    recipe?: string;
    userRating?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  