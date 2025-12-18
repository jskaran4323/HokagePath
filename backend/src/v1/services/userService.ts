import bcrypt from 'bcryptjs';
import UserModel, { User } from '../../models/User';

import { UpdateUserProfileDto, ChangePasswordDto, UserPublicProfileDto } from '../../types/user.dto';
import workoutService from './workoutService';

export class UserServiceError extends Error{
    constructor(
        message: string,
        public statusCode: number = 400
    ){
      super(message)
      this.name = "UserServiceError"
    }
}

export class UserService{
    async updateProfile(userId: string, data: UpdateUserProfileDto): Promise<any>{
        const user = await UserModel.findById(userId);
        if(!user){
            throw new UserServiceError('user not found', 404);
        }

        if(data.fullName) user.fullName = data.fullName;
        if(data.profilePicture) user.profilePicture = data.profilePicture;
        //Profile pictures will be saved in AWS s3 cloud

        if (data.bio !== undefined) user.bio = data.bio;

        await user.save();

        return {
            id: user._id.toString(),
            username: user.username,
            fullname: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio
        };
    }

    async changeUserPassword(userId: string, data: ChangePasswordDto): Promise<any>{
        const user = await UserModel.findById(userId).select("+password");
        if(!user){
            throw new UserServiceError("User not Found", 404);
        }
        const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
        if(!isPasswordValid){
            throw new UserServiceError("current password is invalid",401);
        } 
        user.password = data.newPassword
        await user.save();
    }

    async getUserPublicProfile(userId: string, currentUserId?: string): Promise<UserPublicProfileDto>{
        const user = await UserModel.findById(userId);
        
        
        if(!user){
            throw new UserServiceError("User not Found", 404);
        }
        const workoutStats = await workoutService.getWorkoutStats(userId);

        let isFollowing = false;
        if (currentUserId && currentUserId !== userId){
            const currentUser = await UserModel.findById(currentUserId);
            isFollowing = currentUser?.following.includes(userId as any) || false;
        }
          

        return {
            id: user._id.toString(),
            username: user.username,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followersCount: user.followers.length ,
            followingCount: user.following.length ,
            totalWorkouts: workoutStats?.totalWorkouts || 0,
            currentStreak: workoutStats?.currentStreak || 0,
            isFollowing
        }
    }

    async followUser(userId: string, targetUserId: string): Promise<void>{
    if(userId === targetUserId){
     throw new UserServiceError("Cannot follow yourself", 400);
    }
    const[user, targetUser] = await Promise.all([
       UserModel.findById(userId),
       UserModel.findById(targetUserId)
    ])
    if (!targetUser || !user){
        throw new UserServiceError("User not Found", 404);
    }
    if (user.following.includes(targetUserId as any)){
        throw new UserServiceError("Already Following this user", 400);
    }
    user.following.push(targetUserId as any)
    targetUser.followers.push(userId as any)
    
    await Promise.all([user.save(), targetUser.save()]);


    }
    async unfollowUser(userId: string, targetUserId: string): Promise<void> {
        if (userId === targetUserId) {
          throw new UserServiceError('Cannot unfollow yourself', 400);
        }
    
        const [user, targetUser] = await Promise.all([
          UserModel.findById(userId),
          UserModel.findById(targetUserId)
        ]);
    
        if (!user || !targetUser) {
          throw new UserServiceError('User not found', 404);
        }
    
        const followingIndex = user.following.indexOf(targetUserId as any);
        const followerIndex = targetUser.followers.indexOf(userId as any);
    
        if (followingIndex === -1) {
          throw new UserServiceError('Not following this user', 400);
        }
    
        user.following.splice(followingIndex, 1);
        targetUser.followers.splice(followerIndex, 1);
    
        await Promise.all([user.save(), targetUser.save()]);
      }
    
      async getFollowers(userId: string): Promise<any[]> {
        const user = await UserModel.findById(userId).populate('followers', 'username fullName profilePicture');
    
        if (!user) {
          throw new UserServiceError('User not found', 404);
        }
    
        return user.followers.map((follower: any) => ({
          id: follower._id.toString(),
          username: follower.username,
          fullName: follower.fullName,
          profilePicture: follower.profilePicture
        }));
      }
    
      async getFollowing(userId: string): Promise<any[]> {
        const user = await UserModel.findById(userId).populate('following', 'username fullName profilePicture');
    
        if (!user) {
          throw new UserServiceError('User not found', 404);
        }
    
        return user.following.map((following: any) => ({
          id: following._id.toString(),
          username: following.username,
          fullName: following.fullName,
          profilePicture: following.profilePicture
        }));
      }
    
      async searchUsers(query: string, currentUserId?: string): Promise<any[]>{
        const users = await UserModel.find({
            $or: [
                {username: {$regex: query, $options: 'i'}},
                {fullname: {$regex: query, $options: 'i'}}
            ]
        }).limit(20)
        
        
        return users.map(user => ({
            id: user._id.toString(),
            username: user.username,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            bio: user.bio
          }));
    }
}
export default new UserService();