// frontend/src/pages/Meals/GenerateMeal.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeals } from '../../composables/useMeal';
import { useAuth } from '../../composables/useAuth';
import type { GenerateMealRequest } from '../../api/meal.api';

const GenerateMeal = () => {
  const navigate = useNavigate();
  const { fitnessProfile } = useAuth();
  const { generateMeal, isLoading } = useMeals();
  
  const [formData, setFormData] = useState<GenerateMealRequest>({
    mealType: 'lunch',
    dietaryRestrictions: fitnessProfile?.dietaryRestrictions || [],
    calorieTarget: fitnessProfile?.dailyCalorieTarget ? Math.round(fitnessProfile.dailyCalorieTarget * 0.35) : 600,
    cuisineType: 'any',
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    const result = await generateMeal(formData);
    
    if (result.success && result.meal) {
      navigate(`/meals/${result.meal._id}`);
    } else {
      alert(result.error || 'Failed to generate meal');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Generate AI Meal Plan</h1>
        <p className="text-gray-600">
          Let AI create a personalized meal plan based on your nutrition goals
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Meal Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <select
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
              <option value="pre_workout">Pre-Workout</option>
              <option value="post_workout">Post-Workout</option>
            </select>
          </div>

          {/* Calorie Target */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calorie Target
            </label>
            <input
              type="number"
              min="100"
              max="2000"
              value={formData.calorieTarget}
              onChange={(e) => setFormData({ ...formData, calorieTarget: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: {fitnessProfile?.dailyCalorieTarget ? Math.round(fitnessProfile.dailyCalorieTarget * 0.35) : 600} kcal for lunch
            </p>
          </div>

          {/* Cuisine Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Type
            </label>
            <select
              value={formData.cuisineType}
              onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="any">Any</option>
              <option value="indian">Indian</option>
              <option value="italian">Italian</option>
              <option value="chinese">Chinese</option>
              <option value="mexican">Mexican</option>
              <option value="american">American</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="japanese">Japanese</option>
              <option value="thai">Thai</option>
            </select>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Restrictions
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'low-carb', 'high-protein', 'paleo'].map((diet) => (
                <label key={diet} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.dietaryRestrictions?.includes(diet)}
                    onChange={(e) => {
                      const current = formData.dietaryRestrictions || [];
                      if (e.target.checked) {
                        setFormData({ ...formData, dietaryRestrictions: [...current, diet] });
                      } else {
                        setFormData({ ...formData, dietaryRestrictions: current.filter(d => d !== diet) });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm capitalize">{diet}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Profile Info Display */}
          {fitnessProfile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2 font-medium">
                AI will consider your profile:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>Fitness Goal: {fitnessProfile.fitnessGoal}</li>
                <li>Daily Calorie Target: {fitnessProfile.dailyCalorieTarget} kcal</li>
                {fitnessProfile.dietaryRestrictions && fitnessProfile.dietaryRestrictions.length > 0 && fitnessProfile.dietaryRestrictions[0] !== 'N/A' && (
                  <li>Dietary Restrictions: {fitnessProfile.dietaryRestrictions.join(', ')}</li>
                )}
              </ul>
            </div>
          )}

          {/* Generate Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating Meal Plan...' : 'Generate AI Meal Plan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateMeal;