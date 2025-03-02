
import { useCallback } from "react";
import { CoverLetter, User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { editCoverLetter, saveOrUpdateJob } from "@/services/coverLetter/database";
import { useToastMessages } from "../useToastMessages";
import { useNetworkUtils } from "../useNetworkUtils";
import { GenerationProgress } from "../types";
import { 
  handleEditLetterLogic, 
  handleSaveLetterLogic, 
  saveJobAsDraftLogic 
} from "./letterEditingLogic";

export const useLetterEditing = (
  user: User | null,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>,
  generatedLetter: CoverLetter | null
) => {
  const { toast } = useToast();
  const toastMessages = useToastMessages();
  const { fetchWithTimeout } = useNetworkUtils();

  const handleEditLetter = useCallback(async (updatedContent: string) => {
    if (!user || !generatedLetter) {
      console.error("Cannot edit letter: Missing user or letter");
      toast(toastMessages.letterNotFound);
      return;
    }

    try {
      safeSetState(setLoadingState, "saving");
      safeSetState(setGenerationProgress, {
        phase: 'letter-save',
        progress: 50,
        message: 'Gemmer din ansøgning...'
      });

      const updatedLetter = await handleEditLetterLogic(
        user.id,
        generatedLetter.id,
        updatedContent,
        fetchWithTimeout,
        editCoverLetter
      );

      if (!isMountedRef.current) return;

      if (updatedLetter) {
        safeSetState(setGeneratedLetter, updatedLetter);
        toast(toastMessages.letterUpdated);
      }
    } catch (error) {
      console.error("Error editing letter:", error);
      toast({
        title: "Fejl ved redigering",
        description: error instanceof Error ? error.message : "Der opstod en fejl ved redigering af ansøgningen.",
        variant: "destructive",
      });
    } finally {
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
      }
    }
  }, [user, generatedLetter, isMountedRef, safeSetState, setGeneratedLetter, setLoadingState, setGenerationProgress, toast, toastMessages, fetchWithTimeout]);

  const handleSaveLetter = useCallback(() => {
    handleSaveLetterLogic(toast);
  }, [toast]);

  const saveJobAsDraft = useCallback(async (jobData) => {
    if (!user) {
      console.error("Cannot save job: No authenticated user");
      toast(toastMessages.loginRequired);
      return;
    }

    try {
      return await saveJobAsDraftLogic(
        jobData,
        user.id,
        toast,
        saveOrUpdateJob
      );
    } catch (error) {
      console.error("Error saving job as draft:", error);
      toast({
        title: "Fejl ved gem",
        description: error instanceof Error ? error.message : "Der opstod en fejl ved at gemme jobbet som kladde.",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast, toastMessages]);

  const resetError = useCallback(() => {
    // This function is expected to be used to reset any error state
    console.log("Resetting error state");
  }, []);

  return {
    handleEditLetter,
    handleSaveLetter,
    saveJobAsDraft,
    resetError
  };
};
