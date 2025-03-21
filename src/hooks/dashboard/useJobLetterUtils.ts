
import { JobPosting } from "@/lib/types";

/**
 * Hook for utility functions related to jobs and letters
 */
export const useJobLetterUtils = (jobPostings: JobPosting[]) => {
  /**
   * Find job for letter with error handling
   */
  const findJobForLetter = (jobPostingId: string) => {
    try {
      const job = jobPostings.find(job => job.id === jobPostingId);
      
      // If job not found, return null
      if (!job) return null;
      
      // Ensure the job has all required fields even if incomplete
      return {
        ...job,
        title: job.title || "Untitled Position",
        company: job.company || "Unknown Company",
        description: job.description || "No description provided"
      };
    } catch (err) {
      console.error("Error finding job for letter:", err);
      return null;
    }
  };

  return {
    findJobForLetter
  };
};
