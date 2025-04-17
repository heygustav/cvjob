
import { useCallback } from 'react';
import { GenerationTrackingProps } from './types';

export const useIncrementAttempt = (ref: React.MutableRefObject<number>) => {
  return useCallback(() => {
    ref.current += 1;
    return ref.current;
  }, [ref]);
};

export const useAbortGeneration = (ref: React.MutableRefObject<AbortController | null>) => {
  return useCallback(() => {
    if (ref.current) {
      ref.current.abort();
    }
    const controller = new AbortController();
    ref.current = controller;
    return controller;
  }, [ref]);
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
        phase,
        progress,
        message
      });
    }
  }, [isMountedRef, safeSetState, setGenerationPhase, setGenerationProgress]);
};
