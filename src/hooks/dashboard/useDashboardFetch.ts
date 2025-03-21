
import { useState, useEffect, useCallback } from "react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for fetching job postings and cover letters
 */
export const useDashboardFetch = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    if (user) {
      fetchJobPostings();
      fetchCoverLetters();
    }
  }, [user, fetchJobPostings, fetchCoverLetters]);

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
