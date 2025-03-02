
import { JobFormData } from "@/services/coverLetter/types";

export interface GenerationOptions {
  currentAttempt: number;
  abortController: AbortController;
}

export interface GenerationResult {
  letter: any;
  job: any;
}

export interface GenerationHandlers {
  handleTimeout: (timeoutId: number | null) => void;
  handleSuccess: (result: GenerationResult) => void;
  handleError: (error: any, currentAttempt: number, timeoutId: number | null) => void;
}
