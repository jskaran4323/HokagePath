import { UpdateUserProfileDto, ChangePasswordDto } from "../types/user.dto";

export const validateUpdateProfile = (data:UpdateUserProfileDto): string[]=>{
const errors: string[]=[];
 
if(data.fullName!== undefined && data.fullName.trim().length<2){
    errors.push("Full Name must be atleast 2 characters")
}
if(data.bio!== undefined && data.bio.length >500){
    errors.push('Bio cant exceed 500 characters');
}
return errors;
}

export const validateChangePassword = (data: ChangePasswordDto): string[]=>{
    const errors: string[] = [];
    if(!data.currentPassword){
        errors.push("Current Password is required")
    }
    if(!data.newPassword){
        errors.push("New password is required")
    }else if(data.newPassword.length<6){
        errors.push("Password must be atleast 6 character")
    }

    if(data.currentPassword === data.newPassword){
        errors.push("New password must be different from current password")
    }
 return errors
}