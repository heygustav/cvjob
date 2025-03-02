
import { useState, useRef, useCallback } from "react";
import { GenerationTrackingProps, GenerationTrackingReturn } from "./types";
import { useIncrementAttempt, useAbortGeneration, useUpdatePhase } from "./trackingUtils";

export const useGenerationTracking = ({
  isMountedRef,
  safeSetState,
  setGenerationPhase,
  setGenerationProgress
}: GenerationTrackingProps): GenerationTrackingReturn => {
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
