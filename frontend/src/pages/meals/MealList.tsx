// frontend/src/pages/Meals/MealList.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeals } from '../../composables/useMeal';

const MealList = () => {
  const navigate = useNavigate();
  const { meals, isLoading, fetchMeals } = useMeals();
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchMeals(filter === 'all' ? undefined : filter);
  }, [filter]);

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🍱';
      case 'dinner': return '🍽️';
      case 'snack': return '🍎';
      case 'pre_workout': return '💪';
      case 'post_workout': return '🥤';
      default: return '🍴';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading meals...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Meal Plans</h1>
          <p className="text-gray-600 mt-1">Track your nutrition journey</p>
        </div>
        <button
          onClick={() => navigate('/meals/generate')}
          className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition font-semibold shadow-md"
        >
          ✨ Generate New Meal
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total Meals</p>
          <p className="text-2xl font-bold text-green-600">{meals.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">This Week</p>
          <p className="text-2xl font-bold text-blue-600">
            {meals.filter(m => {
              const mealDate = new Date(m.mealDate);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return mealDate >= weekAgo;
            }).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Avg Calories</p>
          <p className="text-2xl font-bold text-orange-600">
            {meals.length > 0 ? Math.round(meals.reduce((sum, m) => sum + (m.totalMacros?.calories || 0), 0) / meals.length) : 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">AI Generated</p>
          <p className="text-2xl font-bold text-purple-600">
            {meals.filter(m => m.isAIGenerated).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${
              filter === type
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Meal Grid */}
      {!meals || meals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-600 mb-4 text-lg">No meals found</p>
          <p className="text-gray-500 mb-6">
            {filter === 'all' 
              ? "Start your nutrition journey by generating your first AI-powered meal plan!"
              : `You don't have any ${filter.replace('_', ' ')} meals yet.`
            }
          </p>
          <button
            onClick={() => navigate('/meals/generate')}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition font-semibold shadow-md"
          >
            🔥 Generate Your First Meal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => navigate(`/meals/${meal.id}`)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getMealTypeIcon(meal.mealType)}</span>
                  <h3 className="font-semibold text-lg line-clamp-2">{meal.title}</h3>
                </div>
                {meal.isAIGenerated && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center gap-1 flex-shrink-0 ml-2">
                    ✨ AI
                  </span>
                )}
              </div>

              {/* Description */}
              {meal.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {meal.description}
                </p>
              )}

              {/* Macros */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="bg-orange-50 rounded p-2">
                  <p className="text-xs text-gray-600">Calories</p>
                  <p className="font-semibold text-orange-600">{meal.totalMacros?.calories || 0}</p>
                </div>
                <div className="bg-blue-50 rounded p-2">
                  <p className="text-xs text-gray-600">Protein</p>
                  <p className="font-semibold text-blue-600">{meal.totalMacros?.protein || 0}g</p>
                </div>
                <div className="bg-yellow-50 rounded p-2">
                  <p className="text-xs text-gray-600">Carbs</p>
                  <p className="font-semibold text-yellow-600">{meal.totalMacros?.carbs || 0}g</p>
                </div>
                <div className="bg-red-50 rounded p-2">
                  <p className="text-xs text-gray-600">Fats</p>
                  <p className="font-semibold text-red-600">{meal.totalMacros?.fats || 0}g</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize text-gray-600">
                  {meal.mealType.replace('_', ' ')}
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(meal.mealDate).toLocaleDateString()}
                </span>
              </div>

              {/* Rating */}
              {meal.userRating && (
                <div className="mt-2 text-sm text-gray-600">
                  Rating: <span className="font-semibold text-green-600">{meal.userRating}/10</span>
                </div>
              )}

              {/* Prep Time */}
              {meal.preparationTime && (
                <div className="mt-2 text-xs text-gray-500">
                  ⏱️ {meal.preparationTime} min prep time
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealList;