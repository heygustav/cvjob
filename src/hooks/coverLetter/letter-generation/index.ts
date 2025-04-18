
import { User } from "@/lib/types";

// Simple stub implementation to prevent import errors
export const useCoverLetterGeneration = (user: User | null) => {
  return {
    step: 1,
    isGenerating: false,
    isLoading: false,
    loadingState: "idle",
    generationPhase: null,
    generationProgress: { phase: 'generation', progress: 0, message: "" },
    selectedJob: null,
    generatedLetter: null,
    generationError: null,
    setStep: () => {},
    fetchJob: async () => null,
    fetchLetter: async () => null,
    handleJobFormSubmit: async () => {},
    handleEditLetter: async () => {},
    handleSaveLetter: async () => {},
    saveJobAsDraft: async () => null,
    resetError: () => {},
  };
};
