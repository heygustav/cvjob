
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Indlæser..." 
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 10));
    }, 100);
    
    return () => clearInterval(interval);
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
