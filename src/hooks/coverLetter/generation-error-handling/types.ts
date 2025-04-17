
export interface GenerationErrorHandlingProps {
  isMountedRef: React.MutableRefObject<boolean>;
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void;
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoadingState: React.Dispatch<React.SetStateAction<string>>;
}
