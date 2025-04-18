
import { useCallback } from 'react';
import { User } from '@/lib/types';
import { useLetterGeneration } from './coverLetter/hooks/useLetterGeneration';
import { useQuery } from '@tanstack/react-query';

export const useCoverLetterGeneration = (user: User | null) => {
  const {
    step,
    setStep,
    isLoading,
    error,
    generateLetter,
  } = useLetterGeneration(user);

  // Fetch letter if we have an ID
  const fetchLetter = useCallback(async (id: string) => {
    // Implementation will be added when needed
    return null;
  }, []);

  return {
    step,
    isLoading,
    error,
    setStep,
    fetchLetter,
    handleJobFormSubmit: generateLetter,
  };
};
