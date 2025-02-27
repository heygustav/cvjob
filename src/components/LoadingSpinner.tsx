
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Indlæser..." 
}) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Start timer
    const interval = setInterval(() => {
      setTimer(prev => prev + 10);
    }, 10);
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once on mount

  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[60vh] md:min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <div className="text-center">
        <Clock className="h-10 w-10 md:h-12 md:w-12 animate-pulse text-black mx-auto" />
        <p className="mt-4 text-sm md:text-base text-gray-600">
          {message} {formatTime(timer)}s
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Tålmodighed er det bedste mod...
        </p>
      </div>
    </div>
  );
};
