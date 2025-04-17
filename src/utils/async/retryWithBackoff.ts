
import { createAppError } from '@/utils/errorHandling';

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_INITIAL_DELAY = 1000;

export interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  shouldRetry?: (error: any) => boolean;
  onRetry?: (error: any, attempt: number) => void;
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  {
    maxRetries = DEFAULT_MAX_RETRIES,
    initialDelay = DEFAULT_INITIAL_DELAY,
    shouldRetry = () => true,
    onRetry
  }: RetryConfig = {}
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw createAppError(
          error?.message || 'Operation failed',
          'network',
          true,
          { attempts: attempt + 1 }
        );
      }

      const delay = initialDelay * Math.pow(2, attempt);
      onRetry?.(error, attempt + 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
