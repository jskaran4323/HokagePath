import { GoogleGenerativeAI } from '@google/generative-ai';
import FitnessProfileModel from '../../models/FitnessProfile';
import WorkoutModel from '../../models/Workout';

export class AIServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class AIService {
  private genAI?: GoogleGenerativeAI;
  private model?: any;

  
  constructor() {}

  
  private initialize() {
    if (this.genAI) return;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generateWorkout(userId: string, preferences?: {
    duration?: number;
    workoutType?: string;
    equipment?: string[];
    focus?: string;
  }): Promise<any> {
    this.initialize(); 
    
    try {
      const fitnessProfile = await FitnessProfileModel.findOne({ userId });

      if (!fitnessProfile) {
        throw new AIServiceError('Fitness profile not found. Please complete your profile first.', 404);
      }

      const prompt = this.buildWorkoutPrompt(fitnessProfile, preferences);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const workoutText = response.text();

      const workout = this.parseWorkoutResponse(workoutText, preferences);
      const createdWorkout = await WorkoutModel.create({
        userId,
        title: workout.title,
        description: workout.description,
        workoutType: preferences?.workoutType || 'mixed',
        exercises: workout.exercises,
        duration: preferences?.duration || 60,
        difficulty: this.calculateDifficulty(fitnessProfile.experienceLevel),
        isAIGenerated: true,
        aiPrompt: prompt,
        status: 'scheduled'
      });

      return createdWorkout;

    } catch (error: any) {
      console.error('AI Workout Generation Error:', error);
      throw new AIServiceError('Failed to generate workout: ' + error.message);
    }
  }

  async generateMealPlan(userId: string, preferences?: {
    mealType?: string;
    dietaryRestrictions?: string[];
    calorieTarget?: number;
    cuisineType?: string;
  }): Promise<any> {
    this.initialize(); // Initialize here instead
    
    try {
      const fitnessProfile = await FitnessProfileModel.findOne({ userId });

      if (!fitnessProfile) {
        throw new AIServiceError('Fitness profile not found. Please complete your profile first.', 404);
      }

      const prompt = this.buildMealPrompt(fitnessProfile, preferences);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const mealText = response.text();

      const meal = this.parseMealResponse(mealText, preferences);

      return {
        title: meal.title,
        description: meal.description,
        mealType: preferences?.mealType || 'lunch',
        foods: meal.foods,
        totalMacros: meal.totalMacros,
        isAIGenerated: true,
        aiPrompt: prompt,
        dietaryTags: preferences?.dietaryRestrictions || [],
        preparationTime: meal.preparationTime,
        recipe: meal.recipe
      };

    } catch (error: any) {
      console.error('AI Meal Generation Error:', error);
      throw new AIServiceError('Failed to generate meal plan: ' + error.message);
    }
  }

  private buildWorkoutPrompt(fitnessProfile: any, preferences?: any): string {
    const duration = preferences?.duration || 60;
    const workoutType = preferences?.workoutType || 'mixed';
    const equipment = preferences?.equipment?.join(', ') || 'bodyweight, dumbbells';
    const focus = preferences?.focus || 'overall fitness';

    return `You are an expert fitness trainer. Generate a detailed workout plan with the following specifications:

USER PROFILE:
- Fitness Goal: ${fitnessProfile.fitnessGoal}
- Experience Level: ${fitnessProfile.experienceLevel || 'beginner'}
- Activity Level: ${fitnessProfile.activityLevel}
- Age: ${fitnessProfile.age}
- Gender: ${fitnessProfile.gender}
- Current Weight: ${fitnessProfile.currentWeight} ${fitnessProfile.weightUnit}
- Injuries/Limitations: ${fitnessProfile.injuries?.join(', ') || 'None'}

WORKOUT REQUIREMENTS:
- Duration: ${duration} minutes
- Workout Type: ${workoutType}
- Available Equipment: ${equipment}
- Focus Area: ${focus}

IMPORTANT RULES:
1. For bodyweight exercises (push-ups, squats, planks), DO NOT include "weight" or "weightUnit" fields at all
2. Only include "weight" and "weightUnit" for exercises that actually use weights
3. Never use "N/A", "Bodyweight", or empty strings for weight/weightUnit
4. For timed exercises (planks, wall sits), use "duration" in seconds instead of reps
5. weightUnit must be either "kg" or "lbs" if included


Please provide a workout plan in the following JSON format:
{
  "title": "Workout title",
  "description": "Brief description",
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 3,
      "reps": 12,
      "weight": 20,
      "weightUnit": "kg",
      "duration": 0,
      "notes": "Form tips and modifications"
    }
  ]
}

Make sure the workout is safe, effective, and appropriate for the user's level. Include warm-up and cool-down exercises. Provide clear instructions and safety notes.`;
  }

  private buildMealPrompt(fitnessProfile: any, preferences?: any): string {
    const mealType = preferences?.mealType || 'lunch';
    const dietaryRestrictions = preferences?.dietaryRestrictions?.join(', ') || 'None';
    const calorieTarget = preferences?.calorieTarget || fitnessProfile.dailyCalorieTarget || 2000;
    const cuisineType = preferences?.cuisineType || 'any';

    const mealCalories = this.calculateMealCalories(mealType, calorieTarget);

    return `You are an expert nutritionist. Generate a detailed meal plan with the following specifications:

USER PROFILE:
- Fitness Goal: ${fitnessProfile.fitnessGoal}
- Activity Level: ${fitnessProfile.activityLevel}
- Current Weight: ${fitnessProfile.currentWeight} ${fitnessProfile.weightUnit}
- Target Weight: ${fitnessProfile.targetWeight || 'maintenance'} ${fitnessProfile.weightUnit}
- Dietary Restrictions: ${dietaryRestrictions}
- Age: ${fitnessProfile.age}
- Gender: ${fitnessProfile.gender}

MEAL REQUIREMENTS:
- Meal Type: ${mealType}
- Target Calories: ${mealCalories} calories
- Cuisine Type: ${cuisineType}
- Dietary Restrictions: ${dietaryRestrictions}

Please provide a meal plan in the following JSON format:
{
  "title": "Meal title",
  "description": "Brief description",
  "foods": [
    {
      "name": "Food item",
      "quantity": 100,
      "unit": "g",
      "calories": 200,
      "protein": 20,
      "carbs": 30,
      "fats": 10,
      "fiber": 5
    }
  ],
  "totalMacros": {
    "calories": 500,
    "protein": 40,
    "carbs": 60,
    "fats": 20,
    "fiber": 10
  },
  "preparationTime": 30,
  "recipe": "Step by step cooking instructions"
}

Ensure the meal is balanced, nutritious, and aligned with the user's fitness goals. Include preparation instructions.`;
  }

  private parseWorkoutResponse(text: string, preferences?: any): any {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
      

      return {
        title: preferences?.workoutType ? `${preferences.workoutType} Workout` : 'AI Generated Workout',
        description: 'Custom workout generated by AI',
        exercises: [
          {
            name: 'Push-ups',
            sets: 3,
            reps: 15,
            notes: 'Keep core engaged'
          },
          {
            name: 'Squats',
            sets: 3,
            reps: 15,
            notes: 'Full range of motion'
          },
          {
            name: 'Plank',
            sets: 3,
            reps: 1,
            duration: 60,
            notes: 'Hold for 60 seconds'
          }
        ]
      };
    } catch (error) {
      console.error('Failed to parse workout response:', error);
      return {
        title: 'AI Generated Workout',
        description: text.substring(0, 200),
        exercises: [
          {
            name: 'Push-ups',
            sets: 3,
            reps: 15,
            notes: 'AI generated workout'
          }
        ]
      };
    }
  }

