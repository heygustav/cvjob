
import { User, JobPosting, CoverLetter } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";

// Error types
export interface GenerationError extends Error {
  phase: 'job-save' | 'user-fetch' | 'generation' | 'letter-save';
  recoverable: boolean;
}

// Loading state type
export type LoadingState = "idle" | "initializing" | "generating" | "saving";

// Generation phase type
export type GenerationPhase = 'job-save' | 'user-fetch' | 'generation' | 'letter-save' | null;

// Progress tracking interface
export interface GenerationProgress {
  phase: 'job-save' | 'user-fetch' | 'generation' | 'letter-save';
  progress: number; // 0-100
  message: string;
}

// Hook return type
export interface CoverLetterGenerationReturn {
  step: 1 | 2;
  isGenerating: boolean;
  isLoading: boolean;
  loadingState: LoadingState;
  generationPhase: string | null;
  generationProgress: GenerationProgress;
  selectedJob: JobPosting | null;
  generatedLetter: CoverLetter | null;
  generationError: string | null;
  setStep: (step: 1 | 2) => void;
  fetchJob: (id: string) => Promise<JobPosting | null>;
  fetchLetter: (id: string) => Promise<CoverLetter | null>;
  handleJobFormSubmit: (jobData: JobFormData) => Promise<void>;
  handleEditLetter: (updatedContent: string) => Promise<void>;
  handleSaveLetter: () => void;
  resetError: () => void;
}

// Toast message type
export type ToastMessagesType = {
  networkError: {
    title: string;
    description: string;
    variant: "destructive";
  };
  jobNotFound: {
    title: string;
    description: string;
    variant: "destructive";
  };
  letterNotFound: {
    title: string;
    description: string;
    variant: "destructive";
  };
  letterGenerated: {
    title: string;
    description: string;
  };
  letterUpdated: {
    title: string;
    description: string;
  };
  letterSaved: {
    title: string;
    description: string;
  };
  missingFields: {
    title: string;
    description: string;
    variant: "destructive";
  };
  generationInProgress: {
    title: string;
    description: string;
  };
  loginRequired: {
    title: string;
    description: string;
    variant: "destructive";
  };
  incompleteProfile: {
    title: string;
    description: string;
    variant: "default";
  };
  generationTimeout: {
    title: string;
    description: string;
    variant: "destructive";
  };
};
