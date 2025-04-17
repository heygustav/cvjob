
import { useCallback } from 'react';

export const useNetworkUtils = () => {
  const createError = useCallback((phase: string, message: string, recoverable = true) => {
    const error = new Error(message);
    (error as any).phase = phase;
    (error as any).recoverable = recoverable;
    return error;
  }, []);

  const fetchWithTimeout = useCallback(async <T,>(
    promiseOrFn: Promise<T> | (() => Promise<T>),
    timeoutMs: number = 30000,
    errorMessage: string = 'Request timed out'
  ): Promise<T> => {
    // If a function is provided, execute it to get the promise
    const promise = typeof promiseOrFn === 'function' 
      ? (promiseOrFn as () => Promise<T>)() 
      : promiseOrFn;
    
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(errorMessage));
      }, timeoutMs);
    });

    return Promise.race([promise, timeout]);
  }, []);

  return {
    createError,
    fetchWithTimeout
  };
};
