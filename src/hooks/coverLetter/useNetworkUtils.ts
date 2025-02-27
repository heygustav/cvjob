
import { useState, useEffect } from "react";

export const useNetworkUtils = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
   * Wraps a promise with a timeout
   */
  const fetchWithTimeout = async <T,>(promise: Promise<T>, timeoutMs = 30000): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Operation timed out'));
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([promise, timeoutPromise]);
      clearTimeout(timeoutId);
      return result as T;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  /**
   * Creates a standardized error with a phase indicator
   */
  const createError = (phase: string, message: string, recoverable = true) => {
    const error = new Error(message);
    (error as any).phase = phase;
    (error as any).recoverable = recoverable;
    return error;
  };

  return {
    isOnline,
    fetchWithTimeout,
    createError
  };
};
