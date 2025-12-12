import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import userService from '../services/userService';
import uploadService from '../services/uploadService';
import postService from '../services/postService';
import { CreatePostDTO } from '../types/post.dto';
export const uploadProfilePicture = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const file = req.file as Express.MulterS3.File;

    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
      return;
    }

    // Get the S3 URL
    const imageUrl = file.location;

    // Update user profile with new image URL
    const user = await userService.updateProfile(userId, {
      profilePicture: imageUrl
    });

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        imageUrl,
        user
      }
    });

  } catch (error: any) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading profile picture',
      error: error.message
    });
  }
};

export const uploadPostImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.MulterS3.File[];
    

    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
      return;
    }

    // Get all image URLs
    const imageUrls: string[] = files.map(file => file.location);
    const postData: CreatePostDTO = {
      caption: req.body.caption,
      imageUrls,
      workoutRef: req.body.workoutRef,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      visibility: req.body.visibility,
      location: req.body.location
    };

    // Call your existing createPost method
    const post = await postService.createPost(req.user!.id, postData);
    console.log(post);
    
    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        imageUrls
      }
    });

  } catch (error: any) {
    console.error('Upload post images error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
      return;
    }

    await uploadService.deleteFile(imageUrl);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
};
