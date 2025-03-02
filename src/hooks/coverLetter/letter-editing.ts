import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CoverLetter, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { updateLetterContent } from "@/services/coverLetter/letterOperations";
import { saveOrUpdateJob } from "@/services/coverLetter/jobOperations";
import { supabase } from "@/integrations/supabase/client";

export const useLetterEditing = (
  user: User | null,
  isMountedRef: React.MutableRefObject<boolean>,
  safeSetState: <T,>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void,
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>,
  setLoadingState: React.Dispatch<React.SetStateAction<"idle" | "initializing" | "generating" | "saving">>,
  setGenerationProgress: (progress: any) => void,
  generatedLetter: CoverLetter | null
) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditLetter = async (updatedContent: string) => {
    if (!user) {
      toast({
        title: "Ikke logget ind",
        description: "Du skal være logget ind for at redigere ansøgningen.",
        variant: "destructive",
      });
      return;
    }

    if (!generatedLetter) {
      toast({
        title: "Ingen ansøgning",
        description: "Der er ingen ansøgning at redigere.",
        variant: "destructive",
      });
      return;
    }

    try {
      safeSetState(setLoadingState, "saving");
      setIsEditing(true);
      
      await updateLetterContent(generatedLetter.id, updatedContent);
      
      if (isMountedRef.current) {
        safeSetState(setGeneratedLetter, {
          ...generatedLetter,
          content: updatedContent,
          updated_at: new Date().toISOString(),
        });
        
        toast({
          title: "Ansøgning opdateret",
          description: "Din ansøgning er blevet opdateret.",
        });
      }
    } catch (error) {
      console.error("Error updating letter:", error);
      
      if (isMountedRef.current) {
        toast({
          title: "Fejl ved opdatering",
          description: "Der opstod en fejl ved opdatering af ansøgningen.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        safeSetState(setLoadingState, "idle");
        setIsEditing(false);
      }
    }
  };

  const handleSaveLetter = async () => {
    // This function is kept for backward compatibility
    // It was previously used to save letters but that functionality
    // has been moved elsewhere in the application
    console.log("handleSaveLetter called - this is a no-op function now");
  };

  const saveJobAsDraft = async (jobData: JobFormData): Promise<void> => {
    if (!user) {
      throw new Error("Du skal være logget ind for at gemme jobbet som kladde.");
    }

    try {
      const jobId = await saveOrUpdateJob(jobData, user.id);
      
      // Update the last updated timestamp
      await supabase
        .from("job_postings")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", jobId);
        
      return;
    } catch (error) {
      console.error("Error saving job as draft:", error);
      throw new Error("Der opstod en fejl ved at gemme jobbet som kladde.");
    }
  };

  const resetError = () => {
    if (isMountedRef.current) {
      safeSetState(setGenerationProgress, {
        phase: 'job-save',
        progress: 0,
        message: 'Forbereder...'
      });
    }
  };

  return {
    handleEditLetter,
    handleSaveLetter,
    saveJobAsDraft,
    resetError
  };
};
