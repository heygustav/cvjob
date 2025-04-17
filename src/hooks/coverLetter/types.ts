
import { User, JobPosting, CoverLetter } from "@/lib/types";
import { JobFormData } from "@/services/coverLetter/types";
import { ToastVariant } from "@/hooks/use-toast";

export interface ToastMessage {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  action?: React.ReactElement;
}

export interface ToastMessagesType {
  networkError: ToastMessage;
  jobNotFound: ToastMessage;
  letterNotFound: ToastMessage;
  letterGenerated: ToastMessage;
  letterUpdated: ToastMessage;
  letterSaved: ToastMessage;
  missingFields: ToastMessage;
  generationInProgress: ToastMessage;
  loginRequired: ToastMessage;
  incompleteProfile: ToastMessage;
  generationTimeout: ToastMessage;
}

export type GeneratorInitFunction = (params: {
  jobId?: string;
  letterId?: string;
  userData: JobFormData;
}) => Promise<void>;

export interface GenerationProgress {
  phase: string;
  progress: number;
  message: string;
}

export type LoadingState = "idle" | "initializing" | "generating" | "saving" | "loading";
