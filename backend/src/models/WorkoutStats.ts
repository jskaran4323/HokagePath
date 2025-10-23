import { prop, modelOptions, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';

class StreakHistory {
  @prop({ required: true })
  public streakCount!: number;

  @prop({ required: true })
  public startDate!: Date;

  @prop({ required: true })
  public endDate!: Date;
}

@modelOptions({ 
  schemaOptions: { 
    timestamps: true,
    collection: 'workout_stats' 
  } 
})
export class WorkoutStats {
  @prop({ ref: () => User, required: true, unique: true })
  public userId!: Ref<User>;

  // Current streak
  @prop({ default: 0, min: 0 })
  public currentStreak!: number;

  @prop({ default: 0, min: 0 })
  public longestStreak!: number;

  @prop()
  public lastWorkoutDate?: Date;

  // Workout counts
  @prop({ default: 0, min: 0 })
  public totalWorkouts!: number;

  @prop({ default: 0, min: 0 })
  public totalWorkoutMinutes!: number;

  @prop({ default: 0, min: 0 })
  public totalCaloriesBurned!: number;

  // Workout type breakdown
  @prop({ type: () => Object, default: {} })
  public workoutTypeCount?: Record<string, number>;

  // Weekly stats
  @prop({ default: 0, min: 0 })
  public workoutsThisWeek!: number;

  @prop({ default: 0, min: 0 })
  public workoutsThisMonth!: number;

  // Achievements
  @prop({ type: () => [String], default: [] })
  public achievements!: string[];

  // Streak history
  @prop({ type: () => [StreakHistory], default: [] })
  public streakHistory!: StreakHistory[];

  // Personal records
  @prop({ type: () => Object, default: {} })
  public personalRecords?: Record<string, any>;
}

const WorkoutStatsModel = getModelForClass(WorkoutStats);
export default WorkoutStatsModel;