// frontend/src/api/workout.api.ts

import apiClient from './client';

export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  duration?: number;
  restTime?: number;
  distance?: number;
  distanceUnit?: 'km' | 'miles';
  notes?: string;
  completed?: boolean;
}

export interface Workout {
    id: string;
    userId: string;
    title: string;
    description?: string;
    workoutType: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'mixed' | 'other';
    exercises: Exercise[];
    duration: number;
    caloriesBurned?: number;
    status: 'scheduled' | 'in_progress' | 'completed' | 'skipped';
    isAIGenerated: boolean;
    aiPrompt?: string;
    workoutDate: string;
    difficulty?: number; // 1-5
    userRating?: number; // 1-10
    feedback?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
  }

export interface GenerateWorkoutRequest {
  focus?: string;
  duration?: number;
  difficulty?: number;
}

export const workoutApi = {
  // Generate AI workout
  generateWorkout: (data: GenerateWorkoutRequest) => 
    apiClient.post('ai/workouts/generate', data),

  // Get all workouts
  getWorkouts: (status?: string) => 
    apiClient.get(`/workouts${status ? `?status=${status}` : ''}`),

  // Get single workout
  getWorkout: (id: string) => 
    apiClient.get(`/workouts/${id}`),

  // Update workout
  updateWorkout: (id: string, data: Partial<Workout>) => 
    apiClient.put(`/workouts/${id}`, data),

  // Start workout
  startWorkout: (id: string) => 
    apiClient.patch(`/workouts/${id}/start`),

  // // Complete workout
  // completeWorkout: (id: string, data?: { caloriesBurned?: number; notes?: string }) => 
  //   apiClient.patch(`/workouts/${id}/complete`, data),

  // Delete workout
  deleteWorkout: (id: string) => 
    apiClient.delete(`/workouts/${id}`),

  // Update exercise in workout
  updateExercise: (workoutId: string, exerciseIndex: number, data: Partial<Exercise>) =>
    apiClient.patch(`/workouts/${workoutId}/exercises/${exerciseIndex}`, data),
};