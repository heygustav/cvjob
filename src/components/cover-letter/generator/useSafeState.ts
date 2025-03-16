
import { useRef } from "react";

export const useSafeState = () => {
  const isMountedRef = useRef(true);
  
  // Safely set state only if component is still mounted
  const safeSetState = <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      stateSetter(value);
    }
  };
  
  return {
    isMountedRef,
    safeSetState
  };
};
