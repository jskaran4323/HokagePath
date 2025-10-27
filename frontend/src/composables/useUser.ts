/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/composables/useUser.ts

import { useState } from 'react';
import { userApi, type UserProfile, type UpdateProfileRequest } from '../api/user.api';

export const useUser = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user profile
  const fetchUserProfile = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.getUserProfile(userId);
      console.log('User Profile Response:', response.data); // Debug log
      
      // Extract profile from response
      const profile = response.data.data || response.data.user || response.data;
      setUserProfile(profile);
      return { success: true, profile };
    } catch (err: any) {
      console.error('Fetch user profile error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch user profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Get current user
  const fetchCurrentUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.getCurrentUser();
      const profile = response.data.data || response.data.user || response.data;
      setUserProfile(profile);
      return { success: true, profile };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch current user';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (data: UpdateProfileRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.updateProfile(data);
      const profile = response.data.data || response.data.user || response.data;
      setUserProfile(profile);
      return { success: true, profile };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Follow user
  const followUser = async (userId: string) => {
    try {
      await userApi.followUser(userId);
      
      // Update local state
      if (userProfile && userProfile.id === userId) {
        setUserProfile({
          ...userProfile,
          followersCount: userProfile.followersCount + 1,
          isFollowing: true,
        });
      }
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to follow user';
      return { success: false, error: errorMessage };
    }
  };

  // Unfollow user
  const unfollowUser = async (userId: string) => {
    try {
      await userApi.unfollowUser(userId);
      
      // Update local state
      if (userProfile && userProfile.id === userId) {
        setUserProfile({
          ...userProfile,
          followersCount: userProfile.followersCount - 1,
          isFollowing: false,
        });
      }
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to unfollow user';
      return { success: false, error: errorMessage };
    }
  };

  // Get followers
  const fetchFollowers = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.getFollowers(userId);
      const followersList = response.data.data?.followers || response.data.followers || [];
      setFollowers(followersList);
      return { success: true, followers: followersList };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch followers';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Get following
  const fetchFollowing = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.getFollowing(userId);
      const followingList = response.data.data?.following || response.data.following || [];
      setFollowing(followingList);
      return { success: true, following: followingList };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch following';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Search users
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return { success: true, users: [] };
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.searchUsers(query);
      const users = response.data.data?.users || response.data.users || [];
      setSearchResults(users);
      return { success: true, users };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to search users';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    userProfile,
    followers,
    following,
    searchResults,
    isLoading,
    error,

    // Actions
    fetchUserProfile,
    fetchCurrentUser,
    updateProfile,
    followUser,
    unfollowUser,
    fetchFollowers,
    fetchFollowing,
    searchUsers,

    // Setters
    clearError: () => setError(null),
  };
};