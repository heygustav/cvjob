
import { useDashboardFetch } from "./dashboard/useDashboardFetch";
import { useJobOperations } from "./dashboard/useJobOperations";
import { useLetterOperations } from "./dashboard/useLetterOperations";
import { useJobLetterUtils } from "./dashboard/useJobLetterUtils";

/**
 * Main dashboard data hook that composes smaller, focused hooks
 */
export const useDashboardData = () => {
  // Fetch data (jobs and cover letters)
  const {
    jobPostings,
    coverLetters,
    isLoading,
    isRefreshing,
    error,
    refreshData,
    setJobPostings,
    setCoverLetters
  } = useDashboardFetch();

  // Job operations
  const { 
    isDeleting: isJobDeleting, 
    deleteJobPosting 
  } = useJobOperations(jobPostings, coverLetters, setJobPostings, setCoverLetters);

  // Letter operations
  const { 
    isDeleting: isLetterDeleting, 
    deleteCoverLetter 
  } = useLetterOperations(coverLetters, setCoverLetters);

  // Utility functions
  const { findJobForLetter } = useJobLetterUtils(jobPostings);

  // Combine the isDeleting states
  const isDeleting = isJobDeleting || isLetterDeleting;

  return {
    jobPostings,
    coverLetters,
    isLoading,
    isDeleting,
    isRefreshing,
    error,
    deleteJobPosting,
    deleteCoverLetter,
    refreshData,
    findJobForLetter
  };
};
