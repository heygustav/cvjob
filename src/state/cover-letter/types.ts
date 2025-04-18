
import { CoverLetter, JobPosting, User } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { GenerationProgress } from "@/hooks/coverLetter/types";

export type LoadingState = 
  | "idle" 
  | "initializing" 
  | "generating" 
  | "saving";

export interface CoverLetterState {
  // UI state
  step: 1 | 2;
  isLoading: boolean;
  isGenerating: boolean;
  loadingState: LoadingState;
  error: string | null;
  
  // Generation state
  generationPhase: string | null;
  generationProgress: GenerationProgress;
  
  // Data
  jobData: JobFormData;
  selectedJob: JobPosting | null;
  generatedLetter: CoverLetter | null;
  
  // User data
  user: User | null;
  subscriptionStatus: any;
}

export type CoverLetterAction =
  | { type: 'SET_STEP'; payload: 1 | 2 }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_LOADING_STATE'; payload: LoadingState }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_ERROR' }
  | { type: 'SET_GENERATION_PHASE'; payload: string | null }
  | { type: 'SET_GENERATION_PROGRESS'; payload: GenerationProgress }
  | { type: 'SET_JOB_DATA'; payload: JobFormData }
  | { type: 'SET_SELECTED_JOB'; payload: JobPosting | null }
  | { type: 'SET_GENERATED_LETTER'; payload: CoverLetter | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_SUBSCRIPTION_STATUS'; payload: any };
