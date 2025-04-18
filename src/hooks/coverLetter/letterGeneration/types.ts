import { User, JobPosting, CoverLetter } from "@/lib/types";
import { GenerationProgress } from "../types";
import { JobFormData } from "@/services/coverLetter/types";

// Result of generation process
export interface GenerationResult {
  job: JobPosting;
  letter: CoverLetter;
}

// Tracking tools for generation process
export interface GenerationTrackingTools {
  abortGeneration: () => AbortController;
  incrementAttempt: (ref: React.MutableRefObject<number>) => number;
  updatePhase: (phase: GenerationPhase, progress: number, message: string) => void;
}

// Error handling tools
export interface ErrorHandlingTools {
  handleGenerationError: (error: Error) => void;
  resetError: () => void;
}

// Phases in the generation process
export type GenerationPhase = 'job-save' | 'user-fetch' | 'generation' | 'letter-save';

// State setters used across generation hooks
export interface GenerationStateSetters {
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  setLoadingState: React.Dispatch<React.SetStateAction<string>>;
  setSelectedJob: React.Dispatch<React.SetStateAction<JobPosting | null>>;
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>;
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>;
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>;
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>;
}

// Configuration for job form submission
export interface JobFormSubmitConfig {
  user: User | null;
  loadingState: string;
  selectedJob: JobPosting | null;
  isMountedRef: React.MutableRefObject<boolean>;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  generationTracking: GenerationTrackingTools;
  safeSetState: <T>(stateSetter: React.Dispatch<React.SetStateAction<T>>, value: T) => void;
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>;
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>;
  setLoadingState: React.Dispatch<React.SetStateAction<string>>;
  setSelectedJob: React.Dispatch<React.SetStateAction<JobPosting | null>>;
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>;
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  errorHandling: ErrorHandlingTools;
}

// Timeout configuration
export interface TimeoutConfig {
  timeoutMs?: number;
  handleTimeoutCallback: (error: Error) => void;
}
