// frontend/src/store/authStore.ts

import { create } from 'zustand';
import type { User, FitnessProfile, WorkoutStats } from '../types/auth.types';

interface AuthState {
  // State
  user: User | null;
  fitnessProfile: FitnessProfile | null;
  workoutStats: WorkoutStats | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

 
  setUser: (user: User | null) => void;
  setProfile: (profile: FitnessProfile | null, stats: WorkoutStats | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  
  user: null,
  fitnessProfile: null,
  workoutStats: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,


  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    error: null 
  }),

  setProfile: (fitnessProfile, workoutStats) => set({ 
    fitnessProfile, 
    workoutStats 
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  logout: () => set({ 
    user: null, 
    fitnessProfile: null, 
    workoutStats: null, 
    isAuthenticated: false,
    error: null 
  }),

  reset: () => set({ 
    error: null, 
    isLoading: false 
  }),
}));