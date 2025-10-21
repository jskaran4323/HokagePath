import { Request, Response } from 'express';
import { RegisterDTO, LoginDTO } from '../types/auth.dto';
import { validateRegisterInput, validateLoginInput } from '../utils/validation';
import authService, { AuthServiceError } from '../services/authService';

// Controller only handles HTTP requests and responses
// All business logic is in the service

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const registerData: RegisterDTO = req.body;

    // Validate input
    const validationErrors = validateRegisterInput(registerData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    // Call service to handle business logic
    const result = await authService.register(registerData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });

  } catch (error: any) {
    // Handle service errors
    if (error instanceof AuthServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
      return;
    }

    // Handle unexpected errors
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData: LoginDTO = req.body;

    // Validate input
    const validationErrors = validateLoginInput(loginData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    // Call service to handle business logic
    const result = await authService.login(loginData);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });

  } catch (error: any) {
    // Handle service errors
    if (error instanceof AuthServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    // Handle unexpected errors
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;

    // Call service to get user profile
    const result = await authService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error: any) {
    // Handle service errors
    if (error instanceof AuthServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    // Handle unexpected errors
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};
