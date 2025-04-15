
import { toast } from "@/hooks/use-toast";

// Unified error types for consistent handling
export type ErrorPhase = 
  | 'user-fetch' 
  | 'job-save' 
  | 'generation' 
  | 'letter-save' 
  | 'network' 
  | 'timeout' 
  | 'auth' 
  | 'api-rate-limit' 
  | 'service-unavailable' 
  | 'auth-error'
  | 'cv-parsing';

export interface AppError extends Error {
  phase?: ErrorPhase;
  recoverable?: boolean;
  details?: any;
}

// Create a standardized error with additional metadata
export function createAppError(
  message: string, 
  phase: ErrorPhase, 
  recoverable = true, 
  details?: any
): AppError {
  const error = new Error(message) as AppError;
  error.phase = phase;
  error.recoverable = recoverable;
  error.details = details;
  return error;
}

// Check if error is a network error
export function isNetworkError(error: unknown): boolean {
  if (!navigator.onLine) return true;
  
  return error instanceof Error && (
    error.message.includes('network') || 
    error.message.includes('connection') ||
    error.message.includes('forbindelse') || 
    error.message.includes('netværk') ||
    error.message.toLowerCase().includes('offline')
  );
}

// Check if error is a timeout error
export function isTimeoutError(error: unknown): boolean {
  return error instanceof Error && (
    error.message.includes('timeout') || 
    error.message.includes('timed out')
  );
}

// Get error phase with fallback detection
export function getErrorPhase(error: unknown): ErrorPhase {
  if (error && typeof error === 'object' && 'phase' in error && error.phase) {
    return error.phase as ErrorPhase;
  }
  
  // Try to detect error type
  if (isNetworkError(error)) return 'network';
  if (isTimeoutError(error)) return 'timeout';
  
  if (error instanceof Error) {
    if (error.message.includes('401') || error.message.includes('auth') || 
        error.message.includes('unauthorized') || error.message.includes('uautoriseret')) {
      return 'auth-error';
    }
    if (error.message.includes('500') || error.message.includes('server')) {
      return 'service-unavailable';
    }
    if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
      return 'api-rate-limit';
    }
  }
  
  return 'generation'; // Default phase
}

// Get user-friendly error title based on phase
export function getErrorTitle(phase: ErrorPhase): string {
  switch (phase) {
    case 'user-fetch': return 'Fejl ved hentning af profil';
    case 'job-save': return 'Fejl ved gemning af job';
    case 'generation': return 'Fejl ved generering';
    case 'letter-save': return 'Fejl ved gemning';
    case 'network': return 'Netværksfejl';
    case 'timeout': return 'Timeout fejl';
    case 'auth': return 'Godkendelsesfejl';
    case 'api-rate-limit': return 'Hastighedsbegrænsning';
    case 'service-unavailable': return 'Tjeneste utilgængelig';
    case 'auth-error': return 'Godkendelsesfejl';
    case 'cv-parsing': return 'Fejl ved CV-analyse';
    default: return 'Ukendt fejl';
  }
}

// Get user-friendly error message with fallback
export function getErrorMessage(error: unknown, fallback = 'Der opstod en ukendt fejl'): string {
  if (error instanceof Error) {
    return error.message || fallback;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return fallback;
}

// Show toast notification for error with consistent formatting
export function showErrorToast(error: unknown): void {
  const phase = getErrorPhase(error);
  const title = getErrorTitle(phase);
  const description = getErrorMessage(error, 'Der opstod en fejl. Prøv venligst igen.');
  
  toast({
    title,
    description,
    variant: "destructive",
  });
}

// Handle promise with timeout - returns a promise that will reject if the original promise takes longer than timeout
export function withTimeout<T>(promise: Promise<T>, timeoutMs = 30000, errorMessage = 'Operation timed out'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(createAppError(errorMessage, 'timeout'));
    }, timeoutMs);
    
    promise
      .then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

// Retry a function with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>, 
  retries = 3, 
  initialDelay = 500,
  phase: ErrorPhase = 'generation'
): Promise<T> {
  let lastError: unknown;
  let delay = initialDelay;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.error(`Attempt ${attempt + 1}/${retries + 1} failed:`, error);
      lastError = error;
      
      // Only retry network errors or timeouts
      if (!isNetworkError(error) && !isTimeoutError(error) && attempt === retries) {
        throw error;
      }
      
      if (attempt === retries) break;
      
      // Wait with exponential backoff before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  
  // If we get here, all retries failed
  if (lastError instanceof Error) {
    throw createAppError(lastError.message, phase, true, { retries });
  }
  throw createAppError('Operation failed after multiple attempts', phase, true, { retries });
}
