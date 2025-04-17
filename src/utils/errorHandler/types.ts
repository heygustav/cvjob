
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

export type ErrorPhase = 
  | 'user-fetch' 
  | 'job-save' 
  | 'generation' 
  | 'letter-save' 
  | 'network' 
  | 'timeout' 
  | 'auth' 
  | 'api-rate-limit' 
  | 'service-unavailable' 
  | 'auth-error'
  | 'cv-parsing'
  | 'security-issue'
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
  phase?: ErrorPhase;
}

export interface ErrorAction {
  label: string;
  handler: () => void;
}

export interface ErrorDisplayConfig {
  title?: ReactNode;
  message: string;
  action?: ErrorAction;
  metadata?: ErrorMetadata;
  phase?: ErrorPhase;
}
