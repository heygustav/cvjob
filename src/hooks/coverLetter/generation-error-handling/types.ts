
import { GenerationPhase } from "../generation-tracking/types";
import { LoadingState } from "../types";

export interface GenerationErrorHandlingProps {
  isMountedRef: React.MutableRefObject<boolean>;
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void;
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoadingState: React.Dispatch<React.SetStateAction<LoadingState>>;
}

export interface GenerationError extends Error {
  phase: GenerationPhase;
  recoverable: boolean;
}

export interface ErrorResult {
  title: string;
  description: string;
  recoverable: boolean;
}
