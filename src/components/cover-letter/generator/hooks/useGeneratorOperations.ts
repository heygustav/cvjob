
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { JobFormData } from '@/services/coverLetter/types';
import { CoverLetter } from '@/lib/types';
import { useGeneratorContext } from '../context/GeneratorContext';

export const useGeneratorOperations = () => {
  const { state, dispatch } = useGeneratorContext();
  const { toast } = useToast();
  const { completeUser } = state;

  const setStep = useCallback((step: 1 | 2) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, [dispatch]);

  const setJobData = useCallback((jobData: JobFormData) => {
    dispatch({ type: 'SET_JOB_DATA', payload: jobData });
  }, [dispatch]);

  const setGeneratedLetter = useCallback((letter: CoverLetter | null) => {
    dispatch({ type: 'SET_GENERATED_LETTER', payload: letter });
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch({ type: 'RESET_ERROR' });
  }, [dispatch]);

  const handleGenerateLetter = useCallback(async (data: JobFormData) => {
    dispatch({ type: 'SET_IS_GENERATING', payload: true });
    dispatch({ type: 'SET_LOADING_STATE', payload: 'generating' });
    dispatch({ type: 'SET_JOB_DATA', payload: data });
    
    try {
      // Simulate the letter generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update job data
      if (data.id) {
        dispatch({
          type: 'SET_SELECTED_JOB',
          payload: {
            id: data.id,
            user_id: completeUser?.id || "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            title: data.title || "",
            company: data.company || "",
            description: data.description || "",
            contact_person: data.contact_person || "",
            url: data.url || "",
            deadline: data.deadline || ""
          }
        });
      }
      
      // Create a mock letter
      const letter: CoverLetter = {
        id: Math.random().toString(36).substring(2, 15),
        user_id: completeUser?.id || "",
        job_posting_id: data.id || Math.random().toString(36).substring(2, 15),
        content: `Kære HR,\n\nJeg ansøger hermed om stillingen som ${data.title} hos ${data.company}.\n\nMed venlig hilsen,\n${completeUser?.name || ""}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      dispatch({ type: 'SET_GENERATED_LETTER', payload: letter });
      dispatch({ type: 'SET_STEP', payload: 2 });
      
      toast({
        title: "Ansøgning genereret",
        description: "Din ansøgning er nu klar til gennemsyn.",
      });
    } catch (err) {
      console.error("Error generating letter:", err);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err instanceof Error ? err.message : "Der opstod en fejl" 
      });
      
      toast({
        title: "Fejl ved generering",
        description: err instanceof Error ? err.message : "Der opstod en fejl ved generering af ansøgningen",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_IS_GENERATING', payload: false });
      dispatch({ type: 'SET_LOADING_STATE', payload: 'idle' });
    }
  }, [completeUser, dispatch, toast]);

  const handleEditContent = useCallback(async (content: string): Promise<void> => {
    dispatch({ type: 'SET_IS_GENERATING', payload: true });
    
    try {
      // Simulate API call to update letter content
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update letter locally
      if (state.generatedLetter) {
        dispatch({ 
          type: 'SET_GENERATED_LETTER', 
          payload: {
            ...state.generatedLetter,
            content,
            updated_at: new Date().toISOString()
          }
        });
      }
      
      toast({
        title: "Ansøgning opdateret",
        description: "Dine ændringer er blevet gemt.",
      });
    } catch (err) {
      console.error("Error editing letter:", err);
      
      toast({
        title: "Fejl ved opdatering",
        description: err instanceof Error ? err.message : "Der opstod en fejl ved opdatering af ansøgningen",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_IS_GENERATING', payload: false });
    }
  }, [dispatch, state.generatedLetter, toast]);

  return {
    setStep,
    setJobData,
    setGeneratedLetter,
    resetError,
    handleGenerateLetter,
    handleEditContent
  };
};
