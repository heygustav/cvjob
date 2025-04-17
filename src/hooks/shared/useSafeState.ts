
import { useCallback, useRef, useEffect } from "react";

/**
 * Hook to safely update state in components that might unmount
 * @returns A tuple containing a mount reference and a safe setState function
 */
export const useSafeState = () => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Safely update state only if the component is still mounted
   */
  const safeSetState = useCallback(<T,>(
    stateSetter: React.Dispatch<React.SetStateAction<T>>,
    value: T
  ) => {
    if (isMountedRef.current) {
      stateSetter(value);
    }
  }, []);

  return { isMountedRef, safeSetState };
};
