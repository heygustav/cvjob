
// Export the main hooks and utilities
export * from "./types";
export * from "./utils";
export { useJobFormSubmit } from "./useJobFormSubmit";

// Convenience function to create a complete cover letter generation hook
import { User, JobPosting, CoverLetter } from "@/lib/types";

// Simple stub implementation that can be expanded as needed
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
