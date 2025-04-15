
import { MutableRefObject } from "react";
import { ErrorPhase } from "@/utils/errorHandling";

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
  phase?: ErrorPhase;
  recoverable?: boolean;
  details?: any;
  security?: boolean; // Flag to indicate security-related errors
  sanitized?: boolean; // Flag to indicate if error message has been sanitized
}
