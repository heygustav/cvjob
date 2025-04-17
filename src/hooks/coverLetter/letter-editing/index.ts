
import { useState, useCallback } from "react";
import { User, CoverLetter } from "@/lib/types";
import { saveCoverLetter } from "@/services/coverLetter/database";
import { saveOrUpdateJob } from "@/services/coverLetter/database";
import { JobFormData } from "@/services/coverLetter/types";
import { GenerationProgress } from "../types";
import { useToastAdapter } from "@/hooks/shared/useToastAdapter";

export const useLetterEditing = (
  user: User | null,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  setLoadingState: React.Dispatch<React.SetStateAction<string>>,
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>,
  generatedLetter: CoverLetter | null
) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToastAdapter();

  // Reset any error state and loading state
  const resetError = useCallback(() => {
    if (isMountedRef.current) {
      console.log("Resetting error and loading state");
      safeSetState(setLoadingState, "idle");
      
      // If in loading state, reset progress
      safeSetState(setGenerationProgress, {
        phase: 'job-save',
        progress: 0,
        message: 'Forbereder...'
      });
    }
  }, [isMountedRef, safeSetState, setLoadingState, setGenerationProgress]);

  // Function to edit the generated letter content
  const handleEditLetter = useCallback(async (editedContent: string) => {
    if (!user || !generatedLetter) {
      console.error("Cannot edit letter: Missing user or letter data");
      return;
    }

    try {
      setIsSaving(true);

      // Save updated letter content
      const updatedLetter = await saveCoverLetter(
        user.id,
        generatedLetter.job_posting_id,
        editedContent
      );

      if (isMountedRef.current) {
        safeSetState(setGeneratedLetter, updatedLetter);
        toast({
          title: "Ændringer gemt",
          description: "Din redigerede ansøgning er blevet gemt.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error saving edited letter:", error);
      if (isMountedRef.current) {
        toast({
          title: "Fejl ved gemning",
          description: "Der opstod en fejl under gemning af ansøgningen. Prøv igen.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [generatedLetter, isMountedRef, safeSetState, setGeneratedLetter, toast, user]);

  // Save the current letter as is (no edits)
  const handleSaveLetter = useCallback(async () => {
    if (!user || !generatedLetter) {
      console.error("Cannot save letter: Missing user or letter data");
      return;
    }

    try {
      setIsSaving(true);
      const result = await saveCoverLetter(
        user.id,
        generatedLetter.job_posting_id,
        generatedLetter.content
      );

      if (isMountedRef.current) {
        toast({
          title: "Ansøgning gemt",
          description: "Din ansøgning er blevet gemt.",
          variant: "default",
        });
      }

      return result;
    } catch (error) {
      console.error("Error saving letter:", error);
      if (isMountedRef.current) {
        toast({
          title: "Fejl ved gemning",
          description: "Der opstod en fejl under gemning af ansøgningen. Prøv igen.",
          variant: "destructive",
        });
      }
      return null;
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [generatedLetter, isMountedRef, toast, user]);

  // Save job as draft with minimal fields
  const saveJobAsDraft = useCallback(async (jobData: JobFormData): Promise<string | null> => {
    if (!user) {
      console.error("Cannot save job draft: No user found");
      return null;
    }

    try {
      console.log("Saving job draft:", {
        title: jobData.title,
        company: jobData.company
      });
      
      const jobId = await saveOrUpdateJob(
        jobData,
        user.id,
        jobData.id as string | undefined
      );

      if (isMountedRef.current) {
        toast({
          title: "Jobopslag gemt som kladde",
          description: "Jobdetaljer er blevet gemt, og du kan vende tilbage til dem senere.",
          variant: "default",
        });
      }

      return jobId;
    } catch (error) {
      console.error("Error saving job draft:", error);
      if (isMountedRef.current) {
        toast({
          title: "Fejl ved gemning",
          description: "Der opstod en fejl under gemning af jobdetaljerne. Prøv igen.",
          variant: "destructive",
        });
      }
      return null;
    }
  }, [isMountedRef, toast, user]);

  return {
    handleEditLetter,
    handleSaveLetter,
    saveJobAsDraft,
    resetError,
    isSaving
  };
};
