import WorkoutModel from '../models/Workout';
import WorkoutStatsModel from '../models/WorkoutStats';
import { CreateWorkoutDTO, UpdateWorkoutDTO, WorkoutResponseDTO } from '../types/workout.dto';
import { WorkoutStatsDto } from '../types/workoutStatDto';

// _id
// 68f802683171290f990dc6cc
// userId
// 68f802683171290f990dc6c9
// currentStreak
// 0
// longestStreak
// 0
// totalWorkouts
// 0
// totalWorkoutMinutes
// 0
// totalCaloriesBurned
// 0
// workoutsThisWeek
// 0
// workoutsThisMonth
// 0

// achievements
// Array (empty)

// streakHistory
// Array (empty)
// createdAt
// 2025-10-21T22:00:08.113+00:00
// updatedAt
// 2025-10-21T22:00:08.113+00:00
// __v
// 0
export class WorkoutServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'WorkoutServiceError';
  }
}

export class WorkoutService {

  private toWorkoutResponse(workout: any): WorkoutResponseDTO {
    return {
      id: workout._id.toString(),
      userId: workout.userId.toString(),
      title: workout.title,
      description: workout.description,
      workoutType: workout.workoutType,
      exercises: workout.exercises,
      duration: workout.duration,
      caloriesBurned: workout.caloriesBurned,
      status: workout.status,
      isAIGenerated: workout.isAIGenerated,
      workoutDate: workout.workoutDate,
      difficulty: workout.difficulty,
      userRating: workout.userRating,
      createdAt: workout.createdAt,
      updatedAt: workout.updatedAt
    };
  }

  async createWorkout(userId: string, data: CreateWorkoutDTO): Promise<WorkoutResponseDTO> {
    const workout = await WorkoutModel.create({
      userId,
      title: data.title,
      description: data.description,
      workoutType: data.workoutType,
      exercises: data.exercises,
      duration: data.duration,
      caloriesBurned: data.caloriesBurned,
      workoutDate: data.workoutDate || new Date(),
      difficulty: data.difficulty,
      tags: data.tags,
      status: 'scheduled'
    });
    console.log(workout.caloriesBurned);
    

    return this.toWorkoutResponse(workout);
  }

  async getWorkoutById(workoutId: string, userId: string): Promise<WorkoutResponseDTO> {
    const workout = await WorkoutModel.findOne({ _id: workoutId, userId });

    if (!workout) {
      throw new WorkoutServiceError('Workout not found', 404);
    }

    return this.toWorkoutResponse(workout);
  }

  async getUserWorkouts(userId: string, filters?: {
    status?: string;
    workoutType?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<WorkoutResponseDTO[]> {
    const query: any = { userId };

    if (filters?.status) {
      query.status = filters.status;
    }
    if (filters?.workoutType) {
      query.workoutType = filters.workoutType;
    }
    if (filters?.startDate || filters?.endDate) {
      query.workoutDate = {};
      if (filters.startDate) query.workoutDate.$gte = filters.startDate;
      if (filters.endDate) query.workoutDate.$lte = filters.endDate;
    }

    const workouts = await WorkoutModel.find(query).sort({ workoutDate: -1 });
    return workouts.map(w => this.toWorkoutResponse(w));
  }

  async updateWorkout(workoutId: string, userId: string, data: UpdateWorkoutDTO): Promise<WorkoutResponseDTO> {
    const workout = await WorkoutModel.findOne({ _id: workoutId, userId });

    if (!workout) {
      throw new WorkoutServiceError('Workout not found', 404);
    }

    Object.assign(workout, data);
    await workout.save();

    if (data.status === 'completed') {
      await this.updateWorkoutStats(userId, workout);
    }

    return this.toWorkoutResponse(workout);
  }

  async deleteWorkout(workoutId: string, userId: string): Promise<void> {
    const workout = await WorkoutModel.findOneAndDelete({ _id: workoutId, userId });

    if (!workout) {
      throw new WorkoutServiceError('Workout not found', 404);
    }
  }
  
 async getWorkoutStats(userId: string): Promise<WorkoutStatsDto> {
 const stats = await WorkoutStatsModel.findOne({ userId }).lean();
  return stats as WorkoutStatsDto;
}

  async updateWorkoutStats(userId: string, workout: any): Promise<void> {
    const stats = await WorkoutStatsModel.findOne({ userId });

    if (!stats) return;

    stats.totalWorkouts += 1;
    stats.totalWorkoutMinutes += workout.duration;
    if (workout.caloriesBurned) {
      stats.totalCaloriesBurned += workout.caloriesBurned;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!stats.lastWorkoutDate) {
      stats.currentStreak = 1;
      stats.longestStreak = 1;
    } else {
      const lastWorkout = new Date(stats.lastWorkoutDate);
      lastWorkout.setHours(0, 0, 0, 0);
      const diffDays = (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        stats.currentStreak += 1;
        if (stats.currentStreak > stats.longestStreak) {
          stats.longestStreak = stats.currentStreak;
        }
      } else if (diffDays > 1) {
        stats.currentStreak = 1;
      }
    }

    stats.lastWorkoutDate = new Date();
    await stats.save();
  }
}

export default new WorkoutService();

