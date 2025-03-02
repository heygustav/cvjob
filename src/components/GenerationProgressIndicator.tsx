
import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

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
  
  // Get a helpful tip based on the current phase
  const getHelpfulTip = () => {
    if (phase === 'generation' && elapsed > 1500) {
      return "Generering af ansøgning kan tage lidt længere tid end normalt, især ved ufuldstændige data. Hvis det tager mere end 60 sekunder, kan du prøve at trykke på 'Prøv igen'.";
    }
    if (phase === 'user-fetch' && elapsed > 1000) {
      return "Hentning af din profil tager længere tid end normalt. Dette kan skyldes netværksforsinkelser.";
    }
    if (phase === 'job-save' && elapsed > 1000) {
      return "Gemning af joboplysninger tager længere tid end normalt. Dette kan skyldes netværksforsinkelser.";
    }
    if (phase === 'letter-save' && elapsed > 1000) {
      return "Gemning af ansøgning tager længere tid end normalt. Dette kan skyldes netværksforsinkelser.";
    }
    return "Tålmod er det bedste mod. Hvis processen tager for lang tid, kan du prøve at trykke på 'Prøv igen'.";
  };
  
  return (
    <div 
      className="mt-6 p-5 bg-background rounded-lg shadow-sm border border-border" 
      aria-live="polite" 
      role="status"
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="animate-pulse h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">{message}</span>
          </div>
          <span className="text-sm font-medium text-muted-foreground">{formatTime(elapsed)}s</span>
        </div>
        
        {/* Progress bar */}
        <div 
          className="w-full bg-muted rounded-full h-3 overflow-hidden" 
          aria-valuemin={0} 
          aria-valuemax={100} 
          aria-valuenow={progress} 
          role="progressbar"
          aria-label={`${progress}% komplet`}
        >
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${Math.max(5, progress)}%` }}
          ></div>
        </div>
        
        {/* Phase indicator */}
        <div className="flex justify-between text-xs text-muted-foreground pt-1">
          <span className={cn("transition-colors duration-300", 
            phase === 'job-save' ? "font-medium text-primary underline" : "")}>
            Gem job
          </span>
          <span className={cn("transition-colors duration-300", 
            phase === 'user-fetch' ? "font-medium text-primary underline" : "")}>
            Profil
          </span>
          <span className={cn("transition-colors duration-300", 
            phase === 'generation' ? "font-medium text-primary underline" : "")}>
            AI
          </span>
          <span className={cn("transition-colors duration-300", 
            phase === 'letter-save' ? "font-medium text-primary underline" : "")}>
            Færdig
          </span>
        </div>
        
        {/* Show retry button if taking too long */}
        {(isTakingTooLong || elapsed > 2000) && onRetry && (
          <div className="flex justify-start mt-3">
            <Button 
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Prøv igen
            </Button>
          </div>
        )}
        
        <div className="mt-2 text-xs text-muted-foreground italic">
          {getHelpfulTip()}
        </div>
      </div>
    </div>
  );
};

export default GenerationProgressIndicator;
