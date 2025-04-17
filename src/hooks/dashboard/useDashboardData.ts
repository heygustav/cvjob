
import { useAuth } from "@/components/AuthProvider";
import { JobPosting } from "@/lib/types";
import { 
  useJobPostingsQuery,
  useCoverLettersQuery,
  useCompaniesQuery,
  useDeleteJobMutation,
  useDeleteLetterMutation,
  useDeleteCompanyMutation
} from "./queries";
import { useJobLetterUtils } from "./useJobLetterUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useDashboardData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  // Queries
  const { 
    data: jobPostings = [], 
    isLoading: isJobsLoading,
    isRefetching: isJobsRefetching 
  } = useJobPostingsQuery(user?.id);
  
  const { 
    data: coverLetters = [], 
    isLoading: isLettersLoading,
    isRefetching: isLettersRefetching 
  } = useCoverLettersQuery(user?.id);
  
  const { 
    data: companies = [], 
    isLoading: isCompaniesLoading,
    isRefetching: isCompaniesRefetching 
  } = useCompaniesQuery(user?.id);

  // Mutations
  const { mutateAsync: deleteJob } = useDeleteJobMutation();
  const { mutateAsync: deleteLetter } = useDeleteLetterMutation();
  const { mutateAsync: deleteCompany } = useDeleteCompanyMutation();

  // Utility hooks
  const { findJobForLetter } = useJobLetterUtils(jobPostings);

  // Function to refresh all data
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['jobPostings', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['coverLetters', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['companies', user?.id] });
  };

  // Wrap delete operations to track global delete status
  const deleteJobPosting = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteJob(id);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteCoverLetter = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteLetter(id);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteCompanyHandler = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteCompany(id);
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = isJobsLoading || isLettersLoading || isCompaniesLoading;
  const isRefreshing = isJobsRefetching || isLettersRefetching || isCompaniesRefetching;

  return {
    jobPostings,
    coverLetters,
    companies,
    isLoading,
    isRefreshing,
    isDeleting,
    error: null, // React Query handles errors internally
    deleteJobPosting,
    deleteCoverLetter,
    deleteCompany: deleteCompanyHandler,
    findJobForLetter,
    refreshData,
  };
};
