
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
      action: displayConfig.action && {
        label: displayConfig.action.label,
        onClick: displayConfig.action.handler
      }
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
