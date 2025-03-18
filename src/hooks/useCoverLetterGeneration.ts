
import { User } from "@/lib/types";
import { useCoverLetterGeneration as useRefactoredCoverLetterGeneration } from "./coverLetter/letter-generation";

/**
 * Main hook for cover letter generation functionality
 * Re-exports the refactored implementation
 */
export const useCoverLetterGeneration = (user: User | null) => {
  return useRefactoredCoverLetterGeneration(user);
};
