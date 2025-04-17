
import { useCallback } from 'react';
import { useToastAdapter } from './useToastAdapter';
import { AppError, ErrorDisplayConfig, ErrorMetadata } from '@/utils/errorHandler/types';
import { createAppError, isAppError, getErrorMessage } from '@/utils/errorHandler/createError';

export const useErrorHandler = () => {
  const { toast } = useToastAdapter();

  const handleError = useCallback((
    error: unknown,
    config?: Partial<ErrorDisplayConfig>
  ) => {
    console.error('Error occurred:', error);

    const metadata: ErrorMetadata = isAppError(error) 
      ? error.metadata || {}
      : { severity: 'error', category: 'system' };

    const displayConfig: ErrorDisplayConfig = {
      title: config?.title || 'Der opstod en fejl',
      message: config?.message || getErrorMessage(error),
      action: config?.action,
      metadata: {
        ...metadata,
        ...config?.metadata
      }
    };

    // Show toast notification
    toast({
      title: displayConfig.title,
      description: displayConfig.message,
      variant: metadata.severity === 'critical' ? 'destructive' : 'default',
      action: displayConfig.action && (
        <button 
          onClick={displayConfig.action.handler}
          className="rounded bg-white px-2 py-1 text-xs font-medium text-gray-900 hover:bg-gray-100"
        >
          {displayConfig.action.label}
        </button>
      )
    });

    return displayConfig;
  }, [toast]);

  const createError = useCallback((
    message: string,
    metadata?: ErrorMetadata,
    userMessage?: string
  ) => {
    return createAppError(message, metadata, userMessage);
  }, []);

  return {
    handleError,
    createError,
    isAppError
  };
};
