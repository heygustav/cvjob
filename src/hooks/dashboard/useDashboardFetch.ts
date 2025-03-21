
import { useState, useEffect } from "react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for fetching dashboard data (jobs and cover letters)
 */
export const useDashboardFetch = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchData = async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setIsRefreshing(true);
      }
      
      // Get user ID from session
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      // Fetch job postings
      const { data: jobData, error: jobError } = await supabase
        .from("job_postings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (jobError) throw jobError;
      
      // Fetch cover letters
      const { data: letterData, error: letterError } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (letterError) throw letterError;
      
      setJobPostings(jobData || []);
      setCoverLetters(letterData || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      toast({
        title: "Fejl ved indlæsning",
        description: "Der opstod en fejl ved indlæsning af data. Prøv igen senere.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (showRefreshingState) {
        setIsRefreshing(false);
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Function to manually refresh data
  const refreshData = () => fetchData(true);

  return {
    jobPostings,
    coverLetters,
    isLoading,
    isRefreshing,
    error,
    refreshData,
    setJobPostings,
    setCoverLetters
  };
};
