export interface UpdateFitnessProfileDTO {
    fitnessGoal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance' | 'strength' | 'flexibility';
    currentWeight?: number;
    targetWeight?: number;
    height?: number;
    heightUnit?: 'cm' | 'inches';
    weightUnit?: 'kg' | 'lbs';
    age?: number;
    gender?: 'male' | 'female' | 'other';
    activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'super_active';
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    preferredWorkoutTypes?: string[];
    availableEquipment?: string[];
    workoutDuration?: number;
    workoutsPerWeek?: number;
    injuries?: string[];
    dietaryRestrictions?: string[];
  }
  
  export interface AddWeightEntryDTO {
    weight: number;
    date?: Date;
    note?: string;
  }
  
  export interface FitnessProfileResponseDTO {
    id: string;
    userId: string;
    fitnessGoal: string;
    currentWeight: number;
    targetWeight?: number;
    height: number;
    heightUnit: string;
    weightUnit: string;
    age: number;
    gender: string;
    activityLevel: string;
    experienceLevel?: string;
    preferredWorkoutTypes?: string[];
    availableEquipment?: string[];
    workoutDuration?: number;
    workoutsPerWeek?: number;
    injuries?: string[];
    dietaryRestrictions?: string[];
    weightHistory: any[];
    bmi?: number;
    bmr?: number;
    dailyCalorieTarget?: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  