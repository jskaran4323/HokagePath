// frontend/src/components/Feed/CommentSection.tsx

import { useEffect, useState } from 'react';
import { useComments } from '../../composables/useComments';
import { useAuth } from '../../composables/useAuth';
import type { Comment } from '../../api/feed.api';

interface CommentSectionProps {
  postId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const { user } = useAuth();
  const { comments, isLoading, fetchComments, createComment, deleteComment } = useComments(postId);
  
  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId, fetchComments]);

  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
     
    if (!commentText.trim()) return;
  
    const result = await createComment({
      text: commentText,
      parentCommentId: replyToId || undefined,
    });

    if (result.success) {
      setCommentText('');
      setReplyToId(null);
    } else {
      alert(result.error || 'Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    
    const result = await deleteComment(commentId);
    if (!result.success) {
      alert(result.error || 'Failed to delete comment');
    }
  };

  const getUserInitials = (name?: string) => {
    if (!name || !name.trim()) return '??'; 
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  

  const formatTime = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return commentDate.toLocaleDateString();
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-12 mt-2' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        {comment.author.profilePicture ? (
          <img
            src={comment.author.profilePicture}
            alt={comment.author.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            {getUserInitials(comment.author.name)}
          </div>
        )}

        {/* Comment Content */}
        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl px-4 py-2">
            <h4 className="font-semibold text-sm text-gray-800">{comment.author.name}</h4>
            <p className="text-gray-700 text-sm">{comment.text}</p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 mt-1 px-4">
            <span className="text-xs text-gray-500">{formatTime(comment.createdAt)}</span>
            <button
              onClick={() => setReplyToId(comment.id)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Reply
            </button>
            {user?.id === comment.author.id && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="border-t px-4 py-4 space-y-4">
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <div className="flex-1">
          {replyToId && (
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              <span>Replying to comment</span>
              <button
                type="button"
                onClick={() => setReplyToId(null)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={replyToId ? "Write a reply..." : "Write a comment..."}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={!commentText.trim() || isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          Post
        </button>
      </form>

      {/* Comments List */}
      {isLoading && comments.length === 0 ? (
        <div className="text-center py-4 text-gray-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;