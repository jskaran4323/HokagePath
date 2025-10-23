import { CreatePostDTO, UpdatePostDTO } from '../types/post.dto';

export const validateCreatePost = (data: CreatePostDTO): string[] => {
  const errors: string[] = [];

  if (!data.caption || data.caption.trim().length === 0) {
    errors.push('Caption is required');
  } else if (data.caption.length > 500) {
    errors.push('Caption cannot exceed 500 characters');
  }

  if (data.visibility && !['public', 'followers', 'private'].includes(data.visibility)) {
    errors.push('Invalid visibility setting');
  }

  return errors;
};

export const validateUpdatePost = (data: UpdatePostDTO): string[] => {
  const errors: string[] = [];

  if (data.caption !== undefined && data.caption.length > 500) {
    errors.push('Caption cannot exceed 500 characters');
  }

  if (data.visibility && !['public', 'followers', 'private'].includes(data.visibility)) {
    errors.push('Invalid visibility setting');
  }

  return errors;
};