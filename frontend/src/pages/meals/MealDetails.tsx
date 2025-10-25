// frontend/src/pages/Meals/MealDetail.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMeals } from '../../composables/useMeal';

const MealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentMeal, isLoading, fetchMeal, updateMeal, deleteMeal } = useMeals();
  const [isEditing, setIsEditing] = useState(false);
  
  const [editData, setEditData] = useState({
    userRating: 5,
    notes: ''
  });

  useEffect(() => {
    if (id) {
      loadMeal();
    }
  }, [id]);

  const loadMeal = async () => {
    if (!id) return;
    
    const result = await fetchMeal(id);
    if (!result.success) {
      alert('Failed to load meal');
      navigate('/meals');
    } else if (result.meal) {
      setEditData({
        userRating: result.meal.userRating || 5,
        notes: result.meal.notes || ''
      });
    }
  };

  const handleUpdate = async () => {
    if (!id) return;
    
    const result = await updateMeal(id, editData);
    if (result.success) {
      alert('Meal updated!');
      setIsEditing(false);
    } else {
      alert(result.error || 'Failed to update meal');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this meal?')) return;

    const result = await deleteMeal(id);
    if (result.success) {
      navigate('/meals');
    } else {
      alert(result.error || 'Failed to delete meal');
    }
  };

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
        <div className="text-xl">Loading meal...</div>
      </div>
    );
  }

  if (!currentMeal) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Meal not found</p>
          <button
            onClick={() => navigate('/meals')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Meals
          </button>
        </div>
      </div>
    );
  }

  const meal = currentMeal;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/meals')}
          className="text-green-600 hover:text-green-700 mb-4 flex items-center gap-2"
        >
          ← Back to Meals
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{getMealTypeIcon(meal.mealType)}</span>
              <div>
                <h1 className="text-3xl font-bold">{meal.title}</h1>
                <p className="text-sm text-gray-600 capitalize">{meal.mealType.replace('_', ' ')}</p>
              </div>
              {meal.isAIGenerated && (
                <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  AI Generated
                </span>
              )}
            </div>
            {meal.description && (
              <p className="text-gray-600 mt-2">{meal.description}</p>
            )}
          </div>
          
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 px-4 py-2"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Macros Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Nutrition Facts</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Calories</p>
            <p className="text-2xl font-bold text-orange-600">{meal.totalMacros.calories}</p>
            <p className="text-xs text-gray-500">kcal</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Protein</p>
            <p className="text-2xl font-bold text-blue-600">{meal.totalMacros.protein}</p>
            <p className="text-xs text-gray-500">grams</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Carbs</p>
            <p className="text-2xl font-bold text-yellow-600">{meal.totalMacros.carbs}</p>
            <p className="text-xs text-gray-500">grams</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Fats</p>
            <p className="text-2xl font-bold text-red-600">{meal.totalMacros.fats}</p>
            <p className="text-xs text-gray-500">grams</p>
          </div>
          {meal.totalMacros.fiber && (
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Fiber</p>
              <p className="text-2xl font-bold text-green-600">{meal.totalMacros.fiber}</p>
              <p className="text-xs text-gray-500">grams</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          {meal.preparationTime && (
            <p className="text-sm text-gray-600">
              ⏱️ Preparation Time: <span className="font-semibold">{meal.preparationTime} minutes</span>
            </p>
          )}
          <p className="text-sm text-gray-500">
            {new Date(meal.mealDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Foods/Ingredients */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <div className="space-y-3">
          {meal.foods.map((food, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-3">
              <div className="flex-1">
                <h3 className="font-semibold">{food.name}</h3>
                <p className="text-sm text-gray-600">
                  {food.quantity} {food.unit}
                </p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p className="font-semibold">{food.calories || 0} kcal</p>
                <p className="text-xs">
                  P: {food.protein || 0}g | C: {food.carbs || 0}g | F: {food.fats || 0}g
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe */}
      {meal.recipe && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Recipe Instructions</h2>
          <div className="prose max-w-none">
            <p className="whitespace-pre-line text-gray-700">{meal.recipe}</p>
          </div>
        </div>
      )}

      {/* Dietary Tags */}
      {meal.dietaryTags && meal.dietaryTags.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">Dietary Tags</h2>
          <div className="flex flex-wrap gap-2">
            {meal.dietaryTags.map((tag, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm capitalize">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Rating & Notes Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {!isEditing ? (
          <div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Your Review</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Edit
              </button>
            </div>
            
            {meal.userRating && (
              <p className="text-lg mb-2">
                Rating: <span className="font-bold text-green-600">{meal.userRating}/10</span>
              </p>
            )}
            
            {meal.notes && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 font-medium mb-1">Notes:</p>
                <p className="text-gray-700 italic">{meal.notes}</p>
              </div>
            )}

            {!meal.userRating && !meal.notes && (
              <p className="text-gray-500 text-sm">No review yet</p>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Edit Review</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editData.userRating}
                  onChange={(e) => setEditData({...editData, userRating: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={editData.notes}
                  onChange={(e) => setEditData({...editData, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="How was this meal?"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealDetail;