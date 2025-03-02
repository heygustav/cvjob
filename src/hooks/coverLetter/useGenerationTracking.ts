
import { useGenerationTracking as useGenerationTrackingImpl } from "./generation-tracking";
import { GenerationProgress } from "./types";

export const useGenerationTracking = (
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>
) => {
  // Use the refactored implementation with a more structured interface
  return useGenerationTrackingImpl({
    isMountedRef,
    safeSetState,
    setGenerationPhase,
    setGenerationProgress
  });
};
