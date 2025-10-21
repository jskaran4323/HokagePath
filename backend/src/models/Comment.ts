import { prop, modelOptions, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';
import { Post } from './Post';

@modelOptions({ 
  schemaOptions: { 
    timestamps: true,
    collection: 'comments' 
  } 
})
export class Comment {
  @prop({ ref: () => Post, required: true })
  public postId!: Ref<Post>;

  @prop({ ref: () => User, required: true })
  public author!: Ref<User>;

  @prop({ required: true, trim: true, maxlength: 500 })
  public text!: string;

  @prop({ ref: () => Comment })
  public parentComment?: Ref<Comment>;

  @prop({ ref: () => User, default: [] })
  public likes!: Ref<User>[];

  @prop({ default: 0, min: 0 })
  public likesCount!: number;

  @prop({ default: 0, min: 0 })
  public repliesCount!: number;

  @prop({ default: false })
  public isEdited!: boolean;

  @prop({ default: true })
  public isVisible!: boolean;
}

const CommentModel = getModelForClass(Comment);
export default CommentModel;