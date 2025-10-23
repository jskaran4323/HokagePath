import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import userService, { UserServiceError } from '../services/userService';
import {  ChangePasswordDto, UpdateUserProfileDto } from '../types/user.dto';
import { validateUpdateProfile, validateChangePassword } from '../utils/uservalidation';

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void>=>{
    try{
        const userId = req.user!.id;
        const updateData: UpdateUserProfileDto = req.body;
        
        const validationErrors  = validateUpdateProfile(updateData);
        if (validationErrors.length > 0) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
              });
            return;
          }
          const user = await userService.updateProfile(userId, updateData);

          res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
          });
      
        } catch (error: any) {
          if (error instanceof UserServiceError) {
            res.status(error.statusCode).json({
              success: false,
              message: error.message
            });
            return;
          }
      
          console.error('Update profile error:', error);
          res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
          });
        }
      };
    
      export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
          const userId = req.user!.id;
          const passwordData: ChangePasswordDto = req.body;
        
  
          
          const validationErrors = validateChangePassword(passwordData);
          if (validationErrors.length > 0) {
            res.status(400).json({
              success: false,
              message: 'Validation failed',
              errors: validationErrors
            });
            return;
          }
      
          await userService.changeUserPassword(userId, passwordData);
      
          res.status(200).json({
            success: true,
            message: 'Password changed successfully'
          });
      
        } catch (error: any) {
          if (error instanceof UserServiceError) {
            res.status(error.statusCode).json({
              success: false,
              message: error.message
            });
            return;
          }
      
          console.error('Change password error:', error);
          res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
          });
        }
      };
      
      export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
          const targetUserId = req.params.userId;
          const currentUserId = req.user?.id;
      
          const profile = await userService.getUserPublicProfile(targetUserId, currentUserId);
      
          res.status(200).json({
            success: true,
            data: profile
          });
      
        } catch (error: any) {
          if (error instanceof UserServiceError) {
            res.status(error.statusCode).json({
              success: false,
              message: error.message
            });
            return;
          }
      
          console.error('Get user profile error:', error);
          res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
          });
        }
      };
      
      export const followUser = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
          const userId = req.user!.id;
          const targetUserId = req.params.userId;
      
          await userService.followUser(userId, targetUserId);
      
          res.status(200).json({
            success: true,
            message: 'User followed successfully'
          });
      
        } catch (error: any) {
          if (error instanceof UserServiceError) {
            res.status(error.statusCode).json({
              success: false,
              message: error.message
            });
            return;
          }
      
          console.error('Follow user error:', error);
          res.status(500).json({
            success: false,
            message: 'Error following user',
            error: error.message
          });
        }
      };
      
      export const unfollowUser = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
          const userId = req.user!.id;
          const targetUserId = req.params.userId;
      
          await userService.unfollowUser(userId, targetUserId);
      
          res.status(200).json({
            success: true,
            message: 'User unfollowed successfully'
          });
      
        } catch (error: any) {
          if (error instanceof UserServiceError) {
            res.status(error.statusCode).json({
              success: false,
              message: error.message
            });
            return;
          }
      
          console.error('Unfollow user error:', error);
          res.status(500).json({
            success: false,
            message: 'Error unfollowing user',
            error: error.message
          });
        }
      };
      
      export const getFollowers = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
          const userId = req.params.userId;
          const followers = await userService.getFollowers(userId);
      
          res.status(200).json({
            success: true,
            data: followers,
            count: followers.length
          });
      
        } catch (error: any) {
          if (error instanceof UserServiceError) {
            res.status(error.statusCode).json({
              success: false,
              message: error.message
            });
            return;
          }
      
          console.error('Get followers error:', error);
          res.status(500).json({
            success: false,
            message: 'Error fetching followers',
            error: error.message
          });
        }
      };
      
      export const getFollowing = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
          const userId = req.params.userId;
          const following = await userService.getFollowing(userId);
      
          res.status(200).json({
            success: true,
            data: following,
            count: following.length
          });
      
        } catch (error: any) {
          if (error instanceof UserServiceError) {
            res.status(error.statusCode).json({
              success: false,
              message: error.message
            });
            return;
          }
      
          console.error('Get following error:', error);
          res.status(500).json({
            success: false,
            message: 'Error fetching following',
            error: error.message
          });
        }
      };
      
      export const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
          const query = req.query.q as string;
          const currentUserId = req.user?.id;
      
          if (!query || query.trim().length === 0) {
            res.status(400).json({
              success: false,
              message: 'Search query is required'
            });
            return;
          }
      
          const users = await userService.searchUsers(query, currentUserId);
      
          res.status(200).json({
            success: true,
            data: users,
            count: users.length
          });
      
        } catch (error: any) {
          console.error('Search users error:', error);
          res.status(500).json({
            success: false,
            message: 'Error searching users',
            error: error.message
          });
        }
      };
      