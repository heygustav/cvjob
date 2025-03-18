
import { useCallback } from "react";

export const useSafeSetState = (
  isMountedRef: React.MutableRefObject<boolean>
) => {
  // Safe state updater
  const safeSetState = useCallback(<T,>(
    stateSetter: React.Dispatch<React.SetStateAction<T>>, 
    value: T
  ) => {
    if (isMountedRef.current) {
      stateSetter(value);
    }
  }, [isMountedRef]);

  return safeSetState;
};
