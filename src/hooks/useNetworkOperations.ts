
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { retryWithBackoff } from '@/utils/async/retryWithBackoff';
import { isNetworkError, isTimeoutError } from '@/utils/errorHandling';

export const useNetworkOperations = () => {
  const { toast } = useToast();

  const executeWithRetry = useCallback(async <T,>(
    operation: () => Promise<T>,
    description: string
  ): Promise<T> => {
    try {
      return await retryWithBackoff(operation, {
        shouldRetry: (error) => isNetworkError(error) || isTimeoutError(error),
        onRetry: (error, attempt) => {
          console.warn(`Attempt ${attempt} failed:`, error);
          toast({
            title: 'Netværksfejl',
            description: `Forsøger igen (${attempt}/3)...`,
            variant: 'destructive',
          });
        },
      });
    } catch (error) {
      console.error('Operation failed after retries:', error);
      toast({
        title: 'Fejl',
        description: `Kunne ikke ${description}. Prøv igen senere.`,
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  return { executeWithRetry };
};
