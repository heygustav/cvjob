
import React, { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Indlæser...",
  progress
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
    <div className="min-h-[60vh] md:min-h-screen bg-gray-50 flex justify-center items-center px-4" aria-live="polite" role="status">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-center" aria-hidden="true">
          <Clock className="h-12 w-12 animate-pulse text-gray-700" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-gray-800 text-center">{message}</h2>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">Vent venligst</span>
          <span className="text-sm font-medium text-gray-700">{formatTime(elapsed)}s</span>
        </div>
        
        {progress !== undefined && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} role="progressbar">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        <p className="mt-4 text-sm text-gray-500 text-center">
          Tålmodighed er det bedste mod...
        </p>
      </div>
    </div>
  );
};
