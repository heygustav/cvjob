
import { MutableRefObject } from "react";

export interface GenerationErrorHandlingProps {
  isMountedRef: MutableRefObject<boolean>;
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void;
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoadingState: React.Dispatch<React.SetStateAction<string>>;
}

export interface GenerationErrorHandlers extends GenerationErrorHandlingProps {}

export interface GenerationErrorResult {
  title: string;
  description: string;
  recoverable: boolean;
}

export interface TypedError extends Error {
  phase?: 'job-save' | 'user-fetch' | 'generation' | 'letter-save' | 'api-rate-limit' | 'auth-error' | 'service-unavailable';
  recoverable?: boolean;
}
