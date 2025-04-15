
import { useState, useEffect, useCallback } from "react";
import { 
  withTimeout, 
  withRetry, 
  createAppError, 
  isNetworkError, 
  isTimeoutError,
  ErrorPhase 
} from "@/utils/errorHandling";

export const useNetworkUtils = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  
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
    maxRetries = 3,
    retryDelay = 1000
  ): Promise<T> => {
    // Convert to a function that returns a promise if it's just a promise
    const getPromise = typeof promiseOrFactory === 'function' 
      ? promiseOrFactory 
      : () => promiseOrFactory;
    
    try {
      // Use our utility functions for retry and timeout
      return await withRetry(
        () => withTimeout(getPromise(), timeoutMs, 'Operation timed out'),
        maxRetries,
        retryDelay
      );
    } catch (error) {
      // Update retry count for UI feedback
      if (isNetworkError(error) || isTimeoutError(error)) {
        setRetryCount(prev => prev + 1);
      }
      throw error;
    }
  }, []);

  /**
   * Creates a standardized error with additional metadata
   */
  const createError = useCallback((phase: string, message: string, recoverable = true, details?: any) => {
    return createAppError(
      message,
      phase as ErrorPhase,
      recoverable,
      {
        ...details,
        timestamp: new Date().toISOString(),
        retryCount,
        online: navigator.onLine
      }
    );
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
