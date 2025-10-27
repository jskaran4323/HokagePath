// frontend/src/pages/Feed/FeedPage.tsx

import { useEffect, useState } from 'react';
import { useFeed } from '../../composables/useFeed';
import { useAuth } from '../../composables/useAuth';
import PostCard from './postCard';
import CreatePostModal from './createPostModel';

const FeedPage = () => {
  const { user } = useAuth();
  const { posts, isLoading, hasMore, fetchFeed, loadMore } = useFeed();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleRefresh = () => {
    fetchFeed(1, false);
  };

  const getUserInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                {getUserInitials(user?.fullName || '')}
              </div>
            )}

            {/* Create Post Input */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 px-6 py-3 bg-gray-100 rounded-full text-left text-gray-500 hover:bg-gray-200 transition"
            >
              What's on your mind, {user?.fullName?.split(' ')[0]}?
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 mt-4 pt-4 border-t">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 font-semibold"
            >
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Photo
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 font-semibold"
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              Tag
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 font-semibold"
            >
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </button>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            <svg 
              className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Refreshing...' : 'Refresh Feed'}
          </button>
        </div>

        {/* Posts Feed */}
{isLoading && posts.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
    <p className="text-gray-600">Loading your feed...</p>
  </div>
) : !Array.isArray(posts) || posts.length === 0 ? ( // Add Array.isArray check
  <div className="bg-white rounded-xl shadow-md p-12 text-center">
    <div className="text-6xl mb-4">📱</div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Posts Yet</h3>
    <p className="text-gray-600 mb-6">
      Be the first to share something with your community!
    </p>
    <button
      onClick={() => setShowCreateModal(true)}
      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-md"
    >
      Create Your First Post
    </button>
  </div>
) : (
  <div className="space-y-6">
    {posts.map(post => (
      <PostCard key={post.id} post={post} />
    ))}

    {/* Load More Button */}
    {hasMore && (
      <div className="flex justify-center py-6">
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="px-8 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50 font-semibold text-gray-700"
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    )}

    {!hasMore && posts.length > 0 && (
      <div className="text-center py-6 text-gray-500">
        You've reached the end! 🎉
      </div>
    )}
  </div>
)}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default FeedPage;