// frontend/src/components/Feed/PostCard.tsx

import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { useFeed } from '../../composables/useFeed';
import { useAuth } from '../../composables/useAuth';
import type { Post } from '../../api/feed.api';
import CommentSection from './commentSection';
import { useUser } from '../../composables/useUser';
import {  useNavigate } from 'react-router-dom';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  //const navigate = useNavigate();
  const { user } = useAuth();
  const { deletePost, likePost, unlikePost } = useFeed();
  const {userProfile, followUser} = useUser(); 
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLikedByUser);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const navigate = useNavigate();
  const handleLike = async () => {
    if (isLiked) {
      const result = await unlikePost(post.id);
      if (result.success) {
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      }
    } else {
      const result = await likePost(post.id);
      if (result.success) {
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    const result = await deletePost(post.id);
    if (!result.success) {
      alert(result.error || 'Failed to delete post');
    }
  };

  const followingUser = async () =>{
    if(post.author.id == null) return;
    const result = await followUser(post.author.id);
    if (result.success){
      alert("Followed")
    }else{
      alert(result.error)
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return '🌍';
      case 'followers': return '👥';
      case 'private': return '🔒';
      default: return '🌍';
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          {post.author.profilePicture ? (
            <img
              src={post.author.profilePicture}
              alt={post.author.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
              {getUserInitials(post.author.fullName)}
            </div>
          )}
          
          {/* User Info */}
          <div>
          <button
  className="font-semibold text-gray-800 hover:text-blue-600 cursor-pointer"
  onClick={() =>navigate(`/profile/${post.author.id}`)} 
>
  {post.author.fullName}
</button>
            <p className="text-sm text-gray-500">@{post.author.username}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{formatTime(post.createdAt)}</span>
              <span>•</span>
              <span>{getVisibilityIcon(post.visibility)}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <span>📍 {post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Delete Button (if own post) */}
         {/*Follow Button*/}
       {/* Follow/Unfollow Button */}
{userProfile?.isFollowing ? (
  // Unfollow button (when already following)
  <button
    
    className="text-blue-600 hover:text-red-600 transition"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  </button>
) : (
  // Follow button (when not following)
  <button
    onClick={followingUser}
    className="text-gray-400 hover:text-blue-600 transition"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  </button>
)}
       
        {user?.id === post.author.id && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Post Caption */}
      {post.caption && (
        <div className="px-4 pb-3">
          <p className="text-gray-800 whitespace-pre-line">{post.caption}</p>
        </div>
      )}

      {/* Post Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Images */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="w-full">
          {post.imageUrls.length === 1 ? (
            <img
              src={post.imageUrls[0]}
              alt="Post"
              className="w-full max-h-[600px] object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
              }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {post.imageUrls.slice(0, 4).map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Post ${index + 1}`}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                    }}
                  />
                  {index === 3 && post.imageUrls!.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold">
                      +{post.imageUrls!.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 space-y-3">
        {/* Like and Comment Counts */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
          <span>{post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2 border-t">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition ${
              isLiked
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isLiked ? 'Liked' : 'Like'}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comment
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
};

export default PostCard;