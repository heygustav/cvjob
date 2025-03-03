import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLetterFetching } from "@/hooks/coverLetter/useLetterFetching";
import { useSubscription } from "@/hooks/useSubscription";
import { JobFormData } from "@/services/coverLetter/types";
import { CoverLetter, JobPosting, User } from "@/lib/types";
import { GenerationProgress } from "@/hooks/coverLetter/types";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);
  const [jobData, setJobData] = useState<JobFormData>({
    title: "",
    company: "",
    description: "",
  });
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState("idle");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    phase: 'letter-save',
    progress: 0,
    message: 'Loading letter...'
  });
  
  // Create refs and safe setState function needed by the hooks
  const isMountedRef = useRef(true);
  const safeSetState = <T,>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    if (isMountedRef.current) {
      stateSetter(value);
    }
  };
  
  // Ensure user has all required properties by creating a complete User object
  const completeUser: User | null = authUser ? {
    id: authUser.id || "",
    email: authUser.email || "",
    name: authUser.user_metadata?.name || "",
    phone: authUser.user_metadata?.phone || "",
    address: authUser.user_metadata?.address || "",
    profileComplete: !!authUser.user_metadata?.profileComplete
  } : null;
  
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
  
  // Pass the completeUser object to useSubscription
  const { subscriptionStatus, fetchSubscriptionStatus } = useSubscription(completeUser);

  // Fetch subscription status on mount - pass the user ID to the function
  useEffect(() => {
    if (completeUser?.id) {
      fetchSubscriptionStatus(completeUser.id);
    }
  }, [completeUser?.id, fetchSubscriptionStatus]);

  // Reset any error
  const resetError = () => {
    setError(null);
    setIsGenerating(false);
    setLoadingState("idle");
  };

  // Handle existing letter
  useEffect(() => {
    const loadExistingLetter = async () => {
      if (existingLetterId && completeUser?.id) {
        try {
          const letter = await fetchLetter(existingLetterId);
          if (letter) {
            setGeneratedLetter(letter);
            setStep(2);
          }
        } catch (error) {
          console.error("Error fetching letter:", error);
        }
      }
    };

    loadExistingLetter();
  }, [existingLetterId, completeUser?.id, fetchLetter]);

  // Handle job ID from URL
  useEffect(() => {
    if (jobId && !existingLetterId) {
      navigate(`/generator?jobId=${jobId}`);
    }
  }, [jobId, existingLetterId, navigate]);

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
