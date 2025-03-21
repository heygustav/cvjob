import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useSupabaseClient } from "./useSupabaseClient";

/**
 * Main dashboard data hook for managing dashboard data
 */
interface UseDashboardDataResult {
  jobPostings: any[];
  coverLetters: any[];
  companies: any[];
  isLoading: boolean;
  isRefreshing: boolean;
  isDeleting: boolean;
  error: any;
  deleteJobPosting: (id: string) => Promise<void>;
  deleteCoverLetter: (id: string) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  findJobForLetter: (jobPostingId: string) => any | undefined;
}

export const useDashboardData = (): UseDashboardDataResult => {
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [coverLetters, setCoverLetters] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<any>(null);
  const { user } = useAuth();
  const supabase = useSupabaseClient();

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      setJobPostings([]);
      setCoverLetters([]);
      setCompanies([]);
      return;
    }

    try {
      setError(null);
      
      // Fetch job postings
      const { data: jobData, error: jobError } = await supabase
        .from('job_postings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (jobError) throw jobError;
      
      // Fetch cover letters
      const { data: letterData, error: letterError } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (letterError) throw letterError;
      
      // Fetch companies
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (companyError) throw companyError;

      setJobPostings(jobData || []);
      setCoverLetters(letterData || []);
      setCompanies(companyData || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase, user?.id]);

  // Refresh data
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Delete a job posting
  const deleteJobPosting = async (id: string) => {
    if (!user?.id) return;
    
    try {
      setIsDeleting(true);
      
      // Check if the job posting exists and belongs to the user
      const { data: jobData, error: jobError } = await supabase
        .from('job_postings')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
        
      if (jobError) throw jobError;
      if (!jobData) throw new Error('Job posting not found');
      
      // Delete the job posting
      const { error: deleteError } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (deleteError) throw deleteError;
      
      // Update local state to remove the deleted job posting
      setJobPostings(currentJobPostings => 
        currentJobPostings.filter(job => job.id !== id)
      );
    } catch (err) {
      console.error('Error deleting job posting:', err);
      setError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete a cover letter
  const deleteCoverLetter = async (id: string) => {
    if (!user?.id) return;
    
    try {
      setIsDeleting(true);
      
      // Check if the cover letter exists and belongs to the user
      const { data: letterData, error: letterError } = await supabase
        .from('cover_letters')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
        
      if (letterError) throw letterError;
      if (!letterData) throw new Error('Cover letter not found');
      
      // Delete the cover letter
      const { error: deleteError } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (deleteError) throw deleteError;
      
      // Update local state to remove the deleted cover letter
      setCoverLetters(currentLetters => 
        currentLetters.filter(letter => letter.id !== id)
      );
    } catch (err) {
      console.error('Error deleting cover letter:', err);
      setError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete a company
  const deleteCompany = async (id: string) => {
    if (!user?.id) return;
    
    try {
      setIsDeleting(true);
      
      // Check if the company exists and belongs to the user
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
        
      if (companyError) throw companyError;
      if (!companyData) throw new Error('Company not found');
      
      // Delete the company
      const { error: deleteError } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (deleteError) throw deleteError;
      
      // Update local state to remove the deleted company
      setCompanies(currentCompanies => 
        currentCompanies.filter(company => company.id !== id)
      );
    } catch (err) {
      console.error('Error deleting company:', err);
      setError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Find a job posting for a cover letter
  const findJobForLetter = (jobPostingId: string) => {
    if (!jobPostingId) return undefined;
    return jobPostings.find(job => job.id === jobPostingId);
  };

  return {
    jobPostings,
    coverLetters,
    companies,
    isLoading,
    isRefreshing,
    isDeleting,
    error,
    deleteJobPosting,
    deleteCoverLetter,
    deleteCompany,
    refreshData,
    findJobForLetter
  };
};
