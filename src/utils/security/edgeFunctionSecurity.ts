
import DOMPurify from 'dompurify';

/**
 * Sanitize edge function input to prevent injections
 * @param payload The payload to be sent to an edge function
 * @returns Sanitized payload safe for processing
 */
export const sanitizeEdgeFunctionPayload = <T extends Record<string, any>>(payload: T): T => {
  if (!payload || typeof payload !== 'object') {
    return {} as T;
  }
  
  const sanitizedPayload = { ...payload };
  
  // Recursively sanitize string values
  Object.entries(sanitizedPayload).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Sanitize all string inputs to prevent XSS/command injection
      sanitizedPayload[key] = DOMPurify.sanitize(value, {
        ALLOWED_TAGS: [], // Don't allow any HTML tags
        ALLOWED_ATTR: []  // Don't allow any HTML attributes
      });
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively sanitize nested objects
      sanitizedPayload[key] = sanitizeEdgeFunctionPayload(value);
    } else if (Array.isArray(value)) {
      // Sanitize arrays of strings or objects
      sanitizedPayload[key] = value.map(item => {
        if (typeof item === 'string') {
          return DOMPurify.sanitize(item, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
          });
        } else if (item && typeof item === 'object') {
          return sanitizeEdgeFunctionPayload(item);
        }
        return item;
      });
    }
  });
  
  return sanitizedPayload as T;
};

/**
 * Validates edge function response for security issues
 * @param response The response from an edge function
 * @returns Validated response or throws error if insecure
 */
export const validateEdgeFunctionResponse = <T>(response: T): T => {
  // If this is a string, sanitize it
  if (typeof response === 'string') {
    return DOMPurify.sanitize(response, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: []
    }) as unknown as T;
  }
  
  // If this is an object, recursively sanitize its string properties
  if (response && typeof response === 'object') {
    const sanitizedResponse = { ...response as object };
    
    Object.entries(sanitizedResponse).forEach(([key, value]) => {
      if (typeof value === 'string') {
        sanitizedResponse[key] = DOMPurify.sanitize(value, {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
          ALLOWED_ATTR: []
        });
      } else if (value && typeof value === 'object') {
        sanitizedResponse[key] = validateEdgeFunctionResponse(value);
      }
    });
    
    return sanitizedResponse as T;
  }
  
  // For other types, return as is
  return response;
};

/**
 * Gets limited information about errors to avoid leaking
 * sensitive information in error messages
 * @param error The error object
 * @returns Safe error message
 */
export const getSafeErrorMessage = (error: unknown): string => {
  if (!error) return 'Unknown error occurred';
  
  if (error instanceof Error) {
    // Filter out any sensitive information that might be in the error
    const safeMessage = error.message
      .replace(/key/gi, 'credential')
      .replace(/password/gi, '********')
      .replace(/token/gi, '********')
      .replace(/secret/gi, '********')
      .replace(/api/gi, 'service');
    
    return DOMPurify.sanitize(safeMessage);
  }
  
  if (typeof error === 'string') {
    return DOMPurify.sanitize(error);
  }
  
  return 'An error occurred';
};
