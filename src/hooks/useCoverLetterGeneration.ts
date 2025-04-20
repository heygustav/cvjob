
import { useCallback, useState } from 'react';
import { User } from '@/lib/types';
import { useLetterGeneration } from './coverLetter/hooks/useLetterGeneration';
import { JobFormData } from '@/services/coverLetter/types';
import { GenerationProgress, LoadingState } from './coverLetter/types';
import { CoverLetter, JobPosting } from '@/lib/types';

export const useCoverLetterGeneration = (user: User | null) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [generationPhase, setGenerationPhase] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    phase: 'job-save',
    progress: 0,
    message: 'Forbereder...'
  });
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    handleGenerateLetter,
    handleEditContent,
  } = useLetterGeneration({
    completeUser: user,
    setIsGenerating,
    setLoadingState,
    setJobData: () => {}, // Placeholder
    setSelectedJob,
    setGeneratedLetter,
    setStep,
    setError,
  });

  // Fetch job if we have an ID
  const fetchJob = useCallback(async (id: string) => {
    // Implementation will be added when needed
    return null;
  }, []);

  // Fetch letter if we have an ID
  const fetchLetter = useCallback(async (id: string) => {
    // Implementation will be added when needed
    return null;
  }, []);

  // Handle letter editing
  const handleEditLetter = useCallback(async (content: string) => {
    return handleEditContent(content);
  }, [handleEditContent]);

  // Save job as draft
  const saveJobAsDraft = useCallback(async (jobData: JobFormData): Promise<string | null> => {
    // Placeholder implementation
    return null;
  }, []);

  // Reset error
  const resetError = useCallback(() => {
    setGenerationError(null);
    setError(null);
  }, []);

  // Wrap the handle job form submit to return void
  const handleJobFormSubmit = useCallback(async (jobData: JobFormData): Promise<void> => {
    await handleGenerateLetter(jobData);
  }, [handleGenerateLetter]);

  return {
    step,
    isGenerating,
    isLoading,
    loadingState,
    generationPhase,
    generationProgress,
    selectedJob,
    generatedLetter,
    generationError,
    error,
    setStep,
    fetchJob,
    fetchLetter,
    handleJobFormSubmit,
    handleEditLetter,
    saveJobAsDraft,
    resetError,
  };
};
