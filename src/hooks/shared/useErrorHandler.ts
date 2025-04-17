import { useCallback } from 'react';
import { useToastAdapter } from './useToastAdapter';
import { AppError, ErrorDisplayConfig, ErrorMetadata, ErrorPhase } from '@/utils/errorHandler/types';
import { createAppError, isAppError, getErrorMessage } from '@/utils/errorHandler/createError';
import { errorLogger } from '@/utils/errorHandler/errorLogger';
import { createToastAction } from '@/utils/toast/createToastAction';

export const useErrorHandler = () => {
  const { toast } = useToastAdapter();

  const handleError = useCallback((
    error: unknown,
    config?: Partial<ErrorDisplayConfig>
  ) => {
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
      },
      phase: config?.phase || (isAppError(error) && error.phase) || 'system' // Provide a fallback value
    };

    // Log the error with context
    errorLogger.log(
      metadata.severity || 'error',
      displayConfig.message,
      error instanceof Error ? error : new Error(String(error)),
      metadata,
      {
        action: 'handle_error',
        component: config?.metadata?.component,
        category: metadata.category
      }
    );

    // Create toast action using the utility function
    const toastAction = createToastAction(displayConfig.action);

    // Show toast notification
    toast({
      title: displayConfig.title,
      description: displayConfig.message,
      variant: metadata.severity === 'critical' ? 'destructive' : 'default',
      action: toastAction
    });

    return displayConfig;
  }, [toast]);

  const createError = useCallback((
    message: string,
    metadata?: ErrorMetadata,
    userMessage?: string,
    phase?: ErrorPhase
  ) => {
    return createAppError(message, metadata, userMessage, phase);
  }, []);

  return {
    handleError,
    createError,
    isAppError
  };
};
