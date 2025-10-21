import { CreateCommentDTO, UpdateCommentDTO } from '../types/comment.dto';

export const validateCreateComment = (data: CreateCommentDTO): string[] => {
  const errors: string[] = [];

  if (!data.text || data.text.trim().length === 0) {
    errors.push('Comment text is required');
  } else if (data.text.length > 500) {
    errors.push('Comment cannot exceed 500 characters');
  }

  return errors;
};

export const validateUpdateComment = (data: UpdateCommentDTO): string[] => {
  const errors: string[] = [];

  if (!data.text || data.text.trim().length === 0) {
    errors.push('Comment text is required');
  } else if (data.text.length > 500) {
    errors.push('Comment cannot exceed 500 characters');
  }

  return errors;
};