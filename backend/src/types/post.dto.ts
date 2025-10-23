export interface CreatePostDTO {
    caption: string;
    imageUrls?: string[];
    workoutRef?: string;
    tags?: string[];
    visibility?: 'public' | 'followers' | 'private';
    location?: string;
  }
  
  export interface UpdatePostDTO {
    caption?: string;
    imageUrls?: string[];
    tags?: string[];
    visibility?: 'public' | 'followers' | 'private';
    location?: string;
    isVisible?: boolean;
  }
  
  export interface PostResponseDTO {
    id: string;
    author: {
      id: string;
      username: string;
      fullName: string;
      profilePicture?: string;
    };
    caption: string;
    imageUrls: string[];
    workoutRef?: string;
    likesCount: number;
    commentsCount: number;
    isLikedByUser: boolean;
    tags?: string[];
    visibility: string;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  