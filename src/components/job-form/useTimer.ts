
import { useState, useEffect, useRef } from "react";

export const useTimer = (isActive: boolean) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Reset timer when isActive changes
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset elapsed time when inactive
    if (!isActive) {
      setElapsedTime(0);
      startTimeRef.current = null;
      return;
    }

    // Start new timer when active
    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const currentTime = Date.now();
        const timeElapsed = Math.floor((currentTime - startTimeRef.current) / 1000);
        setElapsedTime(timeElapsed);
      }
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  // Format the elapsed time as a string (e.g., "1m 30s")
  const formatTime = (seconds: number): string => {
    if (seconds === 0) return "";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
  };
};
