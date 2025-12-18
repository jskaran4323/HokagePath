/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/composables/useUser.ts

import { useState } from 'react';
import { userApi, type UserProfile, type UpdateProfileRequest, type audience } from '../api/user.api';


export const useUser = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [followers, setFollowers] = useState<audience[]>([]);
  const [followings, setFollowings] = useState<audience[]>([]);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  const fetchUserProfile = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.getUserProfile(userId);
   
      
    
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

  const unfollowUser = async (userId: string) => {
    try {
      await userApi.unfollowUser(userId);
      
    
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

  
  const fetchFollowers = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.getFollowers(userId);
      
      const followersList = response.data.data
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

  
  const fetchFollowing = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.getFollowing(userId);
      const followingList = response.data.data
      setFollowings(followingList);
      return { success: true, following: followingList };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch following';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

 
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return { success: true, users: [] };
    }
  
     
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.searchUsers(query);
      const users = response.data.data;
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

  const uploadProfilePicture  = async (file: File) =>{
    const formData = new FormData();
    formData.append('profilePicture', file);

    setIsLoading(true);
    setError(null);
    try {
       await userApi.uploadProfileImage(formData);
     
      
      return {success: true};
    } catch (err: any) {
      const errorMessage = err.response?.data?.message  || "Failed to upload"
      setError(errorMessage)
      return { success: false, error: errorMessage };
    }finally {
      setIsLoading(false);
    }
  }

  return {
    userProfile,
    followers,
    followings,
    searchResults,
    isLoading,
    error,

    
    fetchUserProfile,
    fetchCurrentUser,
    updateProfile,
    followUser,
    unfollowUser,
    fetchFollowers,
    fetchFollowing,
    searchUsers,
    uploadProfilePicture,

    clearError: () => setError(null),
  };
};