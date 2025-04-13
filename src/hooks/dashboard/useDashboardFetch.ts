
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

/**
 * Hook for fetching dashboard data (jobs and cover letters) with optimizations:
 * - Debounced fetching to prevent rapid successive calls
 * - Cache for preventing duplicate fetches in short time periods
 * - Better error handling with structured errors
 */
export const useDashboardFetch = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Use a ref for caching data to avoid unnecessary re-renders
  const cacheRef = useRef<DataCache | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  
  // Cache expiration time in milliseconds (5 minutes)
  const CACHE_EXPIRATION = 5 * 60 * 1000;
  
  const fetchData = useCallback(async (showRefreshingState = false, bypassCache = false) => {
    try {
      // Clear any pending debounce timers
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      
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
        setCompanies(cacheRef.current.companies);
        setError(null);
        setIsLoading(false);
        if (showRefreshingState) {
          setIsRefreshing(false);
        }
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
      const [jobResponse, letterResponse, companiesResponse] = await Promise.all([
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
          
        // Custom fetch for companies - using custom query to handle table not in schema
        // This is a workaround for TypeScript type issues
        fetch(`${supabase.supabaseUrl}/rest/v1/companies?user_id=eq.${userId}&order=created_at.desc`, {
          headers: {
            'apikey': supabase.supabaseKey,
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
      ]);
      
      if (jobResponse.error) throw new Error(`Job data error: ${jobResponse.error.message}`);
      if (letterResponse.error) throw new Error(`Letter data error: ${letterResponse.error.message}`);
      
      const jobData = jobResponse.data || [];
      const letterData = letterResponse.data || [];
      
      // Process company data to match the Company interface
      const companiesData: Company[] = Array.isArray(companiesResponse) 
        ? companiesResponse.map(company => ({
            id: company.id,
            name: company.name || '',
            description: company.description,
            website: company.website,
            contact_person: company.contact_person,
            contact_email: company.contact_email,
            contact_phone: company.contact_phone,
            notes: company.notes,
            created_at: company.created_at,
            updated_at: company.updated_at,
            user_id: company.user_id
          }))
        : [];
      
      // Update the cache
      cacheRef.current = {
        timestamp: now,
        jobPostings: jobData,
        coverLetters: letterData,
        companies: companiesData
      };
      
      setJobPostings(jobData);
      setCoverLetters(letterData);
      setCompanies(companiesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Fejl ved indlæsning",
        description: `Der opstod en fejl: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (showRefreshingState) {
        setIsRefreshing(false);
      }
    }
  }, [toast]);

  // Initial data fetch with debounce
  useEffect(() => {
    // Debounce initial load by 100ms to prevent multiple rapid fetches
    debounceTimerRef.current = window.setTimeout(() => {
      fetchData();
    }, 100);
    
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchData]);

  // Function to manually refresh data - bypass cache
  const refreshData = useCallback(() => fetchData(true, true), [fetchData]);

  return {
    jobPostings,
    coverLetters,
    companies,
    isLoading,
    isRefreshing,
    error,
    refreshData,
    setJobPostings,
    setCoverLetters,
    setCompanies
  };
};
