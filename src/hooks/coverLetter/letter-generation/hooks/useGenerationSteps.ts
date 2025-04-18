
import { useState, useRef, useCallback } from 'react';
import { showErrorToast } from '@/utils/errorHandling';
import { useToast } from '@/hooks/use-toast';
import { handleTypedError, handleStandardError, handleTimeoutError } from '../../generation-error-handling';
import { CoverLetter } from '@/lib/types';
import { GenerationError } from '../../generation-error-handling/types';

export const useGenerationSteps = (
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void
) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const errorRef = useRef<Error | null>(null);
  const { toast } = useToast();

  const reset = useCallback(() => {
    setStep(1);
    setIsGenerating(false);
    safeSetState(setGenerationError, null);
    safeSetState(setGeneratedLetter, null);
  }, [setStep, setGenerationError, setGeneratedLetter, safeSetState]);

  const handleError = useCallback((error: Error | GenerationError) => {
    console.error("Generation error:", error);
    errorRef.current = error instanceof Error ? error : new Error(error.message || 'Unknown error');
    safeSetState(setGenerationError, error.message || 'Unknown error');

    if (error instanceof Error) {
      const result = handleStandardError(error);
      toast({
        title: result.title,
        description: result.description,
        variant: "destructive"
      });
    } else if ('message' in error && typeof error.message === 'string' && error.message.includes('timeout')) {
      handleTimeoutError(error);
    } else {
      const result = handleTypedError(error);
      toast({
        title: result.title,
        description: result.description,
        variant: "destructive"
      });
    }

    showErrorToast(error);
    setIsGenerating(false);
    return true;
  }, [toast, setGenerationError, safeSetState]);

  return {
    isGenerating,
    setIsGenerating,
    reset,
    handleError,
    errorRef
  };
};
