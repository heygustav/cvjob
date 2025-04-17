
import { useCallback } from "react";
import { User, CoverLetter } from "@/lib/types";
import { editCoverLetter, saveOrUpdateJob } from "@/services/coverLetter/database";
import { JobFormData } from "@/services/coverLetter/types";
import { useToastMessages } from "../useToastMessages";
import { GenerationProgress } from "../types";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";

export const useLetterEditingLogic = (
  user: User | null,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>,
  generatedLetter: CoverLetter | null
) => {
  const { toast } = useToastAdapter();
  const toastMessages = useToastMessages();

  // Handle letter edits
  const handleEditLetter = useCallback(async (updatedContent: string): Promise<void> => {
    if (!user || !generatedLetter) {
      console.error("Cannot edit letter: No user or letter");
      return;
    }

    if (!isMountedRef.current) return;

    safeSetState(setLoadingState, "saving");
    safeSetState(setGenerationProgress, {
      phase: 'letter-save',
      progress: 50,
      message: 'Gemmer ændringer...'
    });

    try {
      const updatedLetter = await editCoverLetter(user.id, generatedLetter.id, updatedContent);
      
      if (!isMountedRef.current) return;
      
      if (updatedLetter) {
        safeSetState(setGeneratedLetter, updatedLetter);
        toast(toastMessages.letterUpdated);
      }
    } catch (error) {
      console.error("Error editing letter:", error);
      toast(toastMessages.networkError);
    } finally {
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
        safeSetState(setGenerationProgress, {
          phase: 'letter-save',
          progress: 100,
          message: 'Færdig!'
        });
      }
    }
  }, [user, generatedLetter, isMountedRef, safeSetState, setLoadingState, setGeneratedLetter, setGenerationProgress, toast, toastMessages]);

  // Handle save letter (actual save functionality would be implemented elsewhere)
  const handleSaveLetter = useCallback((): void => {
    if (!generatedLetter) return;
    toast(toastMessages.letterSaved);
  }, [generatedLetter, toast, toastMessages]);

  // Save job as draft
  const saveJobAsDraft = useCallback(async (jobData: JobFormData): Promise<string | null> => {
    if (!user) {
      console.error("Cannot save job: No authenticated user");
      toast(toastMessages.loginRequired);
      return null;
    }

    if (!isMountedRef.current) return null;

    safeSetState(setLoadingState, "saving");
    safeSetState(setGenerationProgress, {
      phase: 'job-save',
      progress: 50,
      message: 'Gemmer job kladde...'
    });

    try {
      const jobId = await saveOrUpdateJob(jobData, user.id, jobData.id);
      
      if (!isMountedRef.current) return null;
      
      toast({
        title: "Job gemt",
        description: "Jobbet er gemt som kladde.",
      });
      
      return jobId;
    } catch (error) {
      console.error("Error saving job:", error);
      toast(toastMessages.networkError);
      return null;
    } finally {
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
        safeSetState(setGenerationProgress, {
          phase: 'job-save',
          progress: 100,
          message: 'Færdig!'
        });
      }
    }
  }, [user, isMountedRef, safeSetState, setLoadingState, setGenerationProgress, toast, toastMessages]);

  // Reset error
  const resetError = useCallback((): void => {
    // This function is intentionally minimal as it gets passed to other components
  }, []);

  return {
    handleEditLetter,
    handleSaveLetter,
    saveJobAsDraft,
    resetError
  };
};
