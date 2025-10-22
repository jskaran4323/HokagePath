import { prop, pre, modelOptions, getModelForClass, Ref,} from "@typegoose/typegoose";
import bcrypt from 'bcryptjs';

@pre<User>('save', async function() {
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  })
@modelOptions({
    schemaOptions:{
        timestamps: true,
        collection: 'users'
    }
})
export class User{
 @prop({
    required:true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
 })
 public username!: string;
 @prop({ 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/
  })
  public email!: string;

@prop({
    required: true,
    minlength: 6,
    select: false
})
public password!: string;
@prop({ required: true, trim: true })
public fullName!: string;
@prop({ default: '' })
public profilePicture: string;

@prop({ maxlength: 500, default: '' })
public bio?: string;


  // Social features - References to other users
  @prop({ ref: () => User, default: [] })
  public followers!: Ref<User>[];

  @prop({ ref: () => User, default: [] })
  public following!: Ref<User>[];
}

const UserModel = getModelForClass(User);
export default UserModel;