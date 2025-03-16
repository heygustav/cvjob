
import { useRef } from "react";

export const useSafeState = () => {
  // Create ref to track component mounting state
  const isMountedRef = useRef(true);
  
  // Safe setState function to prevent updates after unmount
  const safeSetState = <T,>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      stateSetter(value);
    }
  };

  return {
    isMountedRef,
    safeSetState
  };
};
