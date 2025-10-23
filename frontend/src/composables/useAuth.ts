/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  
  // Get ALL state and actions from store
  const store = useAuthStore();

  // Login function
  const login = async (email: string, password: string) => {
    store.reset();
    store.setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      store.setUser(response.data.data.user);
      navigate('/dashboard');
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
    } finally {
      store.setLoading(false);
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    store.setLoading(true);

    try {
      const response = await authApi.getMe();
      store.setUser(response.data.data.user);
      store.setProfile(
        response.data.data.fitnessProfile, 
        response.data.data.workoutStats
      );
      return { success: true };
    } catch (err) {
      return { success: false };
    } finally {
      store.setLoading(false);
    }
  };

  // Return everything from store + custom functions
  return {
    // All state from store
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