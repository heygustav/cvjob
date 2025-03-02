import { useCallback } from "react";
import { User, JobPosting, CoverLetter } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { fetchUserProfile, saveOrUpdateJob, saveCoverLetter, fetchJobById } from "@/services/coverLetter/database";
import { generateCoverLetter } from "@/services/coverLetter/generator";
import { useNetworkUtils } from "./useNetworkUtils";

export const useGenerationSteps = (
  user: User | null,
  isMountedRef: React.MutableRefObject<boolean>,
  updatePhase: (phase: string, progress: number, message: string) => void,
  abortControllerRef: React.MutableRefObject<AbortController | null>
) => {
  const { createError } = useNetworkUtils();

  // Step 1: Fetch user profile
  const fetchUserStep = useCallback(async () => {
    if (!user) throw new Error('No user found');
    
    if (!isMountedRef.current) {
      console.warn("Component unmounted during generation");
      throw new Error('Component unmounted');
    }
    
    updatePhase('user-fetch', 20, 'Henter din profil...');
    console.log("Step 1: Fetching user profile");
    
    try {
      const userInfo = await fetchUserProfile(user.id);
      userInfo.email = user.email; // Ensure email is set from authenticated user
      
      console.log(`User profile fetched for ID: ${user.id}`, {
        hasName: !!userInfo.name,
        hasExperience: !!userInfo.experience,
        hasEducation: !!userInfo.education,
      });
      
      return userInfo;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw createError('user-fetch', 'Kunne ikke hente din profil. Prøv at opdatere siden.');
    }
  }, [user, isMountedRef, updatePhase, createError]);

  // Step 2: Save job details - ensure we handle incomplete data
  const saveJobStep = useCallback(async (jobData: JobFormData, userId: string, existingJobId?: string) => {
    if (!isMountedRef.current) {
      console.warn("Component unmounted before saving job");
      throw new Error('Component unmounted');
    }
    
    updatePhase('job-save', 40, 'Gemmer jobdetaljer...');
    console.log("Step 2: Saving job posting", jobData);
    
    // Provide default values for missing fields to prevent errors
    const safeJobData = {
      ...jobData,
      title: jobData.title || "Untitled Position",
      company: jobData.company || "Unknown Company",
      description: jobData.description || "No description provided",
    };
    
    try {
      const jobId = await saveOrUpdateJob(safeJobData, userId, existingJobId);
      console.log(`Job saved with ID: ${jobId}`);
      return jobId;
    } catch (error) {
      console.error("Error saving job:", error);
      throw createError('job-save', 'Kunne ikke gemme jobdetaljer. Tjek din forbindelse og prøv igen.');
    }
  }, [isMountedRef, updatePhase, createError]);

  // Step 3: Generate letter content - handle incomplete data
  const generateLetterStep = useCallback(async (jobData: JobFormData, userInfo: any) => {
    if (!isMountedRef.current) {
      console.warn("Component unmounted before generating letter");
      throw new Error('Component unmounted');
    }
    
    updatePhase('generation', 60, 'Genererer ansøgning...');
    console.log("Step 3: Generating letter content");
    
    // Provide safe defaults for the AI generation
    const safeJobData = {
      ...jobData,
      title: jobData.title || "Untitled Position",
      company: jobData.company || "Unknown Company",
      description: jobData.description || "No description provided",
    };
    
    try {
      console.log("Calling generateCoverLetter with job data and user info");
      const content = await generateCoverLetter(safeJobData, userInfo);
      console.log("Cover letter generation successful, content length:", content?.length);
      return content;
    } catch (error) {
      console.error("Error generating letter:", error);
      throw createError('generation', 'AI-tjenesten kunne ikke generere din ansøgning. Prøv igen om lidt.', false);
    }
  }, [isMountedRef, updatePhase, createError]);

  // Step 4: Save the generated letter
  const saveLetterStep = useCallback(async (userId: string, jobId: string, content: string) => {
    if (!isMountedRef.current) {
      console.warn("Component unmounted after generating content");
      throw new Error('Component unmounted');
    }
    
    updatePhase('letter-save', 80, 'Gemmer ansøgning...');
    console.log("Step 4: Saving letter");
    
    try {
      const letter = await saveCoverLetter(userId, jobId, content);
      console.log(`Letter saved with ID: ${letter.id}`);
      return letter;
    } catch (error) {
      console.error("Error saving letter:", error);
      throw createError('letter-save', 'Din ansøgning blev genereret, men kunne ikke gemmes. Prøv igen.');
    }
  }, [isMountedRef, updatePhase, createError]);

  // Step 5: Fetch updated job to ensure it has all fields
  const fetchUpdatedJobStep = useCallback(async (jobId: string, jobData: JobFormData, userId: string) => {
    try {
      const updatedJob = await fetchJobById(jobId);
      if (!updatedJob) {
        return { ...jobData, id: jobId, user_id: userId } as JobPosting;
      }
      return updatedJob;
    } catch (error) {
      console.error("Error fetching updated job:", error);
      // Non-critical, use the existing job info
      return { ...jobData, id: jobId, user_id: userId } as JobPosting;
    }
  }, []);

  return {
    fetchUserStep,
    saveJobStep,
    generateLetterStep,
    saveLetterStep,
    fetchUpdatedJobStep
  };
};
