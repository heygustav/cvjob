
import { useCallback } from "react";
import { GenerationError } from "./types";

// Timeout utility for network requests
export const useNetworkUtils = () => {
  // Helper for creating typed errors
  const createError = useCallback((phase: 'job-save' | 'user-fetch' | 'generation' | 'letter-save', message: string, recoverable: boolean = true): GenerationError => {
    const error = new Error(message) as GenerationError;
    error.phase = phase;
    error.recoverable = recoverable;
    return error;
  }, []);

  // Timeout utility for network requests
  const fetchWithTimeout = useCallback(async (promise: Promise<any>, timeoutMs: number = 15000) => {
    let timeoutId: NodeJS.Timeout;
    
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Forbindelsen tog for lang tid. Kontroller din internetforbindelse.'));
      }, timeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId);
    }
  }, []);

  return {
    createError,
    fetchWithTimeout
  };
};
