import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import commentService, { CommentServiceError } from '../services/commentService';
import { CreateCommentDTO, UpdateCommentDTO } from '../../types/comment.dto';
import { validateCreateComment, validateUpdateComment } from '../../utils/commentValidation';

/**
 * User Comment 
 * @param req 
 * @param res 
 * @returns 
 */
export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const postId = req.params.postId;
    const commentData: CreateCommentDTO = req.body;

    const validationErrors = validateCreateComment(commentData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    const comment = await commentService.createComment(postId, userId, commentData);

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: comment
    });

  } catch (error: any) {
    if (error instanceof CommentServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating comment',
      error: error.message
    });
  }
};

export const getPostComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const postId = req.params.postId;

    const comments = await commentService.getPostComments(postId, userId);

    res.status(200).json({
      success: true,
      data: comments,
      count: comments.length
    });

  } catch (error: any) {
    console.error('Get post comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

export const getCommentReplies = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const commentId = req.params.commentId;

    const replies = await commentService.getCommentReplies(commentId, userId);

    res.status(200).json({
      success: true,
      data: replies,
      count: replies.length
    });

  } catch (error: any) {
    console.error('Get comment replies error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching replies',
      error: error.message
    });
  }
};

export const updateComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const commentId = req.params.commentId;
    const updateData: UpdateCommentDTO = req.body;

    const validationErrors = validateUpdateComment(updateData);
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
      return;
    }

    const comment = await commentService.updateComment(commentId, userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    });

  } catch (error: any) {
    if (error instanceof CommentServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating comment',
      error: error.message
    });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const commentId = req.params.commentId;

    await commentService.deleteComment(commentId, userId);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error: any) {
    if (error instanceof CommentServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
};

export const likeComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const commentId = req.params.commentId;

    const comment = await commentService.likeComment(commentId, userId);

    res.status(200).json({
      success: true,
      message: 'Comment liked successfully',
      data: comment
    });

  } catch (error: any) {
    if (error instanceof CommentServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Like comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking comment',
      error: error.message
    });
  }
};

export const unlikeComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const commentId = req.params.commentId;

    const comment = await commentService.unlikeComment(commentId, userId);

    res.status(200).json({
      success: true,
      message: 'Comment unliked successfully',
      data: comment
    });

  } catch (error: any) {
    if (error instanceof CommentServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Unlike comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unliking comment',
      error: error.message
    });
  }
};