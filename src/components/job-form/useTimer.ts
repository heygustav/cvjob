
import { useState, useRef, useEffect } from "react";

export const useTimer = (isActive: boolean) => {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (isActive) {
      // Only set start time if it hasn't been set yet
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
        setElapsed(0);
      }
      
      // Start a new timer
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 10);
          setElapsed(currentElapsed);
        }
      }, 100);
    } else {
      // Reset timer when loading stops
      startTimeRef.current = null;
      setElapsed(0);
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive]);
  
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 100);
    const hundredths = ms % 100;
    return `${seconds}.${hundredths.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    startTimeRef.current = null;
    setElapsed(0);
  };

  return {
    elapsed,
    formattedTime: formatTime(elapsed),
    resetTimer
  };
};
