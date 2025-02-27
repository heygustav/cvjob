
import React, { useState, useEffect } from "react";
import GenerationProgressIndicator from "./GenerationProgressIndicator";

interface GenerationStatusProps {
  phase?: string;
  progress?: number;
  message?: string;
  onRetry?: () => void;
}

export const GenerationStatus: React.FC<GenerationStatusProps> = ({ 
  phase = 'generation',
  progress = 0,
  message,
  onRetry
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  
  // Define steps based on the current phase
  const getPhaseSpecificStep = () => {
    if (message) return message;
    
    switch (phase) {
      case 'user-fetch':
        return "Henter din profil...";
      case 'job-save':
        return "Gemmer jobinformation...";
      case 'generation':
        return "Skaber din ansøgning...";
      case 'letter-save':
        return "Gemmer din ansøgning...";
      default:
        return "Behandler...";
    }
  };
  
  const steps = [
    getPhaseSpecificStep(),
    "Analyserer jobopslag...",
    "Skaber din ansøgning...",
    "Finpudser indholdet..."
  ];

  // Start timers on component mount
  useEffect(() => {
    const startTime = Date.now();
    
    // Start elapsed time timer
    const intervalId = setInterval(() => {
      const currentElapsed = Math.floor((Date.now() - startTime) / 10);
      setElapsed(currentElapsed);
    }, 100);
    
    // Start step rotation (only rotate generic steps if we're in generation phase)
    const stepIntervalId = setInterval(() => {
      if (phase === 'generation' && !message) {
        setStepIndex(prev => (prev + 1) % steps.length);
      }
    }, 3000);
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      clearInterval(stepIntervalId);
    };
  }, [steps.length, phase, message]);

  // Use the current message or rotate through steps for generation phase
  const currentMessage = message || steps[stepIndex];

  return (
    <GenerationProgressIndicator
      phase={phase}
      progress={progress}
      elapsed={elapsed}
      message={currentMessage}
      onRetry={onRetry}
    />
  );
};
