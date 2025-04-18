
import DOMPurify from 'dompurify';

/**
 * Sanitizes a string input to prevent XSS attacks
 * @param input The input string to sanitize
 * @returns The sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Configure DOMPurify to be extra strict
  const purifyConfig = {
    ALLOWED_TAGS: [], // Only allow text content, no HTML tags
    ALLOWED_ATTR: [], // No attributes allowed
    USE_PROFILES: { html: false } // Don't use the html profile
  };
  
  return DOMPurify.sanitize(input, purifyConfig);
};

/**
 * Sanitizes HTML content with a more permissive configuration
 * Useful for rich text content that needs some formatting
 */
export const sanitizeHtml = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Allow basic formatting tags but no scripts or dangerous elements
  const purifyConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4'],
    ALLOWED_ATTR: [], // No attributes allowed
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'javascript:'],
    USE_PROFILES: { html: true }
  };
  
  return DOMPurify.sanitize(input, purifyConfig);
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
  
  // Make sure javascript: URLs are caught even if DOMPurify misses them
  if (sanitizedUrl.toLowerCase().includes('javascript:')) {
    return null;
  }
  
  if (!allowExternal) {
    // Only accept internal URLs (starting with / and not containing ://)
    if (sanitizedUrl.startsWith('/') && !sanitizedUrl.includes('://')) {
      return sanitizedUrl;
    }
    return null;
  }
  
  try {
    // For external URLs, validate with URL constructor
    const parsedUrl = new URL(sanitizedUrl);
    
    // Only allow http and https protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return null;
    }
    
    return sanitizedUrl;
  } catch (e) {
    return null;
  }
};

/**
 * File extension whitelist validation
 * @param filename The filename to validate
 * @param allowedExtensions Array of allowed extensions
 * @returns True if extension is allowed, false otherwise
 */
export const hasAllowedExtension = (
  filename: string, 
  allowedExtensions: string[]
): boolean => {
  if (!filename) return false;
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
};

/**
 * Content-Type header validation
 * @param contentType The Content-Type header value
 * @param allowedTypes Array of allowed MIME types
 * @returns True if content type is allowed, false otherwise
 */
export const hasAllowedContentType = (
  contentType: string | null,
  allowedTypes: string[]
): boolean => {
  if (!contentType) return false;
  return allowedTypes.some(type => contentType.includes(type));
};
