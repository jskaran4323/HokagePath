/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { useCallback } from 'react';

export const useAuth = () => {
  const navigate = useNavigate();
  const store = useAuthStore();

  // Login function
  const login = async (email: string, password: string) => {
    store.reset();
    store.setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      store.setUser(response.data.data.user);
      navigate('/feed');
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      store.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      store.setLoading(false);
    }
  };

  // Register function
  const register = async (
    username: string,
    email: string,
    password: string,
    fullName: string
  ) => {
    store.reset();
    store.setLoading(true);

    try {
      const response = await authApi.register({ 
        username, 
        email, 
        password, 
        fullName 
      });
      store.setUser(response.data.data.user);
      navigate('/dashboard');
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      store.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      store.setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    store.setLoading(true);

    try {
      await authApi.logout();
      store.logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear auth state even if API fails
      store.logout();
      navigate('/login');
    } finally {
      store.setLoading(false);
    }
  };

  
  const fetchUserProfile = useCallback(async () => {
    store.setLoading(true);
  
    try {
      const response = await authApi.getMe();      
      store.setUser(response.data.data.user);
      store.setProfile(response.data.data.fitnessProfile);
      store.setWorkoutStats(response.data.data.workoutStats);
      
      return { success: true };
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      
      store.setUser(null);
      store.setProfile(null);
      store.setWorkoutStats(null);
      
      return { success: false };
    } finally {
      store.setLoading(false);
    }
  }, [store]); 
  
  return {
    // State
    user: store.user,
    fitnessProfile: store.fitnessProfile,
    workoutStats: store.workoutStats,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,

    // Functions
    login,
    register,
    logout,
    fetchUserProfile,
    clearError: () => store.setError(null),
  };
};