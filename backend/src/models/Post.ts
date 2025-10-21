import { prop, modelOptions, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';
import { Workout } from './Workout';

@modelOptions({ 
  schemaOptions: { 
    timestamps: true,
    collection: 'posts' 
  } 
})
export class Post {
  @prop({ ref: () => User, required: true })
  public author!: Ref<User>;

  @prop({ required: true, trim: true, maxlength: 500 })
  public caption!: string;

  @prop({ type: () => [String], default: [] })
  public imageUrls!: string[];

  @prop({ ref: () => Workout })
  public workoutRef?: Ref<Workout>;

  @prop({ ref: () => User, default: [] })
  public likes!: Ref<User>[];

  @prop({ default: 0, min: 0 })
  public likesCount!: number;

  @prop({ default: 0, min: 0 })
  public commentsCount!: number;

  @prop({ type: () => [String], default: [] })
  public tags?: string[];

  @prop({ default: true })
  public isVisible!: boolean;

  @prop({ 
    enum: ['public', 'followers', 'private'],
    default: 'public'
  })
  public visibility!: string;

  @prop()
  public location?: string;
}

const PostModel = getModelForClass(Post);
export default PostModel;