
import React, { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Indlæser..." 
}) => {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Reset start time
    startTimeRef.current = Date.now();
    
    // Start timer
    intervalRef.current = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 10);
      setElapsed(currentElapsed);
    }, 100);
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 100);
    const hundredths = ms % 100;
    return `${seconds}.${hundredths.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[60vh] md:min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <div className="text-center">
        <Clock className="h-10 w-10 md:h-12 md:w-12 animate-pulse text-black mx-auto" />
        <p className="mt-4 text-sm md:text-base text-gray-600">
          {message} {formatTime(elapsed)}s
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Tålmodighed er det bedste mod...
        </p>
      </div>
    </div>
  );
};
