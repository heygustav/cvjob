
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Company, JobPosting, CoverLetter } from "@/lib/types";
import { useDashboardFetch } from "./useDashboardFetch";
import { useJobOperations } from "./useJobOperations";
import { useLetterOperations } from "./useLetterOperations";
import { useCompanyOperations } from "./useCompanyOperations";
import { useJobLetterUtils } from "./useJobLetterUtils";

export const useDashboardData = () => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // Use the fetch hook for data loading
  const {
    jobPostings,
    coverLetters,
    companies,
    isLoading,
    isRefreshing,
    error,
    refreshData,
    setJobPostings,
    setCoverLetters
  } = useDashboardFetch();

  // Use the job operations hook for job-related actions
  const { deleteJobPosting } = useJobOperations(
    jobPostings,
    coverLetters,
    setJobPostings,
    setCoverLetters
  );

  // Use the letter operations hook for letter-related actions
  const { deleteCoverLetter } = useLetterOperations(
    coverLetters,
    setCoverLetters
  );

  // Use the company operations hook for company-related actions
  const { deleteCompany } = useCompanyOperations(
    companies,
    user?.id
  );

  // Use the utility hook for finding jobs for letters
  const { findJobForLetter } = useJobLetterUtils(jobPostings);

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
