
import { useState, useEffect, useCallback, useRef } from "react";
import { JobPosting, CoverLetter, Company } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define a cache interface for memoization
interface DataCache {
  timestamp: number;
  jobPostings: JobPosting[];
  coverLetters: CoverLetter[];
  companies: Company[];
}

// Centralized state interface for better type safety
interface DashboardState {
  jobPostings: JobPosting[];
  coverLetters: CoverLetter[];
  companies: Company[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
}

// Define cache constants
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes
const DEBOUNCE_DELAY = 100; // 100ms

/**
 * Hook for fetching dashboard data (jobs, cover letters, and companies) with optimizations:
 * - Debounced fetching to prevent rapid successive calls
 * - Cache for preventing duplicate fetches in short time periods
 * - Unified state management
 */
export const useDashboardFetch = () => {
  // State using a single state object for related data
  const [state, setState] = useState<DashboardState>({
    jobPostings: [],
    coverLetters: [],
    companies: [],
    isLoading: true,
    isRefreshing: false,
    error: null
  });
  
  const { toast } = useToast();
  
  // Use refs for values that shouldn't trigger re-renders
  const cacheRef = useRef<DataCache | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  
  // Setters for individual properties
  const setJobPostings = useCallback((jobPostings: JobPosting[]) => {
    setState(prev => ({ ...prev, jobPostings }));
  }, []);
  
  const setCoverLetters = useCallback((coverLetters: CoverLetter[]) => {
    setState(prev => ({ ...prev, coverLetters }));
  }, []);
  
  const setCompanies = useCallback((companies: Company[]) => {
    setState(prev => ({ ...prev, companies }));
  }, []);
  
  // Fetch data with improved error handling and caching
  const fetchData = useCallback(async (showRefreshingState = false, bypassCache = false) => {
    try {
      // Clear any pending debounce timers
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      
      if (showRefreshingState) {
        setState(prev => ({ ...prev, isRefreshing: true }));
      }
      
      // Check if we have valid cached data and not forcing refresh
      const now = Date.now();
      if (
        !bypassCache && 
        cacheRef.current && 
        now - cacheRef.current.timestamp < CACHE_EXPIRATION
      ) {
        setState(prev => ({
          ...prev, 
          jobPostings: cacheRef.current!.jobPostings,
          coverLetters: cacheRef.current!.coverLetters,
          companies: cacheRef.current!.companies,
          error: null,
          isLoading: false,
          isRefreshing: showRefreshingState ? false : prev.isRefreshing
        }));
        return;
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
      
      // Use Promise.all for parallel requests - more efficient
      const [jobResponse, letterResponse, companyResponse] = await Promise.all([
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
          .order("created_at", { ascending: false }),
          
        // Fetch companies
        (supabase as any)
          .from('companies')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      ]);
      
      if (jobResponse.error) throw new Error(`Job data error: ${jobResponse.error.message}`);
      if (letterResponse.error) throw new Error(`Letter data error: ${letterResponse.error.message}`);
      
      const jobData = jobResponse.data || [];
      const letterData = letterResponse.data || [];
      const companyData = companyResponse.error ? [] : companyResponse.data || [];
      
      // Update the cache
      cacheRef.current = {
        timestamp: now,
        jobPostings: jobData,
        coverLetters: letterData,
        companies: companyData
      };
      
      // Update state in a single operation
      setState(prev => ({
        ...prev,
        jobPostings: jobData,
        coverLetters: letterData,
        companies: companyData,
        error: null,
        isLoading: false,
        isRefreshing: showRefreshingState ? false : prev.isRefreshing
      }));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err : new Error(errorMessage),
        isLoading: false,
        isRefreshing: showRefreshingState ? false : prev.isRefreshing
      }));
      
      toast({
        title: "Fejl ved indlæsning",
        description: `Der opstod en fejl: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Initial data fetch with debounce
  useEffect(() => {
    // Debounce initial load to prevent multiple rapid fetches
    debounceTimerRef.current = window.setTimeout(() => {
      fetchData();
    }, DEBOUNCE_DELAY);
    
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchData]);

  // Function to manually refresh data - bypass cache
  const refreshData = useCallback(() => fetchData(true, true), [fetchData]);

  return {
    // Data from state
    jobPostings: state.jobPostings,
    coverLetters: state.coverLetters,
    companies: state.companies,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    
    // Actions
    refreshData,
    setJobPostings,
    setCoverLetters,
    setCompanies
  };
};
