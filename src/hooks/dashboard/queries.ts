import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobPosting, CoverLetter, Company } from "@/lib/types";

export const useJobPostingsQuery = (userId?: string) => {
  return useQuery({
    queryKey: ['jobPostings', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as JobPosting[];
    },
    enabled: !!userId,
  });
};

export const useCoverLettersQuery = (userId?: string) => {
  return useQuery({
    queryKey: ['coverLetters', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      
      const { data, error } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CoverLetter[];
    },
    enabled: !!userId,
  });
};

export const useCompaniesQuery = (userId?: string) => {
  return useQuery({
    queryKey: ['companies', userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useDeleteJobMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase
        .from("job_postings")
        .delete()
        .eq("id", jobId);
      
      if (error) throw error;
    },
    onSuccess: (_, jobId) => {
      queryClient.setQueryData<JobPosting[]>(['jobPostings'], (old) => 
        old?.filter(job => job.id !== jobId) ?? []
      );
    },
  });
};

export const useDeleteLetterMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (letterId: string) => {
      const { error } = await supabase
        .from("cover_letters")
        .delete()
        .eq("id", letterId);
      
      if (error) throw error;
    },
    onSuccess: (_, letterId) => {
      queryClient.setQueryData<CoverLetter[]>(['coverLetters'], (old) => 
        old?.filter(letter => letter.id !== letterId) ?? []
      );
    },
  });
};

export const useDeleteCompanyMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (companyId: string) => {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq("id", companyId);
      
      if (error) throw error;
    },
    onSuccess: (_, companyId) => {
      queryClient.setQueryData(['companies'], (old: any[]) => 
        old?.filter(company => company.id !== companyId) ?? []
      );
    },
  });
};
