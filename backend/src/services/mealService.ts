import MealModel from '../models/Meal';
import { CreateMealDTO, UpdateMealDTO, MealResponseDTO } from '../types/meal.dto';

export class MealServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'MealServiceError';
  }
}

export class MealService {

  private toMealResponse(meal: any): MealResponseDTO {
    return {
      id: meal._id.toString(),
      userId: meal.userId.toString(),
      title: meal.title,
      description: meal.description,
      mealType: meal.mealType,
      foods: meal.foods,
      totalMacros: meal.totalMacros,
      isAIGenerated: meal.isAIGenerated,
      mealDate: meal.mealDate,
      imageUrl: meal.imageUrl,
      dietaryTags: meal.dietaryTags,
      preparationTime: meal.preparationTime,
      recipe: meal.recipe,
      userRating: meal.userRating,
      notes: meal.notes,
      createdAt: meal.createdAt,
      updatedAt: meal.updatedAt
    };
  }

  async createMeal(userId: string, data: CreateMealDTO): Promise<MealResponseDTO> {
    const meal = await MealModel.create({
      userId,
      title: data.title,
      description: data.description,
      mealType: data.mealType,
      foods: data.foods,
      totalMacros: data.totalMacros,
      mealDate: data.mealDate || new Date(),
      imageUrl: data.imageUrl,
      dietaryTags: data.dietaryTags,
      preparationTime: data.preparationTime,
      recipe: data.recipe
    });

    return this.toMealResponse(meal);
  }

  async getMealById(mealId: string, userId: string): Promise<MealResponseDTO> {
    const meal = await MealModel.findOne({ _id: mealId, userId });

    if (!meal) {
      throw new MealServiceError('Meal not found', 404);
    }

    return this.toMealResponse(meal);
  }

  async getUserMeals(userId: string, filters?: {
    mealType?: string;
    startDate?: Date;
    endDate?: Date;
    dietaryTags?: string[];
  }): Promise<MealResponseDTO[]> {
    const query: any = { userId };

    if (filters?.mealType) {
      query.mealType = filters.mealType;
    }
    if (filters?.startDate || filters?.endDate) {
      query.mealDate = {};
      if (filters.startDate) query.mealDate.$gte = filters.startDate;
      if (filters.endDate) query.mealDate.$lte = filters.endDate;
    }
    if (filters?.dietaryTags && filters.dietaryTags.length > 0) {
      query.dietaryTags = { $in: filters.dietaryTags };
    }

    const meals = await MealModel.find(query).sort({ mealDate: -1 });
    return meals.map(m => this.toMealResponse(m));
  }

  async updateMeal(mealId: string, userId: string, data: UpdateMealDTO): Promise<MealResponseDTO> {
    const meal = await MealModel.findOne({ _id: mealId, userId });

    if (!meal) {
      throw new MealServiceError('Meal not found', 404);
    }

    Object.assign(meal, data);
    await meal.save();

    return this.toMealResponse(meal);
  }

  async deleteMeal(mealId: string, userId: string): Promise<void> {
    const meal = await MealModel.findOneAndDelete({ _id: mealId, userId });

    if (!meal) {
      throw new MealServiceError('Meal not found', 404);
    }
  }

  async getDailyNutrition(userId: string, date: Date): Promise<{
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
    totalFiber: number;
    mealCount: number;
  }> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await MealModel.find({
      userId,
      mealDate: { $gte: startOfDay, $lte: endOfDay }
    });

    const totals = meals.reduce((acc, meal) => {
      acc.totalCalories += meal.totalMacros.calories;
      acc.totalProtein += meal.totalMacros.protein;
      acc.totalCarbs += meal.totalMacros.carbs;
      acc.totalFats += meal.totalMacros.fats;
      acc.totalFiber += meal.totalMacros.fiber || 0;
      return acc;
    }, {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      totalFiber: 0,
      mealCount: meals.length
    });

    return totals;
  }
}

export default new MealService();