
import { useState, useEffect, useCallback, useRef } from "react";
import { JobPosting, CoverLetter } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define a cache interface for memoization
interface DataCache {
  timestamp: number;
  jobPostings: JobPosting[];
  coverLetters: CoverLetter[];
}

/**
 * Hook for fetching dashboard data (jobs and cover letters) with optimizations:
 * - Debounced fetching to prevent rapid successive calls
 * - Cache for preventing duplicate fetches in short time periods
 * - Better error handling with structured errors
 */
export const useDashboardFetch = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Use a ref for caching data to avoid unnecessary re-renders
  const cacheRef = useRef<DataCache | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Cache expiration time in milliseconds (5 minutes)
  const CACHE_EXPIRATION = 5 * 60 * 1000;
  
  // Clean up function to abort any pending requests
  const cleanupRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);
  
  const fetchData = useCallback(async (showRefreshingState = false, bypassCache = false) => {
    try {
      // Clean up any pending requests
      cleanupRequests();
      
      // Create a new abort controller for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      
      if (showRefreshingState) {
        setIsRefreshing(true);
      }
      
      // Check if we have valid cached data and not forcing refresh
      const now = Date.now();
      if (
        !bypassCache && 
        cacheRef.current && 
        now - cacheRef.current.timestamp < CACHE_EXPIRATION
      ) {
        setJobPostings(cacheRef.current.jobPostings);
        setCoverLetters(cacheRef.current.coverLetters);
        setError(null);
        setIsLoading(false);
        if (showRefreshingState) {
          setIsRefreshing(false);
        }
        return;
      }
      
      // Check for offline status
      if (!navigator.onLine) {
        throw new Error("Du er offline. Tjek din internetforbindelse og prøv igen.");
      }
      
      // Get user ID from session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      // Set up timeout for requests
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Forespørgslen tog for lang tid. Prøv igen senere.")), 20000);
      });
      
      // Use Promise.all for parallel requests - more efficient
      const dataPromise = Promise.all([
        // Fetch job postings with specific columns that exist in the database
        supabase
          .from("job_postings")
          .select("id, title, company, description, contact_person, deadline, created_at, updated_at, url, user_id")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
          
        // Fetch cover letters with specific columns
        supabase
          .from("cover_letters")
          .select("id, content, job_posting_id, created_at, updated_at, user_id")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
      ]);
      
      // Race the data promise against the timeout
      const [jobResponse, letterResponse] = await Promise.race([dataPromise, timeoutPromise]) as [any, any];
      
      if (signal.aborted) {
        // Request was aborted, don't update state
        return;
      }
      
      if (jobResponse.error) throw new Error(`Job data error: ${jobResponse.error.message}`);
      if (letterResponse.error) throw new Error(`Letter data error: ${letterResponse.error.message}`);
      
      const jobData = jobResponse.data || [];
      const letterData = letterResponse.data || [];
      
      // Update the cache
      cacheRef.current = {
        timestamp: now,
        jobPostings: jobData,
        coverLetters: letterData
      };
      
      setJobPostings(jobData);
      setCoverLetters(letterData);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      
      // Don't update state if the request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      // Create more user-friendly error messages based on error type
      let errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      let error = err instanceof Error ? err : new Error(errorMessage);
      
      // Check for network errors
      if (!navigator.onLine) {
        errorMessage = "Du er offline. Tjek din internetforbindelse og prøv igen.";
        error = new Error(errorMessage);
      } else if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
        errorMessage = "Forbindelsen til serveren tog for lang tid. Prøv igen senere.";
        error = new Error(errorMessage);
      } else if (errorMessage.includes("fetch")) {
        errorMessage = "Kunne ikke oprette forbindelse til serveren. Tjek din internetforbindelse og prøv igen.";
        error = new Error(errorMessage);
      }
      
      setError(error);
      
      // Show toast with user-friendly message
      toast({
        title: "Fejl ved indlæsning",
        description: errorMessage,
        variant: "destructive",
      });
      
      // If we have cached data, use it as a fallback
      if (cacheRef.current) {
        console.log("Using cached data as fallback due to fetch error");
        setJobPostings(cacheRef.current.jobPostings);
        setCoverLetters(cacheRef.current.coverLetters);
      }
    } finally {
      setIsLoading(false);
      if (showRefreshingState) {
        setIsRefreshing(false);
      }
      
      // Clear the abort controller
      abortControllerRef.current = null;
    }
  }, [toast, cleanupRequests]);

  // Initial data fetch with debounce
  useEffect(() => {
    // Debounce initial load by 100ms to prevent multiple rapid fetches
    debounceTimerRef.current = window.setTimeout(() => {
      fetchData();
    }, 100);
    
    return () => {
      cleanupRequests();
    };
  }, [fetchData, cleanupRequests]);

  // Add network status listener
  useEffect(() => {
    const handleOnline = () => {
      console.log("Network is back online, refreshing data");
      
      // Show toast notification
      toast({
        title: "Forbindelse genetableret",
        description: "Du er online igen. Data opdateres.",
      });
      
      // Refresh data after a short delay to ensure connection is stable
      setTimeout(() => fetchData(true, true), 1000);
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [fetchData, toast]);

  // Function to manually refresh data - bypass cache
  const refreshData = useCallback(() => fetchData(true, true), [fetchData]);

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
