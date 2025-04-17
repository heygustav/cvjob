
import { ReactNode } from 'react';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export type ErrorCategory = 
  | 'network'
  | 'auth'
  | 'validation'
  | 'timeout'
  | 'business'
  | 'security'
  | 'system';

export interface ErrorMetadata {
  code?: string;
  timestamp?: string;
  requestId?: string;
  severity?: ErrorSeverity;
  category?: ErrorCategory;
  recoverable?: boolean;
  retryable?: boolean;
  [key: string]: any;
}

export interface AppError extends Error {
  metadata?: ErrorMetadata;
  userMessage?: string;
  technicalMessage?: string;
}

export interface ErrorDisplayConfig {
  title?: ReactNode;
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
  metadata?: ErrorMetadata;
}
