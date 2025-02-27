
import React, { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

export const GenerationStatus: React.FC = () => {
  const [elapsed, setElapsed] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const steps = [
    "Analyserer jobopslag...",
    "Tjekker din profil...",
    "Skaber din ansøgning...",
    "Finpudser indholdet..."
  ];

  // Start timers on component mount
  useEffect(() => {
    // Clear any existing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    
    // Reset start time
    startTimeRef.current = Date.now();
    
    // Start elapsed time timer
    intervalRef.current = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - startTimeRef.current) / 10);
      setElapsed(currentElapsed);
    }, 100);
    
    // Start step rotation
    stepIntervalRef.current = setInterval(() => {
      setStepIndex(prev => (prev + 1) % steps.length);
    }, 3000);
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, [steps.length]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 100);
    const hundredths = ms % 100;
    return `${seconds}.${hundredths.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-md">
      <div className="flex items-center justify-center space-x-4">
        <Clock className="animate-pulse h-5 w-5 text-gray-600" />
        <div className="text-sm text-gray-600">
          {steps[stepIndex]} {formatTime(elapsed)}s
        </div>
      </div>
      <div className="mt-2 text-center text-xs text-gray-500">
        Tålmodighed er det bedste mod...
      </div>
    </div>
  );
};
