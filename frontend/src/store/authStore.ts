import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, FitnessProfile, WorkoutStats } from '../types/auth.types';

interface AuthState {
  user: User | null;
  fitnessProfile: FitnessProfile | null;
  workoutStats: WorkoutStats | null;
  isAuthenticated: boolean;
  hasFetched: boolean; 
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setProfile: (profile: FitnessProfile | null) => void;
  setWorkoutStats: (stats: WorkoutStats | null) => void;
  setLoading: (loading: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setHasFetched: (f: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      fitnessProfile: null,
      workoutStats: null,
      isAuthenticated: false,
      hasFetched: false,  
      isLoading: false,   
      error: null,

      setUser: (user) => set({ user }),
      setProfile: (fitnessProfile) => set({ fitnessProfile }),
      setWorkoutStats: (workoutStats) => set({ workoutStats }),
      setLoading: (isLoading) => set({ isLoading }),
      setHasFetched: (hasFetched) => set({ hasFetched }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setError: (error) => set({ error }),

      logout: () =>
        set({
          user: null,
          fitnessProfile: null,
          workoutStats: null,
          isAuthenticated: false,
          hasFetched: false,
          isLoading: false,
          error: null,
        }),

      reset: () =>
        set({
          error: null,
          isLoading: false,
        }),
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields (exclude loading/error states)
      partialize: (state) => ({
    
        isAuthenticated: state.isAuthenticated,
    
      }),
    }
  )
);