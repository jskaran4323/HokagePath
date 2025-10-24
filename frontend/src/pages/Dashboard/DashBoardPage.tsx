// frontend/src/pages/Dashboard/DashBoardPage.tsx

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../composables/useAuth';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isLoading, workoutStats, fitnessProfile } = useAuth();

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-gray-600">Ready to continue your fitness journey?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Streak</h3>
          <p className="text-4xl font-bold text-orange-500">
            {workoutStats?.currentStreak || 0}
          </p>
          <p className="text-gray-600 text-sm mt-1">days</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Workouts</h3>
          <p className="text-4xl font-bold text-blue-500">
            {workoutStats?.totalWorkouts || 0}
          </p>
          <p className="text-gray-600 text-sm mt-1">completed</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Fitness Goal</h3>
          <p className="text-2xl font-bold text-green-500 capitalize">
            {fitnessProfile?.fitnessGoal?.replace('_', ' ') || 'Not set'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/workouts/generate')}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold"
          >
            🔥 Generate AI Workout
          </button>
          <button 
            onClick={() => navigate('/workouts')}
            className="bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            📋 My Workouts
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="bg-purple-500 text-white py-4 px-6 rounded-lg hover:bg-purple-600 transition font-semibold"
          >
            👤 My Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;