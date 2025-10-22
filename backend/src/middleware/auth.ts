import { Request, Response, NextFunction } from 'express';

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
   
    if (!(req.session as any).userId) {
      res.status(401).json({ 
        success: false,
        message: 'Not authenticated. Please login.' 
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: (req.session as any).userId,
      username: (req.session as any).username,
      email: (req.session as any).email
    };

    next();
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Authentication failed',
      error: error.message 
    });
  }
};