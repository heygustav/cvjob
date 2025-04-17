
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

export const useDashboardData = () => {
  const { user } = useAuth();

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
  const { mutateAsync: deleteJob, isLoading: isJobDeleting } = useDeleteJobMutation();
  const { mutateAsync: deleteLetter, isLoading: isLetterDeleting } = useDeleteLetterMutation();
  const { mutateAsync: deleteCompany, isLoading: isCompanyDeleting } = useDeleteCompanyMutation();

  // Utility hooks
  const { findJobForLetter } = useJobLetterUtils(jobPostings);

  const isLoading = isJobsLoading || isLettersLoading || isCompaniesLoading;
  const isRefreshing = isJobsRefetching || isLettersRefetching || isCompaniesRefetching;
  const isDeleting = isJobDeleting || isLetterDeleting || isCompanyDeleting;

  return {
    jobPostings,
    coverLetters,
    companies,
    isLoading,
    isRefreshing,
    isDeleting,
    error: null, // React Query handles errors internally
    deleteJobPosting: deleteJob,
    deleteCoverLetter: deleteLetter,
    deleteCompany,
    findJobForLetter,
  };
};
