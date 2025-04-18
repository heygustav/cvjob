
/**
 * Business logic hooks for cover letter operations
 * Responsible for implementing business rules and data processing
 */

import { useCallback, useRef } from "react";
import { CoverLetter, JobPosting, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { useApiCoverLetter } from "../api/useApiCoverLetter";
import { useToastAdapter } from "../shared/useToastAdapter";

/**
 * Hook to handle business logic for cover letter generation and management
 */
export const useCoverLetterLogic = (user: User | null) => {
  const api = useApiCoverLetter(user);
  const { toast } = useToastAdapter();
  const generationAttemptRef = useRef(0);
  
  /**
   * Generate a cover letter based on job data
   */
  const generateCoverLetter = useCallback(async (
    jobData: JobFormData,
    onProgress?: (phase: string, progress: number, message: string) => void
  ) => {
    if (!user) {
      toast({
        title: "Login krævet",
        description: "Du skal være logget ind for at generere en ansøgning.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      // Track generation progress
      onProgress?.("job-save", 20, "Forbereder joboplysninger...");
      
      // Increment attempt counter
      generationAttemptRef.current += 1;
      
      // Call API to generate letter
      onProgress?.("generation", 50, "Genererer ansøgning...");
      const result = await api.generateLetter(jobData);
      
      // Handle successful generation
      if (result) {
        onProgress?.("letter-save", 90, "Gemmer ansøgning...");
        
        toast({
          title: "Ansøgning genereret",
          description: "Din ansøgning er nu klar til gennemsyn.",
        });
        
        return result;
      }
      
      return null;
    } catch (error) {
      console.error("Error generating cover letter:", error);
      
      toast({
        title: "Fejl ved generering",
        description: error instanceof Error ? error.message : "Der opstod en fejl ved generering af ansøgningen",
        variant: "destructive"
      });
      
      return null;
    } finally {
      onProgress?.("complete", 100, "Færdig!");
    }
  }, [user, api, toast]);
  
  /**
   * Fetch a specific letter by ID
   */
  const fetchCoverLetter = useCallback(async (
    letterId: string,
    onProgress?: (phase: string, progress: number, message: string) => void
  ) => {
    if (!user) {
      toast({
        title: "Login krævet",
        description: "Du skal være logget ind for at se ansøgninger.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      onProgress?.("letter-fetch", 30, "Henter ansøgning...");
      
      const letter = await api.fetchLetter(letterId);
      let job: JobPosting | null = null;
      
      // If we have a letter, try to fetch the associated job
      if (letter?.job_posting_id) {
        try {
          onProgress?.("job-fetch", 60, "Henter joboplysninger...");
          job = await api.fetchJob(letter.job_posting_id);
        } catch (jobError) {
          console.error("Error fetching job for letter:", jobError);
          // Non-critical error, continue without job
        }
      }
      
      onProgress?.("complete", 100, "Færdig!");
      
      return { letter, job };
    } catch (error) {
      console.error("Error fetching cover letter:", error);
      
      toast({
        title: "Fejl ved hentning",
        description: error instanceof Error ? error.message : "Der opstod en fejl ved hentning af ansøgningen",
        variant: "destructive"
      });
      
      return null;
    }
  }, [user, api, toast]);
  
  /**
   * Edit a cover letter's content
   */
  const editCoverLetter = useCallback(async (
    letterId: string,
    content: string,
    onProgress?: (phase: string, progress: number, message: string) => void
  ) => {
    if (!user) {
      toast({
        title: "Login krævet",
        description: "Du skal være logget ind for at redigere ansøgninger.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      onProgress?.("saving", 50, "Gemmer ændringer...");
      
      const updatedLetter = await api.updateLetterContent(letterId, content);
      
      if (updatedLetter) {
        toast({
          title: "Ansøgning opdateret",
          description: "Dine ændringer er blevet gemt.",
        });
        
        onProgress?.("complete", 100, "Færdig!");
        return updatedLetter;
      }
      
      return null;
    } catch (error) {
      console.error("Error editing cover letter:", error);
      
      toast({
        title: "Fejl ved opdatering",
        description: error instanceof Error ? error.message : "Der opstod en fejl ved opdatering af ansøgningen",
        variant: "destructive"
      });
      
      return null;
    }
  }, [user, api, toast]);
  
  /**
   * Save a job as draft
   */
  const saveJobAsDraft = useCallback(async (
    jobData: JobFormData,
    onProgress?: (phase: string, progress: number, message: string) => void
  ) => {
    if (!user) {
      toast({
        title: "Login krævet",
        description: "Du skal være logget ind for at gemme job.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      onProgress?.("saving", 50, "Gemmer job som kladde...");
      
      const jobId = await api.saveJobDraft(jobData);
      
      if (jobId) {
        toast({
          title: "Job gemt",
          description: "Jobbet er gemt som kladde.",
        });
        
        onProgress?.("complete", 100, "Færdig!");
        return jobId;
      }
      
      return null;
    } catch (error) {
      console.error("Error saving job as draft:", error);
      
      toast({
        title: "Fejl ved gem",
        description: error instanceof Error ? error.message : "Der opstod en fejl ved at gemme jobbet",
        variant: "destructive"
      });
      
      return null;
    }
  }, [user, api, toast]);
  
  return {
    generateCoverLetter,
    fetchCoverLetter,
    editCoverLetter,
    saveJobAsDraft
  };
};
