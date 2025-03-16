
import DOMPurify from 'dompurify';

/**
 * Sanitizes and validates a URL to prevent open redirect vulnerabilities
 * @param url The URL to sanitize and validate
 * @returns The sanitized URL if valid, null otherwise
 */
export const sanitizeRedirectUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  // Sanitize the URL to prevent XSS
  const sanitizedUrl = DOMPurify.sanitize(url);
  
  // Only accept internal URLs (starting with / and not containing ://)
  if (sanitizedUrl.startsWith('/') && !sanitizedUrl.includes('://')) {
    return sanitizedUrl;
  }
  
  console.error("Invalid redirect URL detected and blocked:", url);
  return null;
};
