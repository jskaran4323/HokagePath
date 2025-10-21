export interface RegisterDTO {
    username: string;      // What user sends
    email: string;
    password: string;
    fullName: string;
  }
  
  // DTO for user login input
  export interface LoginDTO {
    email: string;
    password: string;
  }
  
  // DTO for what we send back (response)

  export interface UserResponseDTO {
    id: string;
    username: string;
    email: string;
    fullName: string;
    profilePicture?: string;
    bio?: string;
  }
  
  // DTO for authentication response
  export interface AuthResponseDTO {
    user: UserResponseDTO;
    token: string;
  }