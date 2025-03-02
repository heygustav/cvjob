
import { useCallback } from "react";
import { GenerationTrackingProps } from "./types";

export const useIncrementAttempt = (generationAttemptRef: React.MutableRefObject<number>) => {
  return useCallback(() => {
    generationAttemptRef.current += 1;
    return generationAttemptRef.current;
  }, [generationAttemptRef]);
};

export const useAbortGeneration = (abortControllerRef: React.MutableRefObject<AbortController | null>) => {
  return useCallback(() => {
    if (abortControllerRef.current) {
      console.log("Aborting previous generation attempt");
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, [abortControllerRef]);
};

export const useUpdatePhase = ({
  isMountedRef,
  safeSetState,
  setGenerationPhase,
  setGenerationProgress
}: GenerationTrackingProps) => {
  return useCallback((phase: string, progress: number, message: string) => {
    if (isMountedRef.current) {
      safeSetState(setGenerationPhase, phase);
      safeSetState(setGenerationProgress, {
        phase: phase as any,
        progress,
        message
      });
    }
  }, [isMountedRef, safeSetState, setGenerationPhase, setGenerationProgress]);
};
