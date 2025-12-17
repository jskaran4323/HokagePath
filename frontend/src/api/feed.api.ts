import apiClient from "./client";

export interface Post{
    id: string
    author: {
        id: string;
        fullName: string;
        username: string;
        
        profilePicture?: string;
      };
      caption?: string;
      imageUrls?: string[];
      tags: string[];
      location?: string;
      visibility: 'public' | 'followers' | 'private';
      isLikedByUser: boolean;
      likesCount: number;
      commentsCount: number;
      createdAt: string;
      updatedAt: string;
    }
    
    export interface Comment {
      id: string;
      postId: string;
      author: {
        id: string;
        name: string;
        email: string;
        profilePicture?: string;
      };
      text: string;
      parentCommentId?: string;
      replies?: Comment[];
      createdAt: string;
      updatedAt: string;
    }

    export interface CreatePostRequest {
        caption: string;
        imageUrls: string[];
        tags: string[];
        location: string;
        visibility: 'public' | 'followers' | 'private';
      }
      
      export interface CreateCommentRequest {
        text: string;
        parentCommentId?: string;
      }


   export const feedApi = {
       getFeed: (page: number =1 , limit: number = 10) =>
        apiClient.get(`/posts/feed?page=${page}&limit=${limit}`),
       
       getUserPosts: (userId: string, page: number = 1, limit: number = 10) =>
        apiClient.get(`/posts/user/${userId}?page=${page}&limit=${limit}`),
    
       getPost: (postId: string) =>
         apiClient.get(`/posts/${postId}`),
    
       createPost: (data: CreatePostRequest | FormData) =>
        apiClient.post('/posts', data, 
          data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
        )
        ,
        
      deletePost: (postId: string) =>
        apiClient.delete(`/posts${postId}`),
    
      likePost: (postId: string) =>
        apiClient.post(`/posts/${postId}/like`),
    
      unlikePost: (postId: string) =>
        apiClient.delete(`/posts/${postId}/like`),
    
      // Comments
      getComments: (postId: string) =>
        apiClient.get(`comments/post/${postId}`),
    
      createComment: (postId: string, data: CreateCommentRequest) =>
        apiClient.post(`comments/post/${postId}`, data),
    
      deleteComment: (postId: string) =>
        apiClient.delete(`/comments/${postId}`),

      uploadPostImages: (file: FormData) =>{
        console.log(file);
        
        return apiClient.post(`upload/post-images`, file, {headers: {
          'Content-Type': 'multipart/form-data', 
        },})
      }
    
        
   }      