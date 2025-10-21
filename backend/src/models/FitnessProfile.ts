import { prop, modelOptions, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';

class WeightEntry {
  @prop({ required: true })
  public weight!: number;

  @prop({ required: true, default: () => new Date() })
  public date!: Date;

  @prop()
  public note?: string;
}

@modelOptions({ 
  schemaOptions: { 
    timestamps: true,
    collection: 'fitness_profiles' 
  } 
})
export class FitnessProfile {
  @prop({ ref: () => User, required: true, unique: true })
  public userId!: Ref<User>;

  @prop({ 
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance', 'strength', 'flexibility'],
    required: true,
    default: 'maintenance'
  })
  public fitnessGoal!: string;

  @prop({ required: true, min: 0 })
  public currentWeight!: number;

  @prop({ min: 0 })
  public targetWeight?: number;

  @prop({ required: true, min: 0 })
  public height!: number;

  @prop({ 
    enum: ['cm', 'inches'],
    default: 'cm'
  })
  public heightUnit!: string;

  @prop({ 
    enum: ['kg', 'lbs'],
    default: 'kg'
  })
  public weightUnit!: string;

  @prop({ required: true, min: 13, max: 120 })
  public age!: number;

  @prop({ 
    required: true,
    enum: ['male', 'female', 'other']
  })
  public gender!: string;

  @prop({ 
    required: true,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'super_active'],
    default: 'moderately_active'
  })
  public activityLevel!: string;

  @prop({ 
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  })
  public experienceLevel?: string;

  @prop({ type: () => [String], default: [] })
  public preferredWorkoutTypes?: string[];

  @prop({ type: () => [String], default: [] })
  public availableEquipment?: string[];

  @prop()
  public workoutDuration?: number;

  @prop({ min: 1, max: 7, default: 3 })
  public workoutsPerWeek?: number;

  @prop({ type: () => [String], default: [] })
  public injuries?: string[];

  @prop({ type: () => [String], default: [] })
  public dietaryRestrictions?: string[];

  @prop({ type: () => [WeightEntry], default: [] })
  public weightHistory!: WeightEntry[];

  @prop()
  public bmi?: number;

  @prop()
  public bmr?: number;

  @prop()
  public dailyCalorieTarget?: number;
}

const FitnessProfileModel = getModelForClass(FitnessProfile);
export default FitnessProfileModel;


