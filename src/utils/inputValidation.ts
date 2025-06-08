
// Enhanced input validation utilities for security
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const sanitizeHtml = (input: string): string => {
  // Remove potentially dangerous HTML tags and attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
};

export const validateTextLength = (text: string, maxLength: number): boolean => {
  return text.trim().length > 0 && text.length <= maxLength;
};

export const validateProfileData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (data.first_name && !validateTextLength(data.first_name, 50)) {
    errors.push('First name must be 1-50 characters');
  }
  
  if (data.last_name && !validateTextLength(data.last_name, 50)) {
    errors.push('Last name must be 1-50 characters');
  }
  
  if (data.bio && !validateTextLength(data.bio, 1000)) {
    errors.push('Bio must be 1-1000 characters');
  }
  
  if (data.phone && !validatePhoneNumber(data.phone)) {
    errors.push('Invalid phone number format');
  }
  
  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
