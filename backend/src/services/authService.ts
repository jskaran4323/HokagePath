import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/User';
import FitnessProfileModel from '../models/FitnessProfile';
import WorkoutStatsModel from '../models/WorkoutStats';
import { RegisterDTO, LoginDTO, UserResponseDTO } from '../types/auth.dto';

// Custom error class for service layer
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

// Service class containing all business logic
export class AuthService {
  
  // Generate JWT token
  private generateToken(userId: string, username: string, email: string): string {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(
      { id: userId, username, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  // Convert User model to UserResponseDTO
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

  // Register new user
  async register(data: RegisterDTO): Promise<{ user: UserResponseDTO; token: string }> {
    // Check if user already exists
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

    // Create user (password will be hashed by @pre hook)
    const user = await UserModel.create({
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName
    });

    // Create related records
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

    // Generate token
    const token = this.generateToken(
      user._id.toString(),
      user.username,
      user.email
    );

    return {
      user: this.toUserResponse(user),
      token
    };
  }

  // Login user
  async login(data: LoginDTO): Promise<{ user: UserResponseDTO; token: string }> {
    // Find user by email with password field
    const user = await UserModel.findOne({ email: data.email }).select('+password');

    if (!user) {
      throw new AuthServiceError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AuthServiceError('Invalid email or password', 401);
    }

    // Generate token
    const token = this.generateToken(
      user._id.toString(),
      user.username,
      user.email
    );

    return {
      user: this.toUserResponse(user),
      token
    };
  }

  // Get user profile with related data
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

  // Verify JWT token
  verifyToken(token: string): { id: string; username: string; email: string } {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      return jwt.verify(token, JWT_SECRET) as {
        id: string;
        username: string;
        email: string;
      };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthServiceError('Token expired', 401);
      }
      throw new AuthServiceError('Invalid token', 401);
    }
  }
}

// Export singleton instance
export default new AuthService();