
import { useState, useEffect, useCallback } from "react";

export const useNetworkUtils = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Wraps a promise with a timeout and automatic retry logic
   */
  const fetchWithTimeout = useCallback(async <T,>(
    promiseOrFactory: (() => Promise<T>) | Promise<T>, 
    timeoutMs = 30000,
    maxRetries = MAX_RETRIES,
    retryDelay = 1000
  ): Promise<T> => {
    let attempts = 0;
    
    const executeWithRetry = async (): Promise<T> => {
      try {
        let timeoutId: ReturnType<typeof setTimeout>;
        
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Operation timed out'));
          }, timeoutMs);
        });

        // Handle both Promise and Promise factory function
        const resultPromise = typeof promiseOrFactory === 'function' 
          ? promiseOrFactory() 
          : promiseOrFactory;
        
        // Race between the operation and the timeout
        const result = await Promise.race([resultPromise, timeoutPromise]);
        clearTimeout(timeoutId);
        setRetryCount(0); // Reset retry count on success
        return result as T;
      } catch (error) {
        attempts++;
        setRetryCount(attempts);
        
        // If we have retries left and it's a network error or timeout, retry
        if (
          attempts < maxRetries && 
          (
            error instanceof Error && 
            (error.message.includes('timed out') || 
             error.message.includes('network') ||
             error.message.includes('fetch') ||
             !navigator.onLine)
          )
        ) {
          console.log(`Retry attempt ${attempts} for operation after delay of ${retryDelay}ms`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
          
          // Retry with exponential backoff
          return executeWithRetry();
        }
        
        // If we're out of retries or it's not a retriable error, throw
        throw error;
      }
    };
    
    return executeWithRetry();
  }, []);

  /**
   * Creates a standardized error with additional metadata
   */
  const createError = useCallback((phase: string, message: string, recoverable = true, details?: any) => {
    const error = new Error(message);
    Object.assign(error, { 
      phase, 
      recoverable, 
      details,
      timestamp: new Date().toISOString(),
      retryCount,
      online: navigator.onLine
    });
    return error;
  }, [retryCount]);

  /**
   * Cache implementation to avoid redundant network requests
   */
  const cache = new Map<string, { data: any; timestamp: number; }>();
  const MAX_CACHE_AGE = 5 * 60 * 1000; // 5 minutes
  
  const cachedFetch = useCallback(async <T,>(
    key: string,
    fetchFn: () => Promise<T>,
    maxAge = MAX_CACHE_AGE
  ): Promise<T> => {
    const now = Date.now();
    const cachedItem = cache.get(key);
    
    // Return from cache if it exists and is not expired
    if (cachedItem && (now - cachedItem.timestamp < maxAge)) {
      console.log(`Cache hit for key: ${key}`);
      return cachedItem.data as T;
    }
    
    // Fetch new data
    console.log(`Cache miss for key: ${key}, fetching fresh data`);
    const data = await fetchFn();
    
    // Store in cache
    cache.set(key, { data, timestamp: now });
    
    return data;
  }, []);

  return {
    isOnline,
    retryCount,
    fetchWithTimeout,
    createError,
    cachedFetch
  };
};
