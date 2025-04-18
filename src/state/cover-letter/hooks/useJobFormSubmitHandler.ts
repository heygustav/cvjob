
import { useCallback } from 'react';
import { JobFormData } from '@/services/coverLetter/types';
import { useToast } from '@/hooks/use-toast';
import { useCoverLetterActions, useCoverLetterState } from '../CoverLetterContext';
import { showErrorToast } from '@/utils/errorHandling';

/**
 * Hook that handles job form submission and letter generation
 */
export const useJobFormSubmitHandler = () => {
  const { 
    user, 
    jobData: existingJobData 
  } = useCoverLetterState();
  
  const { 
    setLoadingState, 
    setSelectedJob, 
    setGeneratedLetter,
    setStep,
    setGenerationProgress,
    setGenerationPhase
  } = useCoverLetterActions();
  
  const { toast } = useToast();

  const handleSubmit = useCallback(async (formData: JobFormData) => {
    try {
      // Start the generation process
      setLoadingState('generating');
      setGenerationPhase('start');
      setGenerationProgress({
        phase: 'job-save',
        progress: 10,
        message: 'Starter generering...'
      });
      
      // Merge with existing data if available
      const jobData = {
        ...existingJobData,
        ...formData
      };
      
      // Simulate API call - in a real app you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update progress
      setGenerationProgress({
        phase: 'job-save',
        progress: 40,
        message: 'Gemmer jobdata...'
      });
      
      // Create a job object
      const job = {
        id: jobData.id || Date.now().toString(),
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        contact_person: jobData.contact_person || '',
        url: jobData.url || '',
        deadline: jobData.deadline || '',
        user_id: user?.id || 'anonymous',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Update progress
      setGenerationProgress({
        phase: 'letter-generation',
        progress: 60,
        message: 'Genererer ansøgning...'
      });
      
      // Simulate more processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a letter object
      const letter = {
        id: Date.now().toString(),
        content: `Dette er en ansøgning til stillingen ${jobData.title} hos ${jobData.company}.\n\nKære HR-afdeling,\n\nJeg skriver for at ansøge om stillingen som ${jobData.title}. Med min erfaring og kompetencer er jeg sikker på, at jeg vil være et godt match for jeres team.\n\nMed venlig hilsen,\n[Dit navn]`,
        job_posting_id: job.id,
        user_id: user?.id || 'anonymous',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Update state
      setSelectedJob(job);
      setGeneratedLetter(letter);
      
      // Update progress
      setGenerationProgress({
        phase: 'complete',
        progress: 100,
        message: 'Ansøgning klar!'
      });
      
      // Move to next step
      setStep(2);
      
      // Reset loading state
      setLoadingState('idle');
      
      // Show success toast
      toast({
        title: 'Ansøgning genereret',
        description: 'Din ansøgning er klar til gennemsyn.',
      });
      
    } catch (error) {
      console.error('Error generating letter:', error);
      showErrorToast(error);
      setLoadingState('idle');
    }
  }, [
    user, 
    existingJobData, 
    setLoadingState, 
    setGenerationPhase, 
    setGenerationProgress, 
    setSelectedJob, 
    setGeneratedLetter, 
    setStep,
    toast
  ]);

  return {
    handleSubmit
  };
};
