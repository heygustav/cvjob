
import { useCallback } from "react";
import { CoverLetter, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { updateLetterContent } from "@/services/coverLetter/database";
import { useNavigate } from "react-router-dom";
import { useToastMessages } from "./useToastMessages";
import { useNetworkUtils } from "./useNetworkUtils";

export const useLetterEditing = (
  user: User | null,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<any>>,
  generatedLetter: CoverLetter | null
) => {
  const { toast } = useToast();
  const toastMessages = useToastMessages();
  const navigate = useNavigate();
  const { fetchWithTimeout } = useNetworkUtils();

  const handleEditLetter = useCallback(async (updatedContent: string) => {
    if (!generatedLetter || !user || !isMountedRef.current) return;

    try {
      safeSetState(setLoadingState, "saving");
      safeSetState(setGenerationProgress, {
        phase: 'letter-save',
        progress: 50,
        message: 'Gemmer ændringer...'
      });
      
      await fetchWithTimeout(updateLetterContent(generatedLetter.id, updatedContent));

      if (!isMountedRef.current) return;
      
      safeSetState(setGeneratedLetter, {
        ...generatedLetter,
        content: updatedContent
      });

      safeSetState(setGenerationProgress, {
        phase: 'letter-save',
        progress: 100,
        message: 'Ændringer gemt!'
      });

      toast(toastMessages.letterUpdated);
    } catch (error) {
      console.error('Error updating letter:', error);
      
      if (!isMountedRef.current) return;
      
      const isNetworkError = !navigator.onLine || 
        (error instanceof Error && error.message.includes('forbindelse'));
      
      toast({
        title: "Fejl ved opdatering",
        description: isNetworkError 
          ? "Kontroller din internetforbindelse og prøv igen."
          : "Der opstod en fejl under opdatering af ansøgningen.",
        variant: "destructive",
      });
    } finally {
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
      }
    }
  }, [generatedLetter, toast, toastMessages, user, fetchWithTimeout, isMountedRef, safeSetState, setGeneratedLetter, setGenerationProgress, setLoadingState]);

  const handleSaveLetter = useCallback(() => {
    navigate("/dashboard");
    toast(toastMessages.letterSaved);
  }, [navigate, toast, toastMessages]);

  const resetError = useCallback(() => {
    if (isMountedRef.current) {
      safeSetState(setGeneratedLetter, null);
      safeSetState(setGenerationProgress, {
        phase: 'job-save',
        progress: 0,
        message: 'Forbereder...'
      });
    }
  }, [isMountedRef, safeSetState, setGeneratedLetter, setGenerationProgress]);

  return {
    handleEditLetter,
    handleSaveLetter,
    resetError
  };
};
