
import { useState, useRef, useCallback } from 'react';
import { showErrorToast } from '@/utils/errorHandling';
import { useToast } from '@/hooks/use-toast';
import { handleTypedError, handleStandardError, handleTimeoutError } from '../../generation-error-handling';

// Define CoverLetter type since it can't be imported from '../types'
interface CoverLetter {
  id: string;
  user_id: string;
  job_posting_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useGenerationSteps = (
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>,
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void
) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const errorRef = useRef<any>(null);
  const { toast } = useToast();

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsGenerating(false);
    safeSetState(setGenerationError, null);
    safeSetState(setGeneratedLetter, null);
  }, [setGenerationError, setGeneratedLetter, safeSetState]);

  const handleError = useCallback((error: any) => {
    console.error("Generation error:", error);
    errorRef.current = error;
    safeSetState(setGenerationError, error);

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
    currentStep,
    setCurrentStep,
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
