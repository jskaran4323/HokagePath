export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    profilePicture?: string;
    bio?: string;
  }
  
  export interface FitnessProfile {
    id: string;
    userId: string;
    fitnessGoal: string;
    currentWeight: number;
    targetWeight?: number;
    height: number;
    age: number;
    gender: string;
    activityLevel: string;
    experienceLevel?: string;
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
  