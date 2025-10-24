import { useState } from 'react';
import { useFitnessProfile } from '../../composables/useFitnessProfile';

const UpdateFitnessProfile = () => {
  const [formData, setFormData] = useState({
    fitnessGoal: '',
    currentWeight: 0,
    targetWeight: 0,
    height: 0,
    age: 0,
    gender: '',
    activityLevel: '',
    experienceLevel: '',
    availableEquipment: [] as string[],
    workoutDuration: 0,
    workoutsPerWeek: 0,
    injuries: [] as string[],
    dietaryRestrictions: [] as string[],
  });

  const { updateFitnessProfile, isLoading, error } = useFitnessProfile();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle arrays (comma-separated values)
    if (name === 'availableEquipment' || name === 'injuries' || name === 'dietaryRestrictions') {
      setFormData({
        ...formData,
        [name]: value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFitnessProfile(formData);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Update Fitness Profile
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fitness Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fitness Goal *
              </label>
              <select
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Goal</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="endurance">Endurance</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </div>

            {/* Current Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Weight (kg) *
              </label>
              <input
                type="number"
                name="currentWeight"
                value={formData.currentWeight || ''}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Target Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Weight (kg)
              </label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight || ''}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm) *
              </label>
              <input
                type="number"
                name="height"
                value={formData.height || ''}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                required
                min={13}
                max={120}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level *
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Activity Level</option>
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                <option value="very_active">Very Active (6-7 days/week)</option>
                <option value="super_active">Super Active (intense exercise daily)</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Workout Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workout Duration (minutes)
              </label>
              <input
                type="number"
                name="workoutDuration"
                value={formData.workoutDuration || ''}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Workouts per Week */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workouts per Week
              </label>
              <input
                type="number"
                name="workoutsPerWeek"
                value={formData.workoutsPerWeek || ''}
                onChange={handleChange}
                min={1}
                max={7}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Available Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Equipment (comma-separated)
            </label>
            <input
              type="text"
              name="availableEquipment"
              value={formData.availableEquipment.join(', ')}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., dumbbells, resistance bands, yoga mat"
            />
            <p className="text-sm text-gray-500 mt-1">Separate multiple items with commas</p>
          </div>

          {/* Injuries */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Injuries / Limitations (comma-separated)
            </label>
            <textarea
              name="injuries"
              value={formData.injuries.join(', ')}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., knee pain, lower back issues"
              rows={2}
            />
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Restrictions (comma-separated)
            </label>
            <textarea
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions.join(', ')}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., vegetarian, gluten-free, dairy-free"
              rows={2}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 disabled:bg-gray-400 font-medium text-lg"
          >
            {isLoading ? 'Updating...' : 'Update Fitness Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateFitnessProfile;
