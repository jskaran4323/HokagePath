/* eslint-disable @typescript-eslint/no-unused-vars */
// frontend/src/pages/Workouts/WorkoutDetail.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutApi, type Workout, type Exercise } from '../../api/workout.api';

const WorkoutDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // For completion form
  const [completionData, setCompletionData] = useState({
    caloriesBurned: 0,
    userRating: 5,
    feedback: ''
  });

  useEffect(() => {
    if (id) {
      fetchWorkout();
    }
  }, [id]);

  const fetchWorkout = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const response = await workoutApi.getWorkout(id);
      setWorkout(response.data.data);
      
      
    } catch (error) {
      console.error('Failed to fetch workout:', error);
      alert('Failed to load workout');
      navigate('/workouts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = async () => {
    navigate(`/workout/${workout?.id}`)
  };

  const handleComplete = async () => {
    navigate(`/workout/${workout?.id}`)
  };

  const handleToggleExercise = async (exerciseIndex: number) => {
    if (!id || !workout) return;

    const exercise = workout.exercises[exerciseIndex];
    try {
      await workoutApi.updateExercise(id, exerciseIndex, {
        completed: !exercise.completed
      });
      fetchWorkout();
    } catch (error) {
      console.error('Failed to update exercise:', error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this workout?')) return;

    try {
      await workoutApi.deleteWorkout(id);
      navigate('/workouts');
    } catch (error) {
      console.error('Failed to delete workout:', error);
      alert('Failed to delete workout');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading workout...</div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Workout not found</p>
          <button
            onClick={() => navigate('/workouts')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  const completedExercises = workout.exercises.filter(ex => ex.completed).length;
  const progressPercentage = (completedExercises / workout.exercises.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/workouts')}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Back to Workouts
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{workout.title}</h1>
              {workout.isAIGenerated && (
                <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  AI Generated
                </span>
              )}
            </div>
            {workout.description && (
              <p className="text-gray-600">{workout.description}</p>
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

      {/* Workout Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-xl font-semibold">{workout.duration} min</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Difficulty</p>
            <p className="text-xl font-semibold">{'⭐'.repeat(workout.difficulty || 3)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="text-xl font-semibold capitalize">{workout.workoutType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-xl font-semibold capitalize">{workout.status.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="text-xl font-semibold">{new Date(workout.workoutDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {workout.status === 'in_progress' && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{completedExercises} / {workout.exercises.length} exercises</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Rating & Feedback (if completed) */}
        {workout.status === 'completed' && (
          <div className="mt-4 pt-4 border-t">
            {workout.userRating && (
              <p className="text-sm text-gray-600">
                Your Rating: <span className="font-semibold">{workout.userRating}/10</span>
              </p>
            )}
            {workout.feedback && (
              <p className="text-sm text-gray-600 mt-2">
                Feedback: <span className="italic">{workout.feedback}</span>
              </p>
            )}
            {workout.caloriesBurned && (
              <p className="text-sm text-gray-600 mt-2">
                Calories Burned: <span className="font-semibold">{workout.caloriesBurned} kcal</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Exercises List */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Exercises</h2>
        <div className="space-y-4">
          {workout.exercises.map((exercise: Exercise, index: number) => (
            <div
              key={index}
              className={`border rounded-lg p-4 transition ${
                exercise.completed ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {workout.status === 'in_progress' && (
                      <input
                        type="checkbox"
                        checked={exercise.completed || false}
                        onChange={() => handleToggleExercise(index)}
                        className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                      />
                    )}
                    <h3 className={`text-lg font-semibold ${exercise.completed ? 'line-through text-gray-500' : ''}`}>
                      {exercise.name}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 ml-8">
                    <span>Sets: {exercise.sets}</span>
                    <span>Reps: {exercise.reps}</span>
                    {exercise.weight && (
                      <span>Weight: {exercise.weight} {exercise.weightUnit || 'kg'}</span>
                    )}
                    {exercise.duration && <span>Duration: {exercise.duration}s</span>}
                    {exercise.distance && (
                      <span>Distance: {exercise.distance} {exercise.distanceUnit || 'km'}</span>
                    )}
                  </div>
                  
                  {exercise.notes && (
                    <p className="text-sm text-gray-600 mt-2 ml-8 italic">
                      Note: {exercise.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {workout.status === 'scheduled' && (
          <button
            onClick={handleStart}
            disabled={isStarting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isStarting ? 'Starting...' : 'Start Workout'}
          </button>
        )}
        
        {workout.status === 'in_progress' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Complete Workout</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calories Burned (optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={completionData.caloriesBurned}
                  onChange={(e) => setCompletionData({...completionData, caloriesBurned: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate this workout (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={completionData.userRating}
                  onChange={(e) => setCompletionData({...completionData, userRating: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback (optional)
                </label>
                <textarea
                  value={completionData.feedback}
                  onChange={(e) => setCompletionData({...completionData, feedback: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="How was the workout?"
                />
              </div>

              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {isCompleting ? 'Completing...' : 'Complete Workout'}
              </button>
            </div>
          </div>
        )}

        {workout.status === 'completed' && (
          <div className="w-full bg-green-100 text-green-800 py-3 rounded-lg font-semibold text-center">
            ✅ Workout Completed!
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetail;