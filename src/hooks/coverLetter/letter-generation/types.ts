
import { JobFormData } from "@/services/coverLetter/types";
import { GenerationPhase } from "../generation-tracking/types";

export interface GenerationOptions {
  currentAttempt: number;
  abortController: AbortController;
}

export interface GenerationResult {
  letter: CoverLetterData;
  job: JobData;
}

export interface CoverLetterData {
  id: string;
  content: string;
  job_posting_id: string;
  user_id: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface JobData {
  id: string;
  title: string;
  company: string;
  description: string;
  contact_person?: string | null;
  url?: string | null;
  deadline?: string | null;
  user_id: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface GenerationHandlers {
  handleTimeout: (timeoutId: number | null) => void;
  handleSuccess: (result: GenerationResult) => void;
  handleError: (error: unknown, currentAttempt: number, timeoutId: number | null) => void;
}

export type GenerationState = {
  isGenerating: boolean;
  generationPhase: GenerationPhase | null;
  progress: number;
  message: string;
};
