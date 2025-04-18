
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCoverLetterActions, useCoverLetterState } from '../CoverLetterContext';
import { CoverLetter } from '@/lib/types';
import { showErrorToast } from '@/utils/errorHandling';
import { fetchLetterById, fetchJobById } from '@/services/coverLetter/database';

/**
 * Hook for fetching letter and job data
 */
export const useLetterDataFetching = () => {
  const { user } = useCoverLetterState();
  const { 
    setLoadingState, 
    setGeneratedLetter, 
    setSelectedJob,
    setStep,
    setGenerationProgress,
    setError 
  } = useCoverLetterActions();
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchLetter = useCallback(async (id: string): Promise<CoverLetter | null> => {
    if (!user) {
      toast({
        title: 'Login krævet',
        description: 'Du skal være logget ind for at hente ansøgninger',
        variant: 'destructive'
      });
      navigate('/login');
      return null;
    }

    try {
      setLoadingState('initializing');
      setError(null);
      
      setGenerationProgress({
        phase: 'letter-fetch',
        progress: 10,
        message: 'Henter ansøgning...'
      });
      
      // Fetch letter from API
      const letter = await fetchLetterById(id);
      
      if (!letter) {
        toast({
          title: 'Ansøgning ikke fundet',
          description: 'Den angivne ansøgning kunne ikke findes',
          variant: 'destructive'
        });
        navigate('/dashboard');
        return null;
      }
      
      // Validate user ownership
      if (letter.user_id !== user.id) {
        toast({
          title: 'Adgang nægtet',
          description: 'Du har ikke adgang til denne ansøgning',
          variant: 'destructive'
        });
        navigate('/dashboard');
        return null;
      }
      
      // Set the letter
      setGeneratedLetter(letter);
      
      setGenerationProgress({
        phase: 'job-fetch',
        progress: 50,
        message: 'Henter jobdetaljer...'
      });
      
      // Fetch associated job
      try {
        const job = await fetchJobById(letter.job_posting_id);
        if (job) {
          setSelectedJob(job);
        }
      } catch (jobError) {
        console.error('Error fetching job:', jobError);
        // Continue even if job fetch fails
      }
      
      setGenerationProgress({
        phase: 'complete',
        progress: 100,
        message: 'Færdig!'
      });
      
      // Move to preview step
      setStep(2);
      setLoadingState('idle');
      
      return letter;
      
    } catch (error) {
      console.error('Error fetching letter:', error);
      showErrorToast(error);
      setLoadingState('idle');
      navigate('/dashboard');
      return null;
    }
  }, [
    user, 
    navigate, 
    toast, 
    setLoadingState, 
    setError, 
    setGenerationProgress, 
    setGeneratedLetter, 
    setSelectedJob, 
    setStep
  ]);

  return {
    fetchLetter
  };
};
