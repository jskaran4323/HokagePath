// frontend/src/pages/Profile/FitnessProfilePage.tsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../composables/useAuth';

const FitnessProfilePage = () => {
  const { fitnessProfile, isLoading, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!fitnessProfile) {
        fetchUserProfile();
      }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading your fitness profile...</div>
      </div>
    );
  }

  if (!fitnessProfile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No Fitness Profile Found</h2>
          <p className="text-gray-600 mb-6">
            You haven't set up your fitness profile yet. Let's get started on your path to becoming Hokage!
          </p>
          <button
            onClick={() => navigate('/profile/fitness-setup')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Fitness Profile
          </button>
        </div>
      </div>
    );
  }

  const {
    age,
    gender,
    height,
    heightUnit,
    currentWeight,
    targetWeight,
    weightUnit,
    fitnessGoal,
    activityLevel,
    experienceLevel,
    preferredWorkoutTypes,
    dietaryRestrictions,
    injuries,
    availableEquipment,
    workoutsPerWeek,
    workoutDuration,
    bmi,
    bmr,
    dailyCalorieTarget,
  } = fitnessProfile;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Fitness Profile</h1>
        <button
          onClick={() => navigate('/profile/fitness-setup')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Basic Information
          </h2>
          <div className="space-y-3">
            <InfoRow label="Age" value={`${age} years`} />
            <InfoRow label="Gender" value={gender} />
            <InfoRow label="Height" value={`${height} ${heightUnit}`} />
            <InfoRow label="Current Weight" value={`${currentWeight} ${weightUnit}`} />
            {targetWeight && (
              <InfoRow label="Target Weight" value={`${targetWeight} ${weightUnit}`} />
            )}
            <InfoRow label="BMI" value={bmi?.toFixed(1) || 'N/A'} />
          </div>
        </div>

        {/* Fitness Goals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Fitness Goals
          </h2>
          <div className="space-y-3">
            <InfoRow label="Primary Goal" value={fitnessGoal} />
            <InfoRow label="Activity Level" value={activityLevel.replace('_', ' ')} />
            <InfoRow label="Experience" value={experienceLevel} />
            <InfoRow label="Workouts/Week" value={workoutsPerWeek} />
            <InfoRow label="Workout Duration" value={`${workoutDuration} min`} />
          </div>
        </div>

        {/* Nutrition Targets */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Nutrition Targets
          </h2>
          <div className="space-y-3">
            <InfoRow 
              label="Daily Calories" 
              value={`${dailyCalorieTarget || 'N/A'} kcal`} 
            />
            <InfoRow 
              label="BMR" 
              value={`${bmr || 'N/A'} kcal`} 
            />
            {targetWeight && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Weight Goal:</p>
                <p className="font-medium">
                  {currentWeight < targetWeight 
                    ? `Gain ${(targetWeight - currentWeight).toFixed(1)} ${weightUnit}` 
                    : currentWeight > targetWeight
                    ? `Lose ${(currentWeight - targetWeight).toFixed(1)} ${weightUnit}`
                    : 'Maintain weight'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Workout Preferences */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Workout Preferences
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Preferred Types:</p>
              {preferredWorkoutTypes && preferredWorkoutTypes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {preferredWorkoutTypes.map((type: string, index: number) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No preferences set</p>
              )}
            </div>
          </div>
        </div>

        {/* Available Equipment */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Available Equipment
          </h2>
          <div className="space-y-3">
            {availableEquipment && availableEquipment.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableEquipment.map((equipment: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {equipment}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No equipment specified</p>
            )}
          </div>
        </div>

        {/* Health & Restrictions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Health & Restrictions
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Injuries:</p>
              {injuries && injuries.length > 0 && injuries[0] !== 'n/A' && injuries[0] !== 'N/A' ? (
                <div className="flex flex-wrap gap-2">
                  {injuries.map((injury: string, index: number) => (
                    <span
                      key={index}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                    >
                      {injury}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">None reported</p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Dietary Restrictions:</p>
              {dietaryRestrictions && dietaryRestrictions.length > 0 && dietaryRestrictions[0] !== 'N/A' ? (
                <div className="flex flex-wrap gap-2">
                  {dietaryRestrictions.map((restriction: string, index: number) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      {restriction}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">None specified</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Your Journey Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{workoutsPerWeek}</p>
            <p className="text-sm opacity-90">Workouts per Week</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{workoutDuration}</p>
            <p className="text-sm opacity-90">Minutes per Session</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{dailyCalorieTarget || 0}</p>
            <p className="text-sm opacity-90">Daily Calorie Target</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for info rows
const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}:</span>
    <span className="font-medium capitalize">{value}</span>
  </div>
);

export default FitnessProfilePage;