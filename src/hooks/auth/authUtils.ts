
import { validateAndSanitizeUrl } from '@/utils/security';

/**
 * Sanitizes and validates a URL to prevent open redirect vulnerabilities
 * @param url The URL to sanitize and validate
 * @returns The sanitized URL if valid, null otherwise
 */
export const sanitizeRedirectUrl = (url: string | null): string | null => {
  return validateAndSanitizeUrl(url, false);
};
