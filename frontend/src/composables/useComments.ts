/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/composables/useComments.ts

import { useState, useCallback } from 'react';
import { feedApi, type Comment, type CreateCommentRequest } from '../api/feed.api';


export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments - WRAPPED IN useCallback
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await feedApi.getComments(postId);
      const commentsData = response.data.data 
      console.log(commentsData);
      
      setComments(commentsData);
      return { success: true, comments: commentsData };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch comments';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [postId]); // Only recreate when postId changes

  // Create comment - WRAPPED IN useCallback
  const createComment = useCallback(async (data: CreateCommentRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await feedApi.createComment(postId, data);
      const comment = response.data.data || response.data.comment || response.data;
      
      if (data.parentCommentId) {
        // Add as reply
        setComments(prev => addReplyToComment(prev, data.parentCommentId!, comment));
      } else {
        // Add as top-level comment
        setComments(prev => [comment, ...prev]);
      }
      
      return { success: true, comment };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create comment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Delete comment - WRAPPED IN useCallback + FIXED API CALL
  const deleteComment = useCallback(async (commentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await feedApi.deleteComment(commentId); // ✅ FIXED: Pass commentId, not postId
      setComments(prev => removeCommentById(prev, commentId));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete comment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed

  // Helper: Add reply to nested comment
  const addReplyToComment = (comments: Comment[], parentId: string, reply: Comment): Comment[] => {
    return comments.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [reply, ...(comment.replies || [])]
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: addReplyToComment(comment.replies, parentId, reply)
        };
      }
      return comment;
    });
  };

  // Helper: Remove comment by ID
  const removeCommentById = (comments: Comment[], commentId: string): Comment[] => {
    return comments
      .filter(comment => comment.id !== commentId)
      .map(comment => ({
        ...comment,
        replies: comment.replies ? removeCommentById(comment.replies, commentId) : undefined
      }));
  };

  // Clear error - WRAPPED IN useCallback
  const clearError = useCallback(() => setError(null), []);

  return {
    // State
    comments,
    isLoading,
    error,

    // Actions
    fetchComments,
    createComment,
    deleteComment,

    // Setters
    clearError,
  };
};