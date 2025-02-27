
import React from 'react';
import { Clock } from 'lucide-react';

interface GenerationProgressProps {
  phase: string;
  progress: number;
  elapsed: number;
  message: string;
  onRetry?: () => void;
}

const GenerationProgressIndicator: React.FC<GenerationProgressProps> = ({
  phase,
  progress,
  elapsed,
  message,
  onRetry
}) => {
  // Format elapsed time as seconds with 2 decimal places
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 100);
    const hundredths = ms % 100;
    return `${seconds}.${hundredths.toString().padStart(2, '0')}`;
  };
  
  // Determine if generation is taking too long (more than 30 seconds)
  const isTakingTooLong = elapsed > 3000;
  
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-md">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="animate-pulse h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{message}</span>
          </div>
          <span className="text-sm text-gray-500">{formatTime(elapsed)}s</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-black h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Phase indicator */}
        <div className="flex justify-between text-xs text-gray-500">
          <span className={phase === 'job-save' ? 'font-medium text-black' : ''}>
            Gem job
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
        
        {/* Show retry button if taking too long */}
        {isTakingTooLong && onRetry && (
          <div className="flex justify-start mt-2">
            <button
              onClick={onRetry}
              className="text-sm font-medium text-black underline hover:text-gray-700"
            >
              Prøv igen
            </button>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-500">
          Tålmodighed er det bedste mod...
        </div>
      </div>
    </div>
  );
};

export default GenerationProgressIndicator;
