
import { AppError, ErrorMetadata } from './types';

export function createAppError(
  message: string,
  metadata?: ErrorMetadata,
  userMessage?: string
): AppError {
  const error = new Error(message) as AppError;
  error.metadata = {
    timestamp: new Date().toISOString(),
    ...metadata
  };
  error.userMessage = userMessage || message;
  error.technicalMessage = message;
  return error;
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof Error && 'metadata' in error;
}

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.userMessage || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
