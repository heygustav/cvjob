/**
 * Security utilities for edge functions
 */

import DOMPurify from 'dompurify';

/**
 * Safely sanitizes input for edge functions to prevent XSS and injection attacks
 * By using a generic type, we maintain TypeScript support for the object structure
 * 
 * @param input Object to sanitize
 * @returns Sanitized object with the same structure
 */
export function sanitizeInput<T extends Record<string, any>>(input: T): T {
  if (!input || typeof input !== 'object') {
    return input;
  }

  const sanitized = {} as T;
  
  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      const value = input[key];
      
      if (typeof value === 'string') {
        // For strings, apply DOMPurify sanitization
        (sanitized as any)[key] = DOMPurify.sanitize(value);
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize nested objects
        (sanitized as any)[key] = sanitizeInput(value);
      } else {
        // For other types (numbers, booleans, etc.), keep as is
        (sanitized as any)[key] = value;
      }
    }
  }
  
  return sanitized;
}

/**
 * Creates a safe error response for edge functions
 * Prevents leaking sensitive information in error messages
 */
export function createSafeErrorResponse(error: unknown, statusCode = 400): Response {
  console.error('Edge function error:', error);
  
  // Create a sanitized error message
  const safeMessage = error instanceof Error 
    ? DOMPurify.sanitize(error.message) 
    : 'An unexpected error occurred';
  
  return new Response(
    JSON.stringify({
      error: safeMessage,
      status: 'error'
    }),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

/**
 * Validates response data from external services
 * Ensures data conforms to expected structure before processing
 */
export function validateResponseData<T>(
  data: unknown, 
  validator: (data: unknown) => boolean
): T | null {
  try {
    if (!data || !validator(data)) {
      return null;
    }
    return data as T;
  } catch (error) {
    console.error('Response validation error:', error);
    return null;
  }
}
