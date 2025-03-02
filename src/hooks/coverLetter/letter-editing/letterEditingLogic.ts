
import { CoverLetter } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";

export const handleEditLetterLogic = async (
  userId: string,
  letterId: string,
  updatedContent: string,
  fetchWithTimeout: <T>(promise: Promise<T>) => Promise<T>,
  editCoverLetter: (userId: string, letterId: string, content: string) => Promise<CoverLetter>
): Promise<CoverLetter | null> => {
  try {
    console.log(`Editing letter ${letterId} for user ${userId}`);
    
    // Try regular call first
    let updatedLetter;
    try {
      updatedLetter = await editCoverLetter(userId, letterId, updatedContent);
    } catch (directError) {
      console.warn("Direct edit failed, retrying with timeout:", directError);
      // Fallback to timeout version
      updatedLetter = await fetchWithTimeout(editCoverLetter(userId, letterId, updatedContent));
    }
    
    console.log("Letter updated successfully");
    return updatedLetter;
  } catch (error) {
    console.error("Error in handleEditLetterLogic:", error);
    throw error;
  }
};

export const handleSaveLetterLogic = (
  toast: any
) => {
  // Simply show a toast to confirm the letter is already saved
  toast({
    title: "Ansøgning gemt",
    description: "Din ansøgning er allerede automatisk gemt.",
  });
};

export const saveJobAsDraftLogic = async (
  jobData: JobFormData,
  userId: string,
  toast: any,
  saveOrUpdateJob: (jobData: JobFormData, userId: string, existingJobId?: string) => Promise<string>
): Promise<string | null> => {
  try {
    console.log("Saving job as draft for user:", userId);
    const jobId = await saveOrUpdateJob(jobData, userId);
    
    toast({
      title: "Job gemt som kladde",
      description: "Dit job er blevet gemt som kladde til senere brug.",
    });
    
    return jobId;
  } catch (error) {
    console.error("Error in saveJobAsDraftLogic:", error);
    throw error;
  }
};
