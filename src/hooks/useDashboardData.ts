
import { useState, useEffect, useCallback } from "react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export const useDashboardData = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchJobPostings = useCallback(async () => {
    if (!user?.id) {
      console.log("No user ID available for fetching job postings");
      return;
    }

    try {
      console.log("Fetching job postings for user:", user.id);
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching job postings:", fetchError);
        throw fetchError;
      }

      console.log(`Fetched ${data?.length || 0} job postings`);
      setJobPostings(data || []);
    } catch (error) {
      console.error("Error fetching job postings:", error);
      setError("Der opstod en fejl under indlæsning af jobopslag.");
      toast({
        title: "Fejl ved indlæsning",
        description: "Der opstod en fejl under indlæsning af jobopslag.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  const fetchCoverLetters = useCallback(async () => {
    if (!user?.id) {
      console.log("No user ID available for fetching cover letters");
      return;
    }

    try {
      console.log("Fetching cover letters for user:", user.id);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching cover letters:", fetchError);
        throw fetchError;
      }

      console.log(`Fetched ${data?.length || 0} cover letters`);
      setCoverLetters(data || []);
    } catch (error) {
      console.error("Error fetching cover letters:", error);
      setError("Der opstod en fejl under indlæsning af ansøgninger.");
      toast({
        title: "Fejl ved indlæsning",
        description: "Der opstod en fejl under indlæsning af ansøgninger.",
        variant: "destructive",
      });
    }
  }, [user?.id, toast]);

  useEffect(() => {
    if (user) {
      fetchJobPostings();
      fetchCoverLetters();
    }
  }, [user, fetchJobPostings, fetchCoverLetters]);

  // Updated function to handle deletion
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

  const deleteCoverLetter = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("cover_letters")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCoverLetters(coverLetters.filter(letter => letter.id !== id));

      toast({
        title: "Ansøgning slettet",
        description: "Ansøgningen er blevet slettet.",
      });
    } catch (error) {
      console.error("Error deleting cover letter:", error);
      toast({
        title: "Fejl ved sletning",
        description: "Der opstod en fejl under sletning af ansøgningen.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      await Promise.all([fetchJobPostings(), fetchCoverLetters()]);
      toast({
        title: "Opdateret",
        description: "Dine data er blevet opdateret.",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError("Der opstod en fejl under opdatering af data.");
      toast({
        title: "Fejl ved opdatering",
        description: "Der opstod en fejl under opdatering af data.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Find job for letter with error handling
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
    jobPostings,
    coverLetters,
    isLoading,
    isDeleting,
    isRefreshing,
    error,
    deleteJobPosting,
    deleteCoverLetter,
    refreshData,
    findJobForLetter
  };
};
