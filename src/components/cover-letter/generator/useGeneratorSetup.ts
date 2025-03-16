
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLetterFetching } from "@/hooks/coverLetter/useLetterFetching";
import { useSubscription } from "@/hooks/useSubscription";
import { GenerationProgress } from "@/hooks/coverLetter/types";
import { CoverLetter, JobPosting, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";

import { useGeneratorState } from "./useGeneratorState";
import { useSafeState } from "./useSafeState";
import { useUrlParams } from "./useUrlParams";
import { useExistingLetter } from "./useExistingLetter";
import { useCompleteUser } from "./useCompleteUser";

interface GeneratorSetupResult {
  step: 1 | 2;
  jobData: JobFormData;
  generatedLetter: CoverLetter | null;
  isLoading: boolean;
  error: string | null;
  isGenerating: boolean;
  generationPhase: string | null;
  loadingState: string;
  selectedJob: JobPosting | null;
  generationProgress: GenerationProgress;
  completeUser: User | null;
  subscriptionStatus: any;
  isMountedRef: React.MutableRefObject<boolean>;
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void;
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  setJobData: React.Dispatch<React.SetStateAction<JobFormData>>;
  setSelectedJob: React.Dispatch<React.SetStateAction<JobPosting | null>>;
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>;
  fetchLetter: (id: string) => Promise<CoverLetter | null>;
  resetError: () => void;
}

export const useGeneratorSetup = (existingLetterId?: string): GeneratorSetupResult => {
  const { user: authUser } = useAuth();
  // Use our state management hook
  const {
    step, setStep,
    jobData, setJobData,
    generatedLetter, setGeneratedLetter,
    isLoading, setIsLoading,
    error, setError,
    isGenerating, setIsGenerating,
    generationPhase, setGenerationPhase,
    loadingState, setLoadingState,
    selectedJob, setSelectedJob,
    generationProgress, setGenerationProgress,
    resetError
  } = useGeneratorState();

  // Use safe state management
  const { isMountedRef, safeSetState } = useSafeState();
  
  // Handle URL parameters
  useUrlParams(existingLetterId);
  
  // Get the complete user object
  const completeUser = useCompleteUser(authUser);
  
  // Initialize hook with required arguments
  const { fetchLetter } = useLetterFetching(
    completeUser,
    isMountedRef,
    safeSetState,
    setSelectedJob,
    setGeneratedLetter,
    setStep,
    setLoadingState,
    setError,
    setGenerationPhase,
    setGenerationProgress
  );
  
  // Handle existing letter
  useExistingLetter({
    existingLetterId,
    completeUser,
    isMountedRef,
    setStep,
    fetchLetter
  });
  
  // Pass the completeUser object to useSubscription
  const { subscriptionStatus, fetchSubscriptionStatus } = useSubscription(completeUser);

  // Fetch subscription status on mount - pass the user ID to the function
  useEffect(() => {
    if (completeUser?.id) {
      fetchSubscriptionStatus(completeUser.id);
    }
  }, [completeUser?.id, fetchSubscriptionStatus]);

  return {
    step,
    jobData,
    generatedLetter,
    isLoading,
    error,
    isGenerating,
    generationPhase,
    loadingState,
    selectedJob,
    generationProgress,
    completeUser,
    subscriptionStatus,
    isMountedRef,
    safeSetState,
    setStep,
    setJobData,
    setSelectedJob,
    setGeneratedLetter,
    fetchLetter,
    resetError,
  };
};
