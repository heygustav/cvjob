
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCoverLetterActions, useCoverLetterState } from '../CoverLetterContext';
import { showErrorToast } from '@/utils/errorHandling';

/**
 * Hook for handling letter content editing
 */
export const useEditLetterHandler = () => {
  const { generatedLetter } = useCoverLetterState();
  const { setGeneratedLetter, setLoadingState } = useCoverLetterActions();
  const { toast } = useToast();

  const handleEdit = useCallback(async (content: string) => {
    if (!generatedLetter) {
      toast({
        title: 'Fejl',
        description: 'Ingen ansøgning at redigere',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoadingState('saving');
      
      // In a real app, you would call your API here to save the content
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the letter with new content
      setGeneratedLetter({
        ...generatedLetter,
        content,
        updated_at: new Date().toISOString()
      });
      
      setLoadingState('idle');
      
      toast({
        title: 'Ændringer gemt',
        description: 'Din redigerede ansøgning er blevet gemt.'
      });
      
    } catch (error) {
      console.error('Error saving edited letter:', error);
      showErrorToast(error);
      setLoadingState('idle');
    }
  }, [generatedLetter, setGeneratedLetter, setLoadingState, toast]);

  return {
    handleEdit
  };
};
