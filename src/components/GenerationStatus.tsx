
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export const GenerationStatus: React.FC = () => {
  const [elapsed, setElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    "Analyserer jobopslag...",
    "Tjekker din profil...",
    "Skaber din ansøgning...",
    "Finpudser indholdet..."
  ];

  useEffect(() => {
    const startTime = Date.now();
    
    // Timer for elapsed time
    const timerInterval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 10));
    }, 100);
    
    // Step rotation
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 3000);
    
    return () => {
      clearInterval(timerInterval);
      clearInterval(stepInterval);
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
          {steps[currentStep]} {formatTime(elapsed)}s
        </div>
      </div>
      <div className="mt-2 text-center text-xs text-gray-500">
        Tålmodighed er det bedste mod...
      </div>
    </div>
  );
};
