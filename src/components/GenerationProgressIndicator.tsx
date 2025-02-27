
import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';

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
    <div className="mt-6 p-5 bg-white rounded-lg shadow-sm border border-gray-200" aria-live="polite" role="status">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="animate-pulse h-5 w-5 text-blue-600" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-800">{message}</span>
          </div>
          <span className="text-sm font-medium text-gray-700">{formatTime(elapsed)}s</span>
        </div>
        
        {/* Progress bar */}
        <div 
          className="w-full bg-gray-200 rounded-full h-3" 
          aria-valuemin={0} 
          aria-valuemax={100} 
          aria-valuenow={progress} 
          role="progressbar"
          aria-label={`${progress}% komplet`}
        >
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Phase indicator */}
        <div className="flex justify-between text-xs text-gray-500 pt-1">
          <span className={`transition-colors duration-300 ${phase === 'job-save' ? 'font-medium text-blue-700 underline' : ''}`}>
            Gem job
          </span>
          <span className={`transition-colors duration-300 ${phase === 'user-fetch' ? 'font-medium text-blue-700 underline' : ''}`}>
            Profil
          </span>
          <span className={`transition-colors duration-300 ${phase === 'generation' ? 'font-medium text-blue-700 underline' : ''}`}>
            AI
          </span>
          <span className={`transition-colors duration-300 ${phase === 'letter-save' ? 'font-medium text-blue-700 underline' : ''}`}>
            Færdig
          </span>
        </div>
        
        {/* Show retry button if taking too long */}
        {isTakingTooLong && onRetry && (
          <div className="flex justify-start mt-3">
            <button
              onClick={onRetry}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Prøv igen"
            >
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Prøv igen
            </button>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-500 italic">
          Tålmod er det bedste mod.
        </div>
      </div>
    </div>
  );
};

export default GenerationProgressIndicator;
