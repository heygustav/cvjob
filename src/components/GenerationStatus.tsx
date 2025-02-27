
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export const GenerationStatus: React.FC = () => {
  const [timer, setTimer] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    "Analyserer jobopslag...",
    "Tjekker din profil...",
    "Skaber din ansøgning...",
    "Finpudser indholdet..."
  ];

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 10); // Increment by 10ms
    }, 10);
    
    // Move through steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length ? prev + 1 : 1));
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-md">
      <div className="flex items-center justify-center space-x-4">
        <Clock className="animate-pulse h-5 w-5 text-gray-600" />
        <div className="text-sm text-gray-600">
          {steps[currentStep - 1]} {formatTime(timer)}s
        </div>
      </div>
      <div className="mt-2 text-center text-xs text-gray-500">
        Tålmodighed er det bedste mod...
      </div>
    </div>
  );
};
