/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/composables/useMeals.ts

import { useState } from 'react';
import { mealApi, type Meal, type CreateMealRequest, type GenerateMealRequest } from '../api/meal.api';

export const useMeals = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const generateMeal = async (data: GenerateMealRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mealApi.generateMeal(data);
      const meal = response.data.data?.meal || response.data.meal || response.data;
      setCurrentMeal(meal);
      return { success: true, meal };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to generate meal';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const createMeal = async (data: CreateMealRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mealApi.createMeal(data);
      const meal = response.data.data?.meal || response.data.meal || response.data;
      setCurrentMeal(meal);
      return { success: true, meal };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create meal';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };


  const fetchMeals = async (mealType?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mealApi.getMeals(mealType);
      const mealsData = response.data.data 
        
      setMeals(Array.isArray(mealsData) ? mealsData : []);
      return { success: true, meals: mealsData };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch meals';
      setError(errorMessage);
      setMeals([]);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMeal = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mealApi.getMeal(id);
      const meal = response.data.data
      setCurrentMeal(meal);
      return { success: true, meal };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch meal';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

 
  const updateMeal = async (id: string, data: Partial<Meal>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mealApi.updateMeal(id, data);
      const meal = response.data.data?.meal || response.data.meal || response.data;
      setCurrentMeal(meal);
      return { success: true, meal };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update meal';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMeal = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await mealApi.deleteMeal(id);
      setMeals(meals.filter(m => m.id !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete meal';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  
  const fetchDailyNutrition = async (date?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mealApi.getDailyNutrition(date);
      const nutrition = response.data.data || response.data;
      return { success: true, nutrition };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch daily nutrition';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
   
    meals,
    currentMeal,
    isLoading,
    error,

    
    generateMeal,
    createMeal,
    fetchMeals,
    fetchMeal,
    updateMeal,
    deleteMeal,
    fetchDailyNutrition,
    
   
    setCurrentMeal,
    clearError: () => setError(null),
  };
};