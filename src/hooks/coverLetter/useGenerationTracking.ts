
import { useState, useRef, useCallback } from "react";
import { GenerationProgress } from "./types";

export const useGenerationTracking = (
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>
) => {
  const generationAttemptRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Track generation attempt
  const incrementAttempt = useCallback(() => {
    generationAttemptRef.current += 1;
    return generationAttemptRef.current;
  }, []);

  // Abort current generation
  const abortGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      console.log("Aborting previous generation attempt");
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  // Update generation phase
  const updatePhase = useCallback((phase: string, progress: number, message: string) => {
    if (isMountedRef.current) {
      safeSetState(setGenerationPhase, phase);
      safeSetState(setGenerationProgress, {
        phase: phase as any,
        progress,
        message
      });
    }
  }, [isMountedRef, safeSetState, setGenerationPhase, setGenerationProgress]);

  return {
    generationAttemptRef,
    abortControllerRef,
    incrementAttempt,
    abortGeneration,
    updatePhase
  };
};
