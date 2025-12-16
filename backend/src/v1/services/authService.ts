
import bcrypt from 'bcryptjs';
import UserModel from '../../models/User';
import FitnessProfileModel from '../../models/FitnessProfile';
import WorkoutStatsModel from '../../models/WorkoutStats';
import { RegisterDTO, LoginDTO, UserResponseDTO } from '../../types/auth.dto';

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

export class AuthService {

  private toUserResponse(user: any): UserResponseDTO {
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      bio: user.bio
    };
  }

  async register(data: RegisterDTO): Promise<UserResponseDTO> {
    const existingUser = await UserModel.findOne({
      $or: [
        { email: data.email },
        { username: data.username }
      ]
    });

    if (existingUser) {
      const message = existingUser.email === data.email 
        ? 'Email already in use' 
        : 'Username already taken';
      throw new AuthServiceError(message, 400);
    }

    const user = await UserModel.create({
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName
    });

    await Promise.all([
      FitnessProfileModel.create({
        userId: user._id,
        currentWeight: 0,
        height: 0,
        age: 18,
        gender: 'other',
        fitnessGoal: 'maintenance'
      }),
      WorkoutStatsModel.create({
        userId: user._id
      })
    ]);

    return this.toUserResponse(user);
  }

  async login(data: LoginDTO): Promise<UserResponseDTO> {
    const user = await UserModel.findOne({ email: data.email }).select('+password');

    if (!user) {
      throw new AuthServiceError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AuthServiceError('Invalid email or password', 401);
    }

    return this.toUserResponse(user);
  }

  async getUserProfile(userId: string) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AuthServiceError('User not found', 404);
    }

    const [fitnessProfile, workoutStats] = await Promise.all([
      FitnessProfileModel.findOne({ userId }),
      WorkoutStatsModel.findOne({ userId })
    ]);

    return {
      user: this.toUserResponse(user),
      fitnessProfile,
      workoutStats
    };
  }
}

export default new AuthService();