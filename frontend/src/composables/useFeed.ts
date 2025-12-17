/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/composables/useFeed.ts

import { useState } from 'react';
import { feedApi, type Post, type CreatePostRequest } from '../api/feed.api';

export const useFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Fetch feed
  const fetchFeed = async (pageNum: number = 1, append: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await feedApi.getFeed(pageNum, 10);
       const newPosts = response.data.data;
       console.log("fetch feed", response.data);
      
       
      if (append) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      
      setHasMore(newPosts.length === 10);
      setPage(pageNum);
      return { success: true, posts: newPosts };
    } catch (err: any) {
      console.error('Fetch feed error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch feed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Load more posts
  const loadMore = async () => {
    if (!hasMore || isLoading) return;
    await fetchFeed(page + 1, true);
  };

  // Get user posts
  const fetchUserPosts = async (userId: string, pageNum: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await feedApi.getUserPosts(userId, pageNum, 10);
    
      const userPosts = response.data.data;
      setPosts(userPosts);
      return { success: true, posts: userPosts };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch user posts';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Get single post
  const fetchPost = async (postId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await feedApi.getPost(postId);
      const post = response.data.data; 
      setCurrentPost(post);
      return { success: true, post };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch post';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Create post
  const createPost = async (data: CreatePostRequest | FormData) => {
    setIsLoading(true);
    setError(null);
    try {
    
      
      const response = await feedApi.createPost(data);
      const post = response.data.data
      setPosts(prev => [post, ...prev]);
      return { success: true, post };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create post';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete post
  const deletePost = async (postId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await feedApi.deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete post';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Like post
  const likePost = async (postId: string) => {
    try {
      await feedApi.likePost(postId);
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, likesCount: p.likesCount + 1, isLikedByUser: true }
            : p
        )
      );
      if (currentPost && currentPost.id === postId) {
        setCurrentPost({
          ...currentPost,
          likesCount: currentPost.likesCount + 1,
          isLikedByUser: true
        });
      }
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to like post';
      return { success: false, error: errorMessage };
    }
  };

  // Unlike post
  const unlikePost = async (postId: string) => {
    try {
      await feedApi.unlikePost(postId);
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, likesCount: p.likesCount - 1, isLikedByUser: false }
            : p
        )
      );
      if (currentPost && currentPost.id === postId) {
        setCurrentPost({
          ...currentPost,
          likesCount: currentPost.likesCount - 1,
          isLikedByUser: false
        });
      }
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to unlike post';
      return { success: false, error: errorMessage };
    }
  };

  const uploadPostPictures  = async (files: File[]) =>{
      const formData = new FormData();

      files.forEach(file => {
        formData.append('images', file);
      });
  
      setIsLoading(true);
      setError(null);
      try {
        const response =  await feedApi.uploadPostImages(formData);
        const imageUrls = response.data.data.imageUrls;
        console.log("uploaded urls", imageUrls);

        return imageUrls;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message  || "Failed to upload"
        setError(errorMessage)
        return { success: false, error: errorMessage };
      }finally {
        setIsLoading(false);
      }
    }
  


  return {
    // State
    posts,
    currentPost,
    isLoading,
    error,
    hasMore,
    page,

    // Actions
    fetchFeed,
    loadMore,
    fetchUserPosts,
    fetchPost,
    createPost,
    deletePost,
    likePost,
    unlikePost,
    uploadPostPictures,

    // Setters
    setCurrentPost,
    clearError: () => setError(null),
  };
};