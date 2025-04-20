
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CoverLetter, JobPosting, Company } from '@/lib/types';

// Query function to fetch job postings
const fetchJobPostings = async (userId: string | undefined): Promise<JobPosting[]> => {
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('job_postings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// Query function to fetch cover letters
const fetchCoverLetters = async (userId: string | undefined): Promise<CoverLetter[]> => {
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('cover_letters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// Query function to fetch companies
const fetchCompanies = async (userId: string | undefined): Promise<Company[]> => {
  if (!userId) return [];
  
  // Use a custom query for companies since it might not be in the type definition
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// Delete functions
const deleteJob = async (jobId: string): Promise<void> => {
  const { error } = await supabase
    .from('job_postings')
    .delete()
    .eq('id', jobId);
  
  if (error) throw error;
};

const deleteLetter = async (letterId: string): Promise<void> => {
  const { error } = await supabase
    .from('cover_letters')
    .delete()
    .eq('id', letterId);
  
  if (error) throw error;
};

const deleteCompany = async (companyId: string): Promise<void> => {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', companyId);
  
  if (error) throw error;
};

// React Query hooks
export const useJobPostingsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['jobPostings', userId],
    queryFn: () => fetchJobPostings(userId),
    enabled: !!userId,
  });
};

export const useCoverLettersQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['coverLetters', userId],
    queryFn: () => fetchCoverLetters(userId),
    enabled: !!userId,
  });
};

export const useCompaniesQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['companies', userId],
    queryFn: () => fetchCompanies(userId),
    enabled: !!userId,
  });
};

// Mutation hooks
export const useDeleteJobMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteJob,
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
    },
  });
};

export const useDeleteLetterMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteLetter,
    onSuccess: (_, letterId) => {
      queryClient.invalidateQueries({ queryKey: ['coverLetters'] });
    },
  });
};

export const useDeleteCompanyMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: (_, companyId) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });
};
