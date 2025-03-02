
import { useGenerationErrorHandling as useGenerationErrorHandlingImpl } from "./generation-error-handling";

export const useGenerationErrorHandling = (
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
) => {
  // Use the refactored implementation with a more structured interface
  return useGenerationErrorHandlingImpl({
    isMountedRef,
    safeSetState,
    setGenerationError,
    setLoadingState
  });
};
