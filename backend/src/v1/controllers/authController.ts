import { Request, Response } from 'express';
import { RegisterDTO, LoginDTO } from '../../types/auth.dto';
import { validateRegisterInput, validateLoginInput } from '../../utils/validation';
import authService, { AuthServiceError } from '../services/authService';

/**
 * User Registration
 * @param req 
 * @param res 
 * @returns 
 */
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
    const user = await authService.register(registerData);
    
    (req.session as any).userId = user.id;
    (req.session as any).username = user.username;
    (req.session as any).email = user.email;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
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

/**
 * Logging in user
 * @param req 
 * @param res 
 * @returns 
 */

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

    const user = await authService.login(loginData);

    // Create session
    (req.session as any).userId = user.id;
    (req.session as any).username = user.username;
    (req.session as any).email = user.email;


    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {user}
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

/**
 * Logout user
 * @param req 
 * @param res 
 */

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Error logging out'
        });
        return;
      }

      res.clearCookie('connect.sid');
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out',
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
