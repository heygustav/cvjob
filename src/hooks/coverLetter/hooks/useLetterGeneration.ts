
import { useState, useCallback, useRef } from 'react';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { handleLetterGeneration } from '../letterGeneration/letterGenerationUtils';
import { JobFormData } from '@/services/coverLetter/types';

export const useLetterGeneration = (user: User | null) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMountedRef = useRef(true);

  const generateLetter = useCallback(async (jobData: JobFormData) => {
    if (!user) {
      toast({
        title: "Login krævet",
        description: "Du skal være logget ind for at generere en ansøgning",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await handleLetterGeneration(jobData, user);
      
      if (isMountedRef.current) {
        setStep(2);
        toast({
          title: "Success",
          description: "Din ansøgning er genereret",
        });
        return result;
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Der opstod en fejl');
        toast({
          title: "Fejl",
          description: err instanceof Error ? err.message : 'Der opstod en fejl',
          variant: "destructive"
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [user, toast]);

  return {
    step,
    setStep,
    isLoading,
    error,
    generateLetter,
  };
};
