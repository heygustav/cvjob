
import { JobPosting, CoverLetter } from "@/lib/types";
import { GenerationPhase } from "./generation-tracking/types";
import { JobFormData } from "@/services/coverLetter/types";

// Loading state type with specific values
export type LoadingState = "idle" | "initializing" | "generating" | "saving";

// Progress tracking interface with specific phase type
export interface GenerationProgress {
  phase: GenerationPhase;
  progress: number; // 0-100
  message: string;
}

// Hook return type with specific types
export interface CoverLetterGenerationReturn {
  step: 1 | 2;
  isGenerating: boolean;
  isLoading: boolean;
  loadingState: LoadingState;
  generationPhase: GenerationPhase | null;
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

// Toast message type with specific variants
export type ToastVariant = "default" | "destructive" | "success";

export interface ToastMessage {
  title: string;
  description: string;
  variant?: ToastVariant;
}

// Toast messages type with specific message structure
export type ToastMessagesType = {
  [K in keyof typeof defaultToastMessages]: ToastMessage;
};

// Define the default toast messages
const defaultToastMessages = {
  networkError: {
    title: "Netværksfejl",
    description: "Der opstod en fejl med netværksforbindelsen. Prøv igen.",
    variant: "destructive" as const
  },
  jobNotFound: {
    title: "Job ikke fundet",
    description: "Det ønskede job kunne ikke findes.",
    variant: "destructive" as const
  },
  letterNotFound: {
    title: "Kandidatbesked ikke fundet",
    description: "Det ønskede kandidatbesked kunne ikke findes.",
    variant: "destructive" as const
  },
  letterGenerated: {
    title: "Kandidatbesked genereret",
    description: "Kandidatbeskedet er blevet genereret.",
  },
  letterUpdated: {
    title: "Kandidatbesked opdateret",
    description: "Kandidatbeskedet er blevet opdateret.",
  },
  letterSaved: {
    title: "Kandidatbesked gemt",
    description: "Kandidatbeskedet er blevet gemt.",
  },
  missingFields: {
    title: "Udfyldt ikke alle felter",
    description: "Du har ikke udfyldt alle nødvendige felter.",
    variant: "destructive" as const
  },
  generationInProgress: {
    title: "Generering i gang",
    description: "Genereringen af kandidatbeskedet er i gang.",
  },
  loginRequired: {
    title: "Log ind på din konto",
    description: "Du skal være logget ind for at generere en kandidatbesked.",
    variant: "destructive" as const
  },
  incompleteProfile: {
    title: "Ufærdig profil",
    description: "Din profil er ikke fuldt ud.",
    variant: "default" as const
  },
  generationTimeout: {
    title: "Genereringstidspunktet er overskredet",
    description: "Genereringen af kandidatbeskedet har overskredet det tilladte tidspunkt.",
    variant: "destructive" as const
  }
} as const;
