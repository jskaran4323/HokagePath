import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import postService, { PostServiceError } from '../services/postService';
import { CreatePostDTO, UpdatePostDTO } from '../../types/post.dto';
import { validateCreatePost, validateUpdatePost } from '../../utils/postValidation';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
     console.log(req.body.imageUrls);
     
    const postData: CreatePostDTO = {
      caption: req.body.caption,
      visibility: req.body.visibility,
      location: req.body.location,
      workoutRef: req.body.workoutRef,
      imageUrls: req.body.imageUrls,
      tags: [],
      
    };
    const validationErrors = validateCreatePost(postData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }
   
    const post = await postService.createPost(userId, postData);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });

  } catch (error: any) {
    if (error instanceof PostServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

export const getPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const postId = req.params.id;
    
    const post = await postService.getPostById(postId, userId);

    res.status(200).json({
      success: true,
      data: post
    });

  } catch (error: any) {
    if (error instanceof PostServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

export const getFeed = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    console.log(userId);
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const posts = await postService.getFeed(userId, page, limit);

    res.status(200).json({
      success: true,
      data: posts,
      count: posts.length,
      page,
      limit
    });

  } catch (error: any) {
    if (error instanceof PostServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Get feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feed',
      error: error.message
    });
  }
};

export const getUserPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?.id;
    const targetUserId = req.params.userId;

    const posts = await postService.getUserPosts(targetUserId, currentUserId);

    res.status(200).json({
      success: true,
      data: posts,
      count: posts.length
    });

  } catch (error: any) {
    if (error instanceof PostServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user posts',
      error: error.message
    });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const postId = req.params.id;
    const updateData: UpdatePostDTO = req.body;

    const validationErrors = validateUpdatePost(updateData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    const post = await postService.updatePost(postId, userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });

  } catch (error: any) {
    if (error instanceof PostServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const postId = req.params.id;

    await postService.deletePost(postId, userId);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error: any) {
    if (error instanceof PostServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};

export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const postId = req.params.id;

    const post = await postService.likePost(postId, userId);

    res.status(200).json({
      success: true,
      message: 'Post liked successfully',
      data: post
    });

  } catch (error: any) {
    if (error instanceof PostServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking post',
      error: error.message
    });
  }
};

export const unlikePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const postId = req.params.id;

    const post = await postService.unlikePost(postId, userId);

    res.status(200).json({
      success: true,
      message: 'Post unliked successfully',
      data: post
    });

  } catch (error: any) {
    if (error instanceof PostServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Unlike post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unliking post',
      error: error.message
    });
  }
};