  private parseMealResponse(text: string, preferences?: any): any {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }

      return {
        title: `Healthy ${preferences?.mealType || 'Meal'}`,
        description: 'AI generated meal plan',
        foods: [
          {
            name: 'Chicken Breast',
            quantity: 150,
            unit: 'g',
            calories: 250,
            protein: 45,
            carbs: 0,
            fats: 5
          },
          {
            name: 'Brown Rice',
            quantity: 100,
            unit: 'g',
            calories: 350,
            protein: 8,
            carbs: 75,
            fats: 3
          }
        ],
        totalMacros: {
          calories: 600,
          protein: 53,
          carbs: 75,
          fats: 8,
          fiber: 5
        },
        preparationTime: 30,
        recipe: text.substring(0, 500)
      };
    } catch (error) {
      console.error('Failed to parse meal response:', error);
      return {
        title: 'AI Generated Meal',
        description: text.substring(0, 200),
        foods: [],
        totalMacros: { calories: 0, protein: 0, carbs: 0, fats: 0 },
        preparationTime: 30,
        recipe: 'See AI response'
      };
    }
  }

  private calculateDifficulty(experienceLevel?: string): number {
    switch (experienceLevel) {
      case 'beginner':
        return 2;
      case 'intermediate':
        return 3;
      case 'advanced':
        return 4;
      default:
        return 2;
    }
  }

  private calculateMealCalories(mealType: string, dailyTarget: number): number {
    const ratios: any = {
      breakfast: 0.25,
      lunch: 0.35,
      dinner: 0.30,
      snack: 0.10,
      pre_workout: 0.15,
      post_workout: 0.20
    };

    return Math.round(dailyTarget * (ratios[mealType] || 0.30));
  }
}

export default new AIService();