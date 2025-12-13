/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../composables/useAuth';
import { useUser } from '../../composables/useUser';
import { useFeed } from '../../composables/useFeed';
import PostCard from '../feed/postCard';
import EditProfileModal from './EditProfileModel';

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { userProfile, followers, followings, isLoading: userLoading, fetchUserProfile, fetchFollowers,fetchFollowing, followUser, unfollowUser} = useUser();
  const { posts, isLoading: postsLoading, fetchUserPosts } = useFeed();

  const [activeTab, setActiveTab] = useState<'posts' | 'followers' | 'following'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?.id === userId;

  
  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
      fetchUserPosts(userId);
      fetchFollowers(userId);
      fetchFollowing(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (userProfile) {
      setIsFollowing(userProfile.isFollowing);
    }
  }, [userProfile]);

  const handleFollow = async () => {
    if (!userId) return;
    
    if (isFollowing) {
      const result = await unfollowUser(userId);
      if (result.success) setIsFollowing(false);
    } else {
      const result = await followUser(userId);
      if (result.success) setIsFollowing(true);
    }
  };

  

  const getUserInitials = (name: string) =>
    name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  if (userLoading && !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">User not found</p>
          <button
            onClick={() => navigate('/feed')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20">
         
           
    
            <div className="relative">
            
     
              {userProfile.profilePicture ? (
                
                
                <img
                  src={userProfile.profilePicture}
                  alt={userProfile.fullName}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                />
                
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {getUserInitials(userProfile.fullName)}
                </div>
              )}
             
            </div>

            {/* User Details */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{userProfile.fullName}</h1>
              <p className="text-gray-600">@{userProfile.username}</p>

              {userProfile.bio && <p className="text-gray-700 mt-3">{userProfile.bio}</p>}

              <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-sm text-gray-600">
                {userProfile.location && (
                  <span className="flex items-center gap-1">📍 {userProfile.location}</span>
                )}
                {userProfile.website && (
                  <a
                    href={userProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    🔗 Website
                  </a>
                )}
                <span className="flex items-center gap-1">
                  🔥 {userProfile.currentStreak} day streak
                </span>
              </div>
            </div>
            <button
            onClick={()=> navigate('/fitness-profile')}
                  
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Fitness Profile
                </button>
            {/* Action Buttons */}
            <div className="flex gap-3">
              {isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Edit Profile
                </button>
                
              ) : (
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-8 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{userProfile.totalWorkouts}</p>
              <p className="text-sm text-gray-600">Workouts</p>
            </div>
            <div className="text-center cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-lg transition">
              <p className="text-2xl font-bold text-gray-800">{userProfile.followersCount}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="text-center cursor-pointer hover:bg-gray-50 px-4 py-2 rounded-lg transition">
              <p className="text-2xl font-bold text-gray-800">{userProfile.followingCount}</p>
              <p className="text-sm text-gray-600">Following</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{userProfile.currentStreak}🔥</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="flex border-b">
          {['posts', 'followers', 'following'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'posts' && (
            <div>
              {postsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : !Array.isArray(posts) || posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-600">
                    {isOwnProfile ? "You haven't posted anything yet" : 'No posts yet'}
                  </p>
                  {isOwnProfile && (
                    <button
                      onClick={() => navigate('/feed')}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Create Your First Post
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}

{activeTab === 'followers' && (
  <div className="space-y-3 p-4">
    {followers.length > 0 ? (
      followers.map((follower) => (
        <div
          key={follower.id}
          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* Profile Picture */}
            <img
              src={follower.profilePicture}
              alt={follower.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            
            {/* User Info */}
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                {follower.fullName}
              </span>
              <span className="text-sm text-gray-500">
                @{follower.username}
              </span>
            </div>
          </div>
          
          {/* Optional: Action Button */}
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
           onClick={() =>navigate(`/profile/${follower.id}`)} 
          >
            View Profile
          </button>
        </div>
      ))
    ) : (
      <div className="text-center py-12">
        <p className="text-gray-600">No followers yet</p>
      </div>
    )}
  </div>
)}
          {activeTab === 'following' && (
            // <div className="text-center py-12">
            //   <p className="text-gray-600">{following.map((x)=> x.username)}</p>
            // </div>
            <div className="space-y-3 p-4">
            {followings.length > 0 ? (
              followings.map((following ) => (
                <div
                  key={following.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Profile Picture */}
                    <img
                      src={following.profilePicture}
                      alt={following.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    
                    {/* User Info */}
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {following.fullName}
                      </span>
                      <span className="text-sm text-gray-500">
                        @{following.username}
                      </span>
                    </div>
                  </div>
                  
                  {/* Optional: Action Button */}
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  onClick={() =>navigate(`/profile/${following.id}`)} 
                  >
                    View Profile
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No followers yet</p>
              </div>
            )}
          </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentProfile={userProfile}
          onSuccess={() => {
            setShowEditModal(false);
            if (userId) fetchUserProfile(userId);
          }}
        />
      )}
    </div>
  );
};

export default UserProfilePage;
