/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';



export const useAuth = () => {
  const navigate = useNavigate();
  const {user, fitnessProfile, workoutStats, isAuthenticated, error, setUser, setIsAuthenticated, isLoading, reset, setHasFetched, setError, setLoading, hasFetched ,setProfile, setWorkoutStats} = useAuthStore();

  // Login function
  const login = async (email: string, password: string) => {
    reset();
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      setUser(response.data.data.user);
      setIsAuthenticated(true)
      
      
      
     
      navigate('/feed');
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (
    username: string,
    email: string,
    password: string,
    fullName: string
  ) => {
    reset();
    setLoading(true);

    try {
      const response = await authApi.register({ 
        username, 
        email, 
        password, 
        fullName 
      });
      setUser(response.data.data.user);
      navigate('/dashboard');
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);

    try {
      await authApi.logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  
  const fetchUserProfile = async () => {
    if (hasFetched) return;
  
    setLoading(true);
  
    try {
      const response = await authApi.getMe();
    
      
      setUser(response.data.data.user);
      setProfile(response.data.data.fitnessProfile);
      setWorkoutStats(response.data.data.workoutStats);
      setIsAuthenticated(true);
  
      return response;
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
  
      setUser(null);
      setProfile(null);
      setWorkoutStats(null);
  
      return { success: false };
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };
  
  
  return {
    // State
    user: user,
    fitnessProfile: fitnessProfile,
    workoutStats: workoutStats,
    isAuthenticated: isAuthenticated,
    isLoading: isLoading,
    error: error,

    // Functions
    login,
    register,
    logout,
    fetchUserProfile,
    clearError: () => setError(null),
  };
};


