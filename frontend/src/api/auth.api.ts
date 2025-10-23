import apiClient from "./client";

import type { AuthResponse, UserProfileResponse } from "../types/auth.types";

export const authApi = {
    register: (data: {
        username: string;
        email: string;
        password: string;
        fullName: string;
    }) =>{
        return apiClient.post<AuthResponse>("/auth/register", data)
    },

    login: (data:{
        email:string, password: string
    })=>{
        return apiClient.post<AuthResponse>("/auth/login", data);
    },
    
    logout: ()=>{
     return apiClient.post('/auth/logout');
    },

    getMe: () => {
        return apiClient.get<UserProfileResponse>('/auth/me'); 
    }


}