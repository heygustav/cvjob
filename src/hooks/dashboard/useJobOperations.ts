
import { useState } from "react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for job posting operations (delete)
 */
export const useJobOperations = (
  jobPostings: JobPosting[],
  coverLetters: CoverLetter[],
  setJobPostings: (jobs: JobPosting[]) => void,
  setCoverLetters: (letters: CoverLetter[]) => void
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const deleteJobPosting = async (id: string) => {
    try {
      setIsDeleting(true);
      
      // First check if job has any cover letters
      const jobLetters = coverLetters.filter(letter => letter.job_posting_id === id);
      
      if (jobLetters.length > 0) {
        // If there are cover letters, delete them first
        for (const letter of jobLetters) {
          const { error: deleteLetterError } = await supabase
            .from("cover_letters")
            .delete()
            .eq("id", letter.id);
          
          if (deleteLetterError) {
            console.error("Error deleting cover letter:", deleteLetterError);
            throw deleteLetterError;
          }
        }
        
        // Update cover letters state
        setCoverLetters(coverLetters.filter(letter => letter.job_posting_id !== id));
      }
      
      // Then delete the job posting
      const { error } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setJobPostings(jobPostings.filter(job => job.id !== id));

      toast({
        title: "Jobopslag slettet",
        description: "Jobopslaget er blevet slettet.",
      });
    } catch (error) {
      console.error("Error deleting job posting:", error);
      toast({
        title: "Fejl ved sletning",
        description: "Der opstod en fejl under sletning af jobopslaget.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteJobPosting
  };
};
