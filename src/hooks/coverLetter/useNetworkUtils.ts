
import { useCallback } from 'react';

export const useNetworkUtils = () => {
  const createError = useCallback((phase: string, message: string, recoverable = true) => {
    const error = new Error(message);
    (error as any).phase = phase;
    (error as any).recoverable = recoverable;
    return error;
  }, []);

  const fetchWithTimeout = useCallback(async <T,>(
    promise: Promise<T>,
    timeoutMs: number = 30000,
    errorMessage: string = 'Request timed out'
  ): Promise<T> => {
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
