import { ReactNode } from 'react';
import { JobPosting, CoverLetter } from '@/lib/types';

export type LoadingState = "idle" | "initializing" | "loading" | "generating" | "saving";

export interface GenerationProgress {
  phase: string;
  progress: number;
  message: string;
}

export type ToastVariant = "default" | "destructive" | "success";

export type ToastMessage = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  action?: React.ReactElement;
}

export interface ToastMessagesType {
  letterGenerated: {
    title: string;
    description: string;
    variant?: ToastVariant;
  };
  letterEdited: {
    title: string;
    description: string;
    variant?: ToastVariant;
  };
  letterError: {
    title: string;
    description: string;
    variant: "destructive";
  };
  networkError: {
    title: string;
    description: string;
    variant: ToastVariant;
  };
  jobNotFound: {
    title: string;
    description: string;
    variant: ToastVariant;
  };
  letterNotFound: {
    title: string;
    description: string;
    variant: ToastVariant;
  };
  letterUpdated: {
    title: string;
    description: string;
    variant?: ToastVariant;
  };
  letterSaved: {
    title: string;
    description: string;
    variant?: ToastVariant;
  };
  missingFields: {
    title: string;
    description: string;
    variant: ToastVariant;
  };
  generationInProgress: {
    title: string;
    description: string;
    variant?: ToastVariant;
  };
  loginRequired: {
    title: string;
    description: string;
    variant: ToastVariant;
  };
  incompleteProfile: {
    title: string;
    description: string;
    variant: ToastVariant;
  };
  generationTimeout: {
    title: string;
    description: string;
    variant: ToastVariant;
  };
  [key: string]: {
    title: string;
    description: string;
    variant?: ToastVariant;
  };
}

// Types for grouped state setters and refs
export interface GenerationStateSetters {
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  setLoadingState: React.Dispatch<React.SetStateAction<LoadingState | string>>; // Use LoadingState or broader string
  setSelectedJob: React.Dispatch<React.SetStateAction<JobPosting | null>>;
  setGeneratedLetter: React.Dispatch<React.SetStateAction<CoverLetter | null>>;
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>;
  setGenerationPhase: React.Dispatch<React.SetStateAction<string | null>>; // Consider specific phase type
  setGenerationProgress: React.Dispatch<React.SetStateAction<GenerationProgress>>;
}

export interface GenerationRefs {
  isMountedRef: React.MutableRefObject<boolean>;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  generationAttemptRef: React.MutableRefObject<number>; // Assuming it holds a number
}
