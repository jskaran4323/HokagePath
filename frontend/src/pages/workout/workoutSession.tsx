// frontend/src/pages/Workouts/StartWorkout.tsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type Workout, type Exercise, workoutApi } from '../../api/workout.api';

const WorkoutSession = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnding, setIsEnding] = useState(false);

  // Stopwatch
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (id) fetchWorkout();
  }, [id]);

  const fetchWorkout = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await workoutApi.getWorkout(id);
      setWorkout(response.data.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load workout');
      navigate('/workouts');
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = window.setInterval(() => setSecondsElapsed(prev => prev + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setSecondsElapsed(0);
  };

  const handleToggleExercise = (index: number) => {
    if (!workout) return;
    const newExercises = [...workout.exercises];
    newExercises[index].completed = !newExercises[index].completed;
    setWorkout({ ...workout, exercises: newExercises });
  };

  const handleEndWorkout = async () => {
    if (!workout || !id) return;
    stopTimer();
    setIsEnding(true);
    try {
      
        const newStatus = workout.exercises.every(ex => ex.completed)
        ? 'completed'
        : 'in_progress';
  
      await workoutApi.updateWorkout(id, {
        status: newStatus,
        exercises: workout.exercises,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
  
      alert('Workout ended!');
      navigate('/workouts');
    } catch (error) {
      console.error(error);
      alert('Failed to end workout');
    } finally {
      setIsEnding(false);
    }
  };
  
  if (isLoading || !workout) return <div>Loading workout...</div>;

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate('/workouts')} className="text-blue-600 mb-4">
        ← Back to Workouts
      </button>

      <h1 className="text-3xl font-bold mb-2">{workout.title}</h1>
      {workout.description && <p className="text-gray-600 mb-4">{workout.description}</p>}

      {/* Stopwatch */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col items-center">
        <div className="text-4xl font-mono mb-4">{formatTime(secondsElapsed)}</div>
        <div className="space-x-4">
          <button
            onClick={startTimer}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Start
          </button>
          <button
            onClick={stopTimer}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Stop
          </button>
          <button
            onClick={resetTimer}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Exercises */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Exercises</h2>
        <div className="space-y-3">
          {workout.exercises.map((ex: Exercise, index: number) => (
            <div
              key={ex.id || index}
              className={`flex items-center gap-3 p-3 border rounded ${
                ex.completed ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={ex.completed}
                onChange={() => handleToggleExercise(index)}
              />
              <div>
                <h3 className={`font-semibold ${ex.completed ? 'line-through text-gray-500' : ''}`}>
                  {ex.name}
                </h3>
                <div className="text-sm text-gray-600 flex gap-4">
                  <span>Sets: {ex.sets}</span>
                  <span>Reps: {ex.reps}</span>
                  {ex.duration && <span>Duration: {ex.duration}s</span>}
                  {ex.weight && <span>Weight: {ex.weight}kg</span>}
                </div>
                {ex.notes && <p className="text-sm text-gray-500 italic mt-1">{ex.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* End Workout Button */}
      <button
        onClick={handleEndWorkout}
        disabled={isEnding}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
      >
        {isEnding ? 'Ending Workout...' : 'End Workout'}
      </button>
    </div>
  );
};

export default WorkoutSession;
