
import { LoadingState, GenerationPhase, GenerationProgress } from "../types";

export interface GenerationTrackingProps {
  isMountedRef: React.MutableRefObject<boolean>;
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void;
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>;
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>;
}

export interface GenerationTrackingReturn {
  generationAttemptRef: React.MutableRefObject<number>;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  incrementAttempt: (ref: React.MutableRefObject<number>) => number;
  abortGeneration: () => AbortController;
  updatePhase: (phase: GenerationPhase, progress: number, message: string) => void;
}
