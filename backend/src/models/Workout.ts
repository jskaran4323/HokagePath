// ============================================
// backend/src/models/Workout.ts
// ============================================

import { prop, modelOptions, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';

class Exercise {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public sets!: number;

  @prop({ required: true })
  public reps!: number;

  @prop()
  public weight?: number;

  @prop({ enum: ['kg', 'lbs'], default: 'kg' })
  public weightUnit?: string;

  @prop()
  public duration?: number;

  @prop()
  public distance?: number;

  @prop({ enum: ['km', 'miles'], default: 'km' })
  public distanceUnit?: string;

  @prop()
  public notes?: string;

  @prop({ default: false })
  public completed!: boolean;
}

@modelOptions({ 
  schemaOptions: { 
    timestamps: true,
    collection: 'workouts' 
  } 
})
export class Workout {
  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;

  @prop({ required: true, trim: true })
  public title!: string;

  @prop({ maxlength: 1000 })
  public description?: string;

  @prop({ 
    required: true,
    enum: ['strength', 'cardio', 'flexibility', 'sports', 'mixed', 'other'],
    default: 'mixed'
  })
  public workoutType!: string;

  @prop({ type: () => [Exercise], required: true })
  public exercises!: Exercise[];

  @prop({ required: true, min: 0 })
  public duration!: number;

  @prop({ min: 0 })
  public caloriesBurned?: number;

  @prop({ 
    required: true,
    enum: ['scheduled', 'in_progress', 'completed', 'skipped'],
    default: 'scheduled'
  })
  public status!: string;

  @prop({ default: false })
  public isAIGenerated!: boolean;

  @prop()
  public aiPrompt?: string;

  @prop({ default: () => new Date() })
  public workoutDate!: Date;

  @prop({ min: 1, max: 5 })
  public difficulty?: number;

  @prop({ min: 1, max: 10 })
  public userRating?: number;

  @prop()
  public feedback?: string;

  @prop({ type: () => [String], default: [] })
  public tags?: string[];
}

const WorkoutModel = getModelForClass(Workout);
export default WorkoutModel;
