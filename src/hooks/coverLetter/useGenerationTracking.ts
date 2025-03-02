
import { useRef, useCallback } from "react";
import { GenerationProgress } from "./types";
import { useIncrementAttempt, useAbortGeneration, useUpdatePhase } from "./generation-tracking/trackingUtils";

export const useGenerationTracking = (
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>
) => {
  const generationAttemptRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Hook composition for better separation of concerns
  const incrementAttempt = useIncrementAttempt(generationAttemptRef);
  const abortGeneration = useAbortGeneration(abortControllerRef);
  const updatePhase = useUpdatePhase({
    isMountedRef,
    safeSetState,
    setGenerationPhase,
    setGenerationProgress
  });

  return {
    generationAttemptRef,
    abortControllerRef,
    incrementAttempt,
    abortGeneration,
    updatePhase
  };
};
