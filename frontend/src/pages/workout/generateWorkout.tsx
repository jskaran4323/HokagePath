/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/pages/Workouts/GenerateWorkout.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutApi, type GenerateWorkoutRequest } from '../../api/workout.api';
import { useAuth } from '../../composables/useAuth';

const GenerateWorkout = () => {
  const navigate = useNavigate();
  const { fitnessProfile } = useAuth();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<GenerateWorkoutRequest>({
    focus: fitnessProfile?.fitnessGoal || 'strength',
    duration: fitnessProfile?.workoutDuration || 45,
    difficulty: 3, // Medium difficulty (1-5 scale)
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await workoutApi.generateWorkout(formData);
      
      const workoutId = response.data.data._id;
   
      
     
      navigate(`/workouts/${workoutId}`);
    } catch (error: any) {
      console.error('Failed to generate workout:', error);
      alert(error.response?.data?.message || 'Failed to generate workout');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Generate AI Workout</h1>
        <p className="text-gray-600">
          Let AI create a personalized workout plan based on your fitness profile
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Focus/Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Focus
            </label>
            <select
              value={formData.focus}
              onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="strength">Strength Training</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
              <option value="sports">Sports</option>
              <option value="mixed">Mixed</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="15"
              max="120"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level (1-5)
            </label>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: level })}
                  className={`py-3 px-4 rounded-lg font-medium transition ${
                    formData.difficulty === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Easy</span>
              <span>Hard</span>
            </div>
          </div>

          {/* Profile Info Display */}
          {fitnessProfile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2 font-medium">
                AI will consider your profile:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>Experience: {fitnessProfile.experienceLevel}</li>
                <li>Equipment: {fitnessProfile.availableEquipment.join(', ')}</li>
                {fitnessProfile.injuries.length > 0 && fitnessProfile.injuries[0] !== 'N/A' && (
                  <li>Injuries to avoid: {fitnessProfile.injuries.join(', ')}</li>
                )}
              </ul>
            </div>
          )}

          {/* Generate Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating Workout...' : 'Generate AI Workout'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateWorkout;