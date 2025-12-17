// frontend/src/pages/Workouts/WorkoutList.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutApi, type Workout } from '../../api/workout.api';

const WorkoutList = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchWorkouts();
  }, [filter]);

  const fetchWorkouts = async () => {
    setIsLoading(true);
    try {
      const response = await workoutApi.getWorkouts(filter === 'all' ? undefined : filter);
    
      
      setWorkouts(response.data.data);

    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-gray-100 text-gray-800';
      case 'skipped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyStars = (difficulty?: number) => {
    if (!difficulty) return '';
    return '⭐'.repeat(difficulty);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading workouts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Workouts</h1>
        <button
          onClick={() => navigate('/workouts/generate')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold"
        >
          ✨ Generate New Workout
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'scheduled', 'in_progress', 'completed', 'skipped'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Workout Grid */}
      {workouts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4 text-lg">No workouts found</p>
          <p className="text-gray-500 mb-6">Start your fitness journey by generating your first AI-powered workout!</p>
          <button
            onClick={() => navigate('/workouts/generate')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold"
          >
            🔥 Generate Your First Workout
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              onClick={() => navigate(`/workouts/${workout.id}`)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">{workout.title}</h3>
                {workout.isAIGenerated && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                    ✨ AI
                  </span>
                )}
              </div>

              {/* Description */}
              {workout.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {workout.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span>{workout.exercises.length} exercises</span>
                <span>{workout.duration} min</span>
                <span className="capitalize">{workout.workoutType}</span>
              </div>

              {/* Difficulty & Rating */}
              <div className="flex items-center gap-3 mb-3">
                {workout.difficulty && (
                  <span className="text-sm text-yellow-600">
                    {getDifficultyStars(workout.difficulty)}
                  </span>
                )}
                {workout.userRating && (
                  <span className="text-sm text-gray-600">
                    Rating: {workout.userRating}/10
                  </span>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`text-xs px-3 py-1 rounded-full capitalize ${getStatusColor(workout.status)}`}>
                  {workout.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(workout.workoutDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;