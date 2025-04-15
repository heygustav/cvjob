import DOMPurify from 'dompurify';

/**
 * Sanitizes a string input to prevent XSS attacks
 * @param input The input string to sanitize
 * @returns The sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input);
};

/**
 * Sanitizes an object's string properties recursively
 * @param obj The object to sanitize
 * @returns A new object with sanitized string properties
 */
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = { ...obj } as T;
  
  Object.keys(result).forEach(key => {
    const value = result[key as keyof T];
    
    if (typeof value === 'string') {
      result[key as keyof T] = sanitizeInput(value) as any;
    } else if (typeof value === 'object' && value !== null) {
      result[key as keyof T] = sanitizeObject(value) as any;
    }
  });
  
  return result;
};

/**
 * Validates an email address
 * @param email The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if a password meets security requirements
 * @param password The password to check
 * @returns True if the password meets requirements, false otherwise
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, containing uppercase, lowercase, number and special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates and sanitizes a URL to prevent open redirect vulnerabilities
 * @param url The URL to validate and sanitize
 * @param allowExternal Whether to allow external URLs
 * @returns The sanitized URL if valid, null otherwise
 */
export const validateAndSanitizeUrl = (url: string | null, allowExternal = false): string | null => {
  if (!url) return null;
  
  // Sanitize the URL to prevent XSS
  const sanitizedUrl = DOMPurify.sanitize(url);
  
  if (!allowExternal) {
    // Only accept internal URLs (starting with / and not containing ://)
    if (sanitizedUrl.startsWith('/') && !sanitizedUrl.includes('://')) {
      return sanitizedUrl;
    }
    return null;
  }
  
  try {
    // For external URLs, validate with URL constructor
    new URL(sanitizedUrl);
    return sanitizedUrl;
  } catch (e) {
    return null;
  }
};
