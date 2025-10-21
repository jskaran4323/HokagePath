export interface CreateCommentDTO {
    text: string;
    parentComment?: string;
  }
  
  export interface UpdateCommentDTO {
    text: string;
  }
  
  export interface CommentResponseDTO {
    id: string;
    postId: string;
    author: {
      id: string;
      username: string;
      fullName: string;
      profilePicture?: string;
    };
    text: string;
    parentComment?: string;
    likesCount: number;
    repliesCount: number;
    isLikedByUser: boolean;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  