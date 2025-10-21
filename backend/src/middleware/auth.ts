import { Request, Response, NextFunction } from 'express';
import authService, { AuthServiceError } from '../services/authService';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided. Authentication required.'
      });
      return;
    }

    // Use service to verify token
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();

  } catch (error: any) {
    if (error instanceof AuthServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};
