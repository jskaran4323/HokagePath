import { create } from 'zustand';
import type { User, FitnessProfile, WorkoutStats } from '../types/auth.types';

interface AuthState {
  user: User | null;
  fitnessProfile: FitnessProfile | null;
  workoutStats: WorkoutStats | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  
  setUser: (user: User | null) => void;
  setProfile: (profile: FitnessProfile | null) => void;
  setWorkoutStats: (stats: WorkoutStats | null) => void;
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
  isLoading: true,
  error: null,

  // Set user + update auth status
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      error: null,
    }),

  // Set profile data
  setProfile: (fitnessProfile) => set({ fitnessProfile }),

  // Set workout stats
  setWorkoutStats: (workoutStats) => set({ workoutStats }),

  // Update loading status
  setLoading: (isLoading) => set({ isLoading }),

  // Update error message
  setError: (error) => set({ error }),

  // Logout and clear everything (but not cookie — backend should handle that)
  logout: () =>
    set({
      user: null,
      fitnessProfile: null,
      workoutStats: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),

  // Reset only error/loading (for UI)
  reset: () =>
    set({
      error: null,
      isLoading: false,
    }),
}));
