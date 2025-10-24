/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    profilePicture?: string;
    bio?: string;
  }
  
export interface FitnessProfile {
  _id: string;
  userId: string;
  age: number;
  gender: string;
  height: number;
  heightUnit: string;
  currentWeight: number;
  targetWeight?: number;
  weightUnit: string;
  fitnessGoal: string;
  activityLevel: string;
  experienceLevel: string;
  preferredWorkoutTypes: string[];
  dietaryRestrictions: string[];
  injuries: string[];
  availableEquipment: string[];
  workoutsPerWeek: number;
  workoutDuration: number;
  bmi?: number;
  bmr?: number;
  dailyCalorieTarget?: number;
  weightHistory: any[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
  
  export interface WorkoutStats {
    currentStreak: number;
    longestStreak: number;
    totalWorkouts: number;
    totalWorkoutMinutes: number;
    totalCaloriesBurned: number;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
      user: User;
    };
  }
  
  export interface UserProfileResponse {
    success: boolean;
    data: {
      user: User;
      fitnessProfile: FitnessProfile;
      workoutStats: WorkoutStats;
    };
  }
  