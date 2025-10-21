import PostModel from '../models/Post';
import UserModel from '../models/User';
import { CreatePostDTO, UpdatePostDTO, PostResponseDTO } from '../types/post.dto';

export class PostServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'PostServiceError';
  }
}

export class PostService {

  private async toPostResponse(post: any, currentUserId?: string): Promise<PostResponseDTO> {
    const author = await UserModel.findById(post.author);

    return {
      id: post._id.toString(),
      author: {
        id: author!._id.toString(),
        username: author!.username,
        fullName: author!.fullName,
        profilePicture: author!.profilePicture
      },
      caption: post.caption,
      imageUrls: post.imageUrls,
      workoutRef: post.workoutRef?.toString(),
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      isLikedByUser: currentUserId ? post.likes.includes(currentUserId) : false,
      tags: post.tags,
      visibility: post.visibility,
      location: post.location,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    };
  }

  async createPost(userId: string, data: CreatePostDTO): Promise<PostResponseDTO> {
    const post = await PostModel.create({
      author: userId,
      caption: data.caption,
      imageUrls: data.imageUrls || [],
      workoutRef: data.workoutRef,
      tags: data.tags,
      visibility: data.visibility || 'public',
      location: data.location
    });

    return this.toPostResponse(post, userId);
  }

  async getPostById(postId: string, currentUserId?: string): Promise<PostResponseDTO> {
    const post = await PostModel.findById(postId);

    if (!post || !post.isVisible) {
      throw new PostServiceError('Post not found', 404);
    }

    return this.toPostResponse(post, currentUserId);
  }

  async getFeed(userId: string, page: number = 1, limit: number = 20): Promise<PostResponseDTO[]> {
    const user = await UserModel.findById(userId);
    if (!user) throw new PostServiceError('User not found', 404);

    const followingIds = user.following;

    const posts = await PostModel.find({
      $or: [
        { author: userId },
        { author: { $in: followingIds }, visibility: { $in: ['public', 'followers'] } },
        { visibility: 'public' }
      ],
      isVisible: true
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return Promise.all(posts.map(post => this.toPostResponse(post, userId)));
  }

  async getUserPosts(targetUserId: string, currentUserId?: string): Promise<PostResponseDTO[]> {
    const query: any = { author: targetUserId, isVisible: true };

    if (currentUserId !== targetUserId) {
      query.visibility = { $in: ['public', 'followers'] };
    }

    const posts = await PostModel.find(query).sort({ createdAt: -1 });
    return Promise.all(posts.map(post => this.toPostResponse(post, currentUserId)));
  }

  async updatePost(postId: string, userId: string, data: UpdatePostDTO): Promise<PostResponseDTO> {
    const post = await PostModel.findOne({ _id: postId, author: userId });

    if (!post) {
      throw new PostServiceError('Post not found', 404);
    }

    Object.assign(post, data);
    await post.save();

    return this.toPostResponse(post, userId);
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    const post = await PostModel.findOneAndDelete({ _id: postId, author: userId });

    if (!post) {
      throw new PostServiceError('Post not found', 404);
    }
  }

  async likePost(postId: string, userId: string): Promise<PostResponseDTO> {
    const post = await PostModel.findById(postId);

    if (!post) {
      throw new PostServiceError('Post not found', 404);
    }

    if (post.likes.includes(userId as any)) {
      throw new PostServiceError('Post already liked', 400);
    }

    post.likes.push(userId as any);
    post.likesCount += 1;
    await post.save();

    return this.toPostResponse(post, userId);
  }

  async unlikePost(postId: string, userId: string): Promise<PostResponseDTO> {
    const post = await PostModel.findById(postId);

    if (!post) {
      throw new PostServiceError('Post not found', 404);
    }

    const index = post.likes.indexOf(userId as any);
    if (index === -1) {
      throw new PostServiceError('Post not liked yet', 400);
    }

    post.likes.splice(index, 1);
    post.likesCount -= 1;
    await post.save();

    return this.toPostResponse(post, userId);
  }
}

export default new PostService();
