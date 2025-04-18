
import { useCallback } from "react";
import { showErrorToast } from "@/utils/errorHandling";

export const useNetworkHelpers = (defaultTimeoutMs = 30000) => {
  const withTimeout = useCallback(<T>(
    promiseFactory: () => Promise<T>,
    timeoutMs: number = defaultTimeoutMs
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeoutMs);
      
      promiseFactory()
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }, [defaultTimeoutMs]);
  
  const createError = useCallback((
    message: string,
    code?: string,
    originalError?: unknown
  ): Error => {
    const error = new Error(message);
    if (code) {
      Object.assign(error, { code });
    }
    if (originalError) {
      Object.assign(error, { cause: originalError });
    }
    return error;
  }, []);
  
  const retryWithBackoff = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelayMs: number = 300
  ): Promise<T> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 100;
        
        console.warn(`Operation failed, retrying in ${Math.round(delay)}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    if (lastError) {
      showErrorToast(lastError);
      throw lastError;
    }
    throw new Error('Operation failed after retries');
  }, []);
  
  return {
    withTimeout,
    createError,
    retryWithBackoff,
    showErrorToast
  };
};
