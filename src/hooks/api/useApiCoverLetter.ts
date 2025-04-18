
/**
 * API-hooks for cover letter-relaterede operationer
 * Ansvarlig for al kommunikation med eksterne services og APIs
 */

import { CoverLetter, JobPosting, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { useCallback } from "react";
import { fetchLetterById, fetchJobById, editCoverLetter, saveOrUpdateJob } from "@/services/coverLetter/database";
import { useNetworkHelpers } from "../shared/useNetworkHelpers";

/**
 * Hook til at håndtere API-kald for cover letters
 */
export const useApiCoverLetter = (user: User | null) => {
  const { withTimeout } = useNetworkHelpers();
  
  /**
   * Henter et specifikt cover letter baseret på ID
   */
  const fetchLetter = useCallback(async (id: string): Promise<CoverLetter | null> => {
    if (!user) return null;
    
    try {
      let letter;
      try {
        letter = await fetchLetterById(id);
      } catch (directError) {
        console.warn("Direct letter fetch failed, retrying with timeout:", directError);
        letter = await withTimeout(() => fetchLetterById(id));
      }
      
      if (!letter) {
        throw new Error("Letter not found");
      }
      
      return letter;
    } catch (error) {
      console.error("Error fetching letter:", error);
      throw error;
    }
  }, [user, withTimeout]);

  /**
   * Henter et specifikt job baseret på ID
   */
  const fetchJob = useCallback(async (id: string): Promise<JobPosting | null> => {
    if (!user) return null;
    
    try {
      const job = await fetchJobById(id);
      if (!job) {
        throw new Error("Job not found");
      }
      return job;
    } catch (error) {
      console.error("Error fetching job:", error);
      throw error;
    }
  }, [user]);

  /**
   * Opdaterer indholdet i et cover letter
   */
  const updateLetterContent = useCallback(async (
    letterId: string, 
    content: string
  ): Promise<CoverLetter | null> => {
    if (!user) return null;
    
    try {
      const updatedLetter = await editCoverLetter(user.id, letterId, content);
      return updatedLetter;
    } catch (error) {
      console.error("Error updating letter content:", error);
      throw error;
    }
  }, [user]);

  /**
   * Gemmer et job som kladde
   */
  const saveJobDraft = useCallback(async (
    jobData: JobFormData
  ): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const jobId = await saveOrUpdateJob(jobData, user.id, jobData.id);
      return jobId;
    } catch (error) {
      console.error("Error saving job draft:", error);
      throw error;
    }
  }, [user]);

  /**
   * Genererer et cover letter (stub-implementering - bør implementeres fuldt ud)
   */
  const generateLetter = useCallback(async (
    jobData: JobFormData
  ): Promise<{ job: JobPosting, letter: CoverLetter } | null> => {
    if (!user) return null;
    
    try {
      // Dette er en stub-implementering. Den faktiske implementering ville kalde
      // den relevante service til at generere et cover letter.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock implementation for now
      const job: JobPosting = {
        id: jobData.id || Math.random().toString(),
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        contact_person: jobData.contact_person || null,
        url: jobData.url || null,
        deadline: jobData.deadline || null,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const letter: CoverLetter = {
        id: Math.random().toString(),
        content: `Sample cover letter for ${jobData.title} at ${jobData.company}`,
        user_id: user.id,
        job_posting_id: job.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return { job, letter };
    } catch (error) {
      console.error("Error generating letter:", error);
      throw error;
    }
  }, [user]);

  return {
    fetchLetter,
    fetchJob,
    updateLetterContent,
    saveJobDraft,
    generateLetter
  };
};
