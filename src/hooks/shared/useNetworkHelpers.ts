
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface NetworkOptions {
  timeoutMs?: number;
  retries?: number;
  backoffFactor?: number;
  phaseLabel?: string;
}

const DEFAULT_OPTIONS: NetworkOptions = {
  timeoutMs: 30000,
  retries: 2,
  backoffFactor: 1.5,
  phaseLabel: "network"
};

export const useNetworkHelpers = () => {
  const { toast } = useToast();

  /**
   * Create a structured error with phase information
   */
  const createError = useCallback((phase: string, message: string, recoverable = true) => {
    const error = new Error(message);
    (error as any).phase = phase;
    (error as any).recoverable = recoverable;
    return error;
  }, []);

  /**
   * Execute a promise with a timeout
   */
  const withTimeout = useCallback(async <T,>(
    promise: Promise<T>,
    timeoutMs: number = 30000,
    errorMessage: string = 'Request timed out'
  ): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(createError("timeout", errorMessage, true));
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }, [createError]);

  /**
   * Execute a function with retry capability
   */
  const executeWithRetry = useCallback(async <T,>(
    fn: () => Promise<T>,
    options?: NetworkOptions
  ): Promise<T> => {
    const { timeoutMs, retries, backoffFactor, phaseLabel } = {
      ...DEFAULT_OPTIONS,
      ...options
    };

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries!; attempt++) {
      try {
        // If not the first attempt, wait with exponential backoff
        if (attempt > 0) {
          const delay = Math.min(
            1000 * Math.pow(backoffFactor!, attempt - 1),
            10000
          );
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        // Execute the function with timeout
        return await withTimeout(fn(), timeoutMs!);
      } catch (error) {
        console.error(`Attempt ${attempt + 1}/${retries! + 1} failed:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // If it's the last attempt, rethrow the error
        if (attempt === retries!) {
          throw createError(
            phaseLabel!,
            `Failed after ${retries! + 1} attempts: ${lastError.message}`,
            true
          );
        }
      }
    }
    
    // This should never be reached due to the throw in the catch block
    throw lastError || new Error("Unknown error");
  }, [createError, withTimeout]);

  /**
   * Show a standardized error toast
   */
  const showErrorToast = useCallback((error: any) => {
    const isNetworkError = !navigator.onLine || 
      (error instanceof Error && (
        error.message.includes('forbindelse') ||
        error.message.includes('timeout') ||
        error.message.includes('network')
      ));
      
    toast({
      title: isNetworkError ? "Netværksfejl" : "Fejl",
      description: error instanceof Error ? error.message : "Der opstod en fejl. Prøv igen senere.",
      variant: "destructive",
    });
  }, [toast]);

  return {
    createError,
    withTimeout,
    executeWithRetry,
    showErrorToast
  };
};
