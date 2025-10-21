import { LoginDTO, RegisterDTO } from "../types/auth.dto";

export class ValidationError extends Error {
    constructor(public errors: string[]) {
      super('Validation failed');
      this.name = 'ValidationError';
    }
  }
  
  export const validateRegisterInput = (data: RegisterDTO): string[] => {
    const errors: string[] = [];
  
    // Username validation
    if (!data.username || data.username.trim().length === 0) {
      errors.push('Username is required');
    } else if (data.username.length < 3) {
      errors.push('Username must be at least 3 characters');
    } else if (data.username.length > 30) {
      errors.push('Username cannot exceed 30 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }
  
    // Email validation
    if (!data.email || data.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.push('Invalid email format');
    }
  
    // Password validation
    if (!data.password || data.password.length === 0) {
      errors.push('Password is required');
    } else if (data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
  
    // Full name validation
    if (!data.fullName || data.fullName.trim().length === 0) {
      errors.push('Full name is required');
    } else if (data.fullName.length < 2) {
      errors.push('Full name must be at least 2 characters');
    }
  
    return errors;
  };
  
  export const validateLoginInput = (data: LoginDTO): string[] => {
    const errors: string[] = [];
  
    if (!data.email || data.email.trim().length === 0) {
      errors.push('Email is required');
    }
  
    if (!data.password || data.password.length === 0) {
      errors.push('Password is required');
    }
  
    return errors;
  };
  
  