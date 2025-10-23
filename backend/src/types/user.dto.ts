export interface UpdateUserProfileDto{
    fullName?: string;
    bio?: string;
    profilePicture: string;
}

export interface ChangePasswordDto{
    currentPassword: string,
    newPassword: string
}

export interface UserPublicProfileDto{
    id: string,
    username: string,
    fullName : string,
    bio?: string,
    profilePicture: string,
    followersCount : number,
    followingCount: number,
    totalWorkouts: number,
    currentStreak:number,
    isFollowing?: boolean
}