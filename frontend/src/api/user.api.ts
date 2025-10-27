// frontend/src/api/user.api.ts

import apiClient from './client';

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  profilePicture: string;
  bio: string;
  location?: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  totalWorkouts: number;
  currentStreak: number;
  isFollowing: boolean;
  createdAt?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  location?: string;
  website?: string;
  profilePicture?: string;
}

export const userApi = {
  // Get user profile
  getUserProfile: (userId: string) =>
    apiClient.get(`/users/${userId}`),

  // Get current user profile
  getCurrentUser: () =>
    apiClient.get('/users/me'),

  // Update profile
  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.put('/users/me', data),

  // Follow user
  followUser: (userId: string) =>
    apiClient.post(`/users/${userId}/follow`),

  // Unfollow user
  unfollowUser: (userId: string) =>
    apiClient.delete(`/users/${userId}/follow`),

  // Get followers
  getFollowers: (userId: string) =>
    apiClient.get(`/users/${userId}/followers`),

  // Get following
  getFollowing: (userId: string) =>
    apiClient.get(`/users/${userId}/following`),

  // Search users
  searchUsers: (query: string) =>
    apiClient.get(`/users/search?q=${query}`),
};