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

  // Add placeholder functions for the required steps - these would be implemented with actual logic
  const fetchUserStep = useCallback(async () => {
    // Implementation for fetching user info
    return { name: '', email: '', experience: '', education: '' };
  }, []);

  const saveJobStep = useCallback(async (jobData: any, userId: string, existingJobId?: string) => {
    // Implementation for saving job
    return 'job-id-123';
  }, []);

  const generateLetterStep = useCallback(async (jobData: any, userInfo: any) => {
    // Implementation for generating letter content
    return 'Generated letter content';
  }, []);

  const saveLetterStep = useCallback(async (userId: string, jobId: string, content: string) => {
    // Implementation for saving letter
    return {
      id: 'letter-id-123',
      user_id: userId,
      job_posting_id: jobId,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }, []);

  const fetchUpdatedJobStep = useCallback(async (jobId: string, jobData: any, userId: string) => {
    // Implementation for fetching updated job
    return {
      id: jobId,
      title: jobData.title || '',
      company: jobData.company || '',
      user_id: userId,
    };
  }, []);

  return {
    isGenerating,
    setIsGenerating,
    reset,
    handleError,
    errorRef,
    // Expose step functions
    fetchUserStep,
    saveJobStep,
    generateLetterStep,
    saveLetterStep,
    fetchUpdatedJobStep
  };
};