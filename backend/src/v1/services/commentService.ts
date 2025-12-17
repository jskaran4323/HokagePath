import CommentModel from '../../models/Comment';
import PostModel from '../../models/Post';
import UserModel from '../../models/User';
import { CreateCommentDTO, UpdateCommentDTO, CommentResponseDTO } from '../../types/comment.dto';

export class CommentServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'CommentServiceError';
  }
}

export class CommentService {

  private async toCommentResponse(comment: any, currentUserId?: string): Promise<CommentResponseDTO> {
    const author = await UserModel.findById(comment.author);

    return {
      id: comment._id.toString(),
      postId: comment.postId.toString(),
      author: {
        id: author!._id.toString(),
        username: author!.username,
        fullName: author!.fullName,
        profilePicture: author!.profilePicture
      },
      text: comment.text,
      parentComment: comment.parentComment?.toString(),
      likesCount: comment.likesCount,
      repliesCount: comment.repliesCount,
      isLikedByUser: currentUserId ? comment.likes.includes(currentUserId) : false,
      isEdited: comment.isEdited,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    };
  }

  async createComment(postId: string, userId: string, data: CreateCommentDTO): Promise<CommentResponseDTO> {
    const post = await PostModel.findById(postId);
    if (!post) {
      throw new CommentServiceError('Post not found', 404);
    }

    if (data.parentComment) {
      const parentComment = await CommentModel.findById(data.parentComment);
      if (!parentComment) {
        throw new CommentServiceError('Parent comment not found', 404);
      }
      parentComment.repliesCount += 1;
      await parentComment.save();
    }

    const comment = await CommentModel.create({
      postId,
      author: userId,
      text: data.text,
      parentComment: data.parentComment
    });

    post.commentsCount += 1;
    await post.save();

    return this.toCommentResponse(comment, userId);
  }

  async getPostComments(postId: string, currentUserId?: string): Promise<CommentResponseDTO[]> {
    const comments = await CommentModel.find({
      postId,
      isVisible: true,
      parentComment: null
    }).sort({ createdAt: -1 });

    return Promise.all(comments.map(c => this.toCommentResponse(c, currentUserId)));
  }

  async getCommentReplies(commentId: string, currentUserId?: string): Promise<CommentResponseDTO[]> {
    const replies = await CommentModel.find({
      parentComment: commentId,
      isVisible: true
    }).sort({ createdAt: 1 });

    return Promise.all(replies.map(r => this.toCommentResponse(r, currentUserId)));
  }

  async updateComment(commentId: string, userId: string, data: UpdateCommentDTO): Promise<CommentResponseDTO> {
    const comment = await CommentModel.findOne({ _id: commentId, author: userId });

    if (!comment) {
      throw new CommentServiceError('Comment not found', 404);
    }

    comment.text = data.text;
    comment.isEdited = true;
    await comment.save();

    return this.toCommentResponse(comment, userId);
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await CommentModel.findOneAndDelete({ _id: commentId, author: userId });

    if (!comment) {
      throw new CommentServiceError('Comment not found', 404);
    }

    const post = await PostModel.findById(comment.postId);
    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      await post.save();
    }

    if (comment.parentComment) {
      const parentComment = await CommentModel.findById(comment.parentComment);
      if (parentComment) {
        parentComment.repliesCount = Math.max(0, parentComment.repliesCount - 1);
        await parentComment.save();
      }
    }
  }

  async likeComment(commentId: string, userId: string): Promise<CommentResponseDTO> {
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      throw new CommentServiceError('Comment not found', 404);
    }

    if (comment.likes.includes(userId as any)) {
      throw new CommentServiceError('Comment already liked', 400);
    }

    comment.likes.push(userId as any);
    comment.likesCount += 1;
    await comment.save();

    return this.toCommentResponse(comment, userId);
  }

  async unlikeComment(commentId: string, userId: string): Promise<CommentResponseDTO> {
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      throw new CommentServiceError('Comment not found', 404);
    }

    const index = comment.likes.indexOf(userId as any);
    if (index === -1) {
      throw new CommentServiceError('Comment not liked yet', 400);
    }

    comment.likes.splice(index, 1);
    comment.likesCount -= 1;
    await comment.save();

    return this.toCommentResponse(comment, userId);
  }
}

export default new CommentService();