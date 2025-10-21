import { prop, modelOptions, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';

class Food {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, min: 0 })
  public quantity!: number;

  @prop({ required: true })
  public unit!: string;

  @prop({ min: 0 })
  public calories?: number;

  @prop({ min: 0 })
  public protein?: number;

  @prop({ min: 0 })
  public carbs?: number;

  @prop({ min: 0 })
  public fats?: number;

  @prop({ min: 0 })
  public fiber?: number;
}

class Macros {
  @prop({ required: true, min: 0, default: 0 })
  public calories!: number;

  @prop({ required: true, min: 0, default: 0 })
  public protein!: number;

  @prop({ required: true, min: 0, default: 0 })
  public carbs!: number;

  @prop({ required: true, min: 0, default: 0 })
  public fats!: number;

  @prop({ min: 0, default: 0 })
  public fiber?: number;
}

@modelOptions({ 
  schemaOptions: { 
    timestamps: true,
    collection: 'meals' 
  } 
})
export class Meal {
  @prop({ ref: () => User, required: true })
  public userId!: Ref<User>;

  @prop({ required: true, trim: true })
  public title!: string;

  @prop({ maxlength: 1000 })
  public description?: string;

  @prop({ 
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
  })
  public mealType!: string;

  @prop({ type: () => [Food], required: true })
  public foods!: Food[];

  @prop({ type: () => Macros, required: true })
  public totalMacros!: Macros;

  @prop({ default: false })
  public isAIGenerated!: boolean;

  @prop()
  public aiPrompt?: string;

  @prop({ default: () => new Date() })
  public mealDate!: Date;

  @prop()
  public imageUrl?: string;

  @prop({ type: () => [String], default: [] })
  public dietaryTags?: string[];

  @prop()
  public preparationTime?: number;

  @prop()
  public recipe?: string;

  @prop({ min: 1, max: 10 })
  public userRating?: number;

  @prop()
  public notes?: string;
}

const MealModel = getModelForClass(Meal);
export default MealModel;