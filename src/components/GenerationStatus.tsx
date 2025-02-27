
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

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

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 100);
    const hundredths = ms % 100;
    return `${seconds}.${hundredths.toString().padStart(2, '0')}`;
  };

  // Determine if generation is taking too long (more than 30 seconds)
  const isTakingTooLong = elapsed > 3000 && onRetry;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-md">
      <div className="flex items-center justify-center space-x-4">
        <Clock className="animate-pulse h-5 w-5 text-gray-600" />
        <div className="text-sm text-gray-600">
          {message || steps[stepIndex]} {formatTime(elapsed)}s
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div 
          className="bg-black h-2 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Phase indicator */}
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span className={phase === 'job-save' ? 'font-medium text-black' : ''}>
          Job
        </span>
        <span className={phase === 'user-fetch' ? 'font-medium text-black' : ''}>
          Profil
        </span>
        <span className={phase === 'generation' ? 'font-medium text-black' : ''}>
          AI
        </span>
        <span className={phase === 'letter-save' ? 'font-medium text-black' : ''}>
          Færdig
        </span>
      </div>
      
      {isTakingTooLong && (
        <div className="mt-3 text-center">
          <button
            onClick={onRetry}
            className="text-xs text-gray-600 underline hover:text-gray-800"
          >
            Tager det for lang tid? Klik for at prøve igen
          </button>
        </div>
      )}
      
      <div className="mt-2 text-center text-xs text-gray-500">
        Tålmodighed er det bedste mod...
      </div>
    </div>
  );
};
