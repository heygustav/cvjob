
import { useCallback } from "react";

export const useSafeSetState = (isMountedRef: React.MutableRefObject<boolean>) => {
  return useCallback(<T,>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      stateSetter(value);
    }
  }, [isMountedRef]);
};
