
import { useCallback } from "react";
import { GenerationProgress } from "./types";

export const useGenerationTracking = (
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>
) => {
  // Function to update the generation phase and progress
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

  // Function to abort any in-progress generation
  const abortGeneration = useCallback(() => {
    const controller = new AbortController();
    return controller;
  }, []);

  // Function to increment generation attempt counter
  const incrementAttempt = useCallback((ref: React.MutableRefObject<number>) => {
    ref.current += 1;
    return ref.current;
  }, []);

  return {
    updatePhase,
    abortGeneration,
    incrementAttempt
  };
};
