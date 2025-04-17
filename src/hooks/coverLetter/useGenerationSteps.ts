
import { useState, useRef, useCallback } from 'react';
import { showErrorToast } from '@/utils/errorHandling';
import { useToast } from '@/hooks/use-toast';
import { handleTypedError, handleStandardError, handleTimeoutError } from './generation-error-handling';

// Define CoverLetter type since it can't be imported from '../types'
interface CoverLetter {
  id: string;
  user_id: string;
  job_posting_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Updated function signature to make parameters optional
export const useGenerationSteps = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const errorRef = useRef<any>(null);
  const { toast } = useToast();

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsGenerating(false);
    setGenerationError(null);
    setCoverLetter(null);
  }, []);

  const handleError = useCallback((error: any) => {
    console.error("Generation error:", error);
    errorRef.current = error;
    setGenerationError(error);

    if (error instanceof Error) {
      const result = handleStandardError(error);
      toast({
        title: result.title,
        description: result.description,
        variant: "destructive"
      });
    } else if (error.message && error.message.includes('timeout')) {
      handleTimeoutError(error);
    }
    else {
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
  }, [toast]);

  return {
    currentStep,
    setCurrentStep,
    isGenerating,
    setIsGenerating,
    generationError,
    setGenerationError,
    coverLetter,
    setCoverLetter,
    reset,
    handleError,
    errorRef
  };
};
