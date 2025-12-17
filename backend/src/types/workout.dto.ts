export interface ExerciseDTO {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    weightUnit?: 'kg' | 'lbs';
    duration?: number;
    distance?: number;
    distanceUnit?: 'km' | 'miles';
    notes?: string;
    completed?: boolean;
  }
  
  type workoutType = 'strength' | 'cardio' | 'flexibility' | 'sports' | 'mixed' | 'other';
  export interface CreateWorkoutDTO {
    id?: number
    title: string;
    description?: string;
    workoutType: workoutType;
    exercises: ExerciseDTO[];
    duration: number;
    caloriesBurned?: number;
    workoutDate?: Date;
    difficulty?: number;
    tags?: string[];
  }
  
  export interface UpdateWorkoutDTO {
    title?: string;
    description?: string;
    workoutType?: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'mixed' | 'other';
    exercises?: ExerciseDTO[];
    duration?: number;
    caloriesBurned?: number;
    status?: 'scheduled' | 'in_progress' | 'completed' | 'skipped';
    difficulty?: number;
    userRating?: number;
    feedback?: string;
    tags?: string[];
  }
  
  export interface WorkoutResponseDTO {
    id: string;
    userId: string;
    title: string;
    description?: string;
    workoutType: string;
    exercises: ExerciseDTO[];
    duration: number;
    caloriesBurned?: number;
    status: string;
    isAIGenerated: boolean;
    workoutDate: Date;
    difficulty?: number;
    userRating?: number;
    createdAt: Date;
    updatedAt: Date;
  